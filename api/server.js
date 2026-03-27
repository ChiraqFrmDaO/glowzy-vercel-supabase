import express from 'express';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { readdirSync } from 'fs';
import cors from 'cors';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import dotenv from 'dotenv';
import Stripe from 'stripe';
import { TOTP, NobleCryptoPlugin, ScureBase32Plugin } from 'otplib';
import QRCode from 'qrcode';
import bodyParser from 'body-parser';
import { pool, supabase } from '../server/supabase-client.js';

// Initialize TOTP with crypto and base32 plugins
const totp = new TOTP({
  crypto: new NobleCryptoPlugin(),
  base32: new ScureBase32Plugin()
});

dotenv.config();

// Initialize Stripe
const stripe = Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

const app = express();

app.use(cors());

// ⚠️ Stripe webhook MOET raw body hebben — VOOR express.json()
app.post('/api/stripe/webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.log('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const type = session.metadata?.type;
    const userId = session.metadata?.userId || session.metadata?.user_id;

    try {
      if (type === 'premium' && userId) {
        await pool.execute(
          'UPDATE profiles SET is_premium = true, stripe_customer_id = ?, updated_at = NOW() WHERE user_id = ?',
          [session.customer, userId]
        );
        console.log(`✅ User ${userId} upgraded to premium`);

      } else if (type === 'glowzycoins' && userId) {
        const glowzycoins = parseInt(session.metadata.glowzycoins);
        await pool.execute(
          'INSERT INTO user_glowzycoin (user_id, balance) VALUES (?, ?) ON DUPLICATE KEY UPDATE balance = balance + ?',
          [userId, glowzycoins, glowzycoins]
        );
        await pool.execute(
          'INSERT INTO glowzycoin_transactions (user_id, amount, transaction_type, reference_id, description) VALUES (?, ?, ?, ?, ?)',
          [userId, glowzycoins, 'purchase', session.id, `Purchase of ${glowzycoins} Glowzycoins`]
        );
        console.log(`✅ Added ${glowzycoins} Glowzycoins to user ${userId}`);
      } else if (type === 'product' && userId) {
        const productName = session.metadata.product_name;
        console.log(`✅ User ${userId} purchased: ${productName}`);

        const PRODUCT_BADGE_MAP = {
          "Verified Badge": "Verified",
          "Custom Badge":   "Custom Badge",
          "Donator Badge":  "Donor",
          "Rich Badge":     "Rich",
          "Gold Badge":     "Gold",
          "Atlas Token":    "Atlas Token",
        };

        const badgeName = PRODUCT_BADGE_MAP[productName];
        if (badgeName) {
          const [badgeRows] = await pool.execute(
            'SELECT id FROM badges WHERE name = ?',
            [badgeName]
          );
          if (badgeRows.length > 0) {
            await pool.execute(
              'INSERT IGNORE INTO user_badges (user_id, badge_id, enabled) VALUES (?, ?, true)',
              [userId, badgeRows[0].id]
            );
            console.log(`✅ Badge "${badgeName}" granted to user ${userId}`);
          }
        }
      }
    } catch (err) {
      console.error('❌ Error processing webhook:', err);
    }
  }

  if (event.type === 'invoice.payment_failed') {
    const invoice = event.data.object;
    console.log(`⚠️ Payment failed for customer ${invoice.customer}`);
  }

  res.json({ received: true });
});

app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ extended: true, limit: "500mb" }));
app.use("/assets", express.static(path.join(path.dirname(new URL(import.meta.url).pathname), "../dist/assets")));
app.use(express.static(path.join(path.dirname(new URL(import.meta.url).pathname), "../dist")));

// configure upload directory - use /tmp for Vercel serverless
const uploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), 'data', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Serve uploaded files publicly (template preview images, etc.)
app.use('/uploads', express.static(uploadDir));

const upload = multer({ 
  dest: uploadDir,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 500 * 1024 * 1024, // 500MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images, audio, video, and cursor files
    const allowedTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
      'audio/mpeg',
      'audio/mp3',
      'audio/wav',
      'audio/ogg',
      'video/mp4',
      'video/webm',
      'video/ogg',
      'image/x-icon',
      'image/vnd.microsoft.icon',
      'image/x-win-bitmap'
    ];
    
    // Also check file extension
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.mp3', '.wav', '.ogg', '.mp4', '.webm', '.cur', '.ico', '.bmp'];
    const fileExtension = path.extname(file.originalname).toLowerCase();
    
    if (allowedTypes.includes(file.mimetype) || allowedExtensions.includes(fileExtension)) {
      cb(null, true);
    } else {
      console.log('Rejected file:', file.originalname, 'Mimetype:', file.mimetype, 'Extension:', fileExtension);
      cb(new Error('Invalid file type. Allowed types: images, audio, video, .cur files'));
    }
  },
  onError: (err, next) => {
    console.error('Multer error:', err);
    next(err);
  }
});

// Test DB connection
supabase.from('users').select('count').then(({ data, error }) => {
  if (error) {
    console.error("❌ Database connection failed:", error.message);
  } else {
    console.log("✅ Database connected");
  }
});

function getAssetFiles() {
  const distPath = path.join(path.dirname(new URL(import.meta.url).pathname), "../dist/assets");
  try {
    const files = readdirSync(distPath);
    const js = files.find(f => f.startsWith('index-') && f.endsWith('.js'));
    const css = files.find(f => f.startsWith('index-') && f.endsWith('.css'));
    return { js: js || '', css: css || '' };
  } catch {
    return { js: '', css: '' };
  }
}

function authenticate(req, res, next) {
  const auth = req.headers.authorization?.split(" ")[1];
  if (!auth) return res.status(401).end();

  try {
    req.user = jwt.verify(auth, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).end();
  }
}

/* =========================
   AUTH
========================= */

app.post("/api/auth/register", async (req, res) => {

  try {

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "Missing fields" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const [userResult] = await pool.execute(
      "INSERT INTO users (username,email,password) VALUES (?,?,?)",
      [username, email, hashedPassword]
    );

    const userId = userResult.insertId;

    const [profileResult] = await pool.execute(
      "INSERT INTO profiles (user_id, username, display_name, email) VALUES (?,?,?,?)",
      [userId, username, username, email]
    );

    const profileId = profileResult.insertId;
    
    // Also create empty profile customization
    await pool.execute(
      "INSERT INTO profile_customization (user_id) VALUES (?)",
      [userId]
    );

    const token = jwt.sign(
      { sub: userId.toString(), email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token });

  } catch (error) {

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "User already exists" });
    }

    throw error;

  }
});

app.post("/api/auth/login", async (req, res) => {

  try {

    const { email, password } = req.body;
    console.log("Login attempt:", { email, password: password ? '***' : 'undefined' });

    const [rows] = await pool.execute(
      "SELECT * FROM users WHERE email=?",
      [email]
    );

    const user = rows[0];
    console.log("User found:", user ? 'yes' : 'no');

    if (!user) {
      console.log("User not found");
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Compare hashed password
    console.log("Comparing password...");
    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log("Password valid:", isValidPassword);
    
    if (!isValidPassword) {
      console.log("Invalid password");
      return res.status(401).json({ error: "Invalid credentials" });
    }

    console.log("Creating token...");
    const token = jwt.sign(
      { sub: user.id.toString(), email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("Login successful");
    res.json({ token });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }

});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// For Vercel serverless functions
export default async function handler(req, res) {
  return app(req, res);
}
