import express, { Request, Response, NextFunction } from 'express';
import mysql from 'mysql2/promise';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Extended Request interface with user property
interface AuthenticatedRequest extends Request {
  user?: any;
}

// Node types for globals like process
// install @types/node to avoid errors in your workspace

const app = express();
app.use(cors());
app.use(express.json());

// configure upload directory
const uploadDir = path.join(process.cwd(), 'data', 'uploads');
fs.mkdirSync(uploadDir, { recursive: true });
const upload = multer({ dest: uploadDir });

// mysql pool (configure with your .env variables)
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const auth = req.headers.authorization?.split(' ')[1];
  if (!auth) return res.status(401).end();
  try {
    req.user = jwt.verify(auth, process.env.JWT_SECRET!);
    next();
  } catch (e) {
    res.status(401).end();
  }
}

// Auth routes
app.post('/api/auth/register', async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  // basic validation
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  // create user + profile in a transaction so the two stay in sync
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [userResult]: any = await connection.execute(
      'INSERT INTO users (username,email,password) VALUES (?,?,?)',
      [username, email, password]
    );
    const userId = userResult.insertId;

    await connection.execute(
      'INSERT INTO profiles (user_id,username,display_name,email) VALUES (?,?,?,?)',
      [userId, username, username, email]
    );

    await connection.commit();

    const token = jwt.sign({ sub: userId, email }, process.env.JWT_SECRET!, { expiresIn: '7d' });
    res.json({ token });
  } catch (err) {
    await connection.rollback();
    console.error('Register error:', err);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    connection.release();
  }
});

app.post('/api/auth/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
  const user: any = (rows as any[])[0];
  // TODO: verify password
  if (!user || user.password !== password) {
    return res.status(401).send('Invalid credentials');
  }
  const token = jwt.sign({ sub: user.id, email }, process.env.JWT_SECRET!, { expiresIn: '7d' });
  res.json({ token });
});

// Profile
app.get('/api/profiles/me', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user.sub;
  const [rows] = await pool.execute('SELECT * FROM profiles WHERE user_id = ?', [userId]);
  res.json((rows as any[])[0]);
});

app.put('/api/profiles/me', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user.sub;
  const { username, display_name } = req.body;
  await pool.execute('UPDATE profiles SET username = ?, display_name = ? WHERE user_id = ?', [username, display_name, userId]);
  res.sendStatus(204);
});

// Uploads list/delete
app.get('/api/uploads', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user.sub;
  const [rows] = await pool.execute('SELECT * FROM uploaded_files WHERE user_id = ? ORDER BY created_at DESC', [userId]);
  res.json(rows);
});

app.delete('/api/uploads/:id', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  const fileId = req.params.id;
  const [rows] = await pool.execute('SELECT storage_path FROM uploaded_files WHERE id = ?', [fileId]);
  const file: any = (rows as any[])[0];
  if (file) {
    fs.unlinkSync(file.storage_path);
  }
  await pool.execute('DELETE FROM uploaded_files WHERE id = ?', [fileId]);
  res.sendStatus(204);
});

app.post('/api/uploads', authenticate, upload.single('file'), async (req: AuthenticatedRequest, res: Response) => {
  const file = req.file!;
  const userId = req.user.sub;
  const id = crypto.randomUUID();
  const publicUrl = `/uploads/${path.basename(file.path)}`;
  await pool.execute(
    'INSERT INTO uploaded_files (id,user_id,file_name,original_name,file_size,mime_type,storage_path,public_url) VALUES (?,?,?,?,?,?,?,?)',
    [id, userId, file.filename, file.originalname, file.size, file.mimetype, file.path, publicUrl]
  );
  res.json({ id, publicUrl });
});

app.delete('/api/uploads/:id', authenticate, async (req: Request, res: Response) => {
  const fileId = req.params.id;
  const [rows] = await pool.execute('SELECT storage_path FROM uploaded_files WHERE id = ?', [fileId]);
  const file: any = (rows as any[])[0];
  if (file) {
    fs.unlinkSync(file.storage_path);
  }
  await pool.execute('DELETE FROM uploaded_files WHERE id = ?', [fileId]);
  res.sendStatus(204);
});

// Badges
// Badges
app.get('/api/badges', async (req: Request, res: Response) => {
  // public list of all possible badges
  const [rows] = await pool.execute('SELECT * FROM badges ORDER BY name');
  res.json(rows);
});

app.get('/api/user-badges', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user.sub;
  const [rows] = await pool.execute('SELECT * FROM user_badges WHERE user_id = ?', [userId]);
  res.json(rows);
});

app.post('/api/user-badges', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user.sub;
  const { badgeId } = req.body;
  if (!badgeId) return res.status(400).json({ error: 'badgeId required' });
  const id = crypto.randomUUID();
  await pool.execute('INSERT INTO user_badges (id,user_id,badge_id) VALUES (?,?,?)', [id, userId, badgeId]);
  res.status(201).end();
});

app.delete('/api/user-badges/:id', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user.sub;
  const badgeId = req.params.id;
  await pool.execute('DELETE FROM user_badges WHERE user_id = ? AND badge_id = ?', [userId, badgeId]);
  res.sendStatus(204);
});

// Analytics
app.get('/api/analytics/views', authenticate, async (req: Request, res: Response) => {
  const userId = req.query.userId as string;
  if (!userId) return res.status(400).json({ error: 'userId required' });
  const [rows] = await pool.execute('SELECT * FROM profile_views WHERE profile_user_id = ? ORDER BY created_at DESC', [userId]);
  res.json(rows);
});

// Social links API
app.get('/api/social-links', async (req: Request, res: Response) => {
  const userId = req.query.userId as string;
  if (!userId) return res.status(400).json({ error: 'userId required' });
  const [rows] = await pool.execute('SELECT * FROM social_links WHERE user_id = ? ORDER BY display_order', [userId]);
  res.json(rows);
});

app.put('/api/social-links/:id', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  const linkId = req.params.id;
  const { url, display_order } = req.body;
  await pool.execute('UPDATE social_links SET url = ?, display_order = ? WHERE id = ?', [url, display_order || 0, linkId]);
  res.sendStatus(204);
});

app.delete('/api/social-links/:id', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  const linkId = req.params.id;
  await pool.execute('DELETE FROM social_links WHERE id = ?', [linkId]);
  res.sendStatus(204);
});

// static serving of uploads
app.use('/uploads', express.static(uploadDir));

// ensure file is a module to avoid top-level script errors
export {};

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
