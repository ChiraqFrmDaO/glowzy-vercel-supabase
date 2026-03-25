import { supabase } from '../server/supabase.js';

// Export de handler voor Vercel serverless functions
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Route handling based on path
  const { pathname } = new URL(req.url, `http://${req.headers.host}`);
  
  try {
    // Import en gebruik de bestaande route handlers
    const app = (await import('../server/index.js')).default;
    return app(req, res);
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
