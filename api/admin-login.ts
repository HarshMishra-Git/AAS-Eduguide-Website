import type { VercelRequest, VercelResponse } from '@vercel/node';
import bcrypt from 'bcrypt';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || "$2b$12$FrhHWFzmcYacalhnT2gUyeCyLuAS8xJzs55ajyudyVrRVak6XLBhu";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Admin Login - AAS Eduguide</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #1a365d 0%, #7cb342 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; }
        .login-container { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); width: 100%; max-width: 400px; }
        .logo { text-align: center; margin-bottom: 30px; }
        .logo h1 { color: #1a365d; margin-bottom: 5px; }
        .logo p { color: #7cb342; font-weight: 500; }
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; margin-bottom: 5px; color: #333; font-weight: 500; }
        .form-group input { width: 100%; padding: 12px; border: 2px solid #e2e8f0; border-radius: 6px; font-size: 16px; }
        .form-group input:focus { outline: none; border-color: #7cb342; }
        .btn { width: 100%; padding: 12px; background: #7cb342; color: white; border: none; border-radius: 6px; font-size: 16px; font-weight: 500; cursor: pointer; }
        .btn:hover { background: #6ba037; }
        .error { color: #e53e3e; text-align: center; margin-top: 15px; }
    </style>
</head>
<body>
    <div class="login-container">
        <div class="logo">
            <h1>AAS Eduguide</h1>
            <p>Admin Panel</p>
        </div>
        <form method="POST" action="/api/admin-login">
            <div class="form-group">
                <label for="username">Username</label>
                <input type="text" id="username" name="username" required>
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required>
            </div>
            <button type="submit" class="btn">Login</button>
            ${req.query.error ? '<div class="error">Invalid username or password</div>' : ''}
        </form>
    </div>
</body>
</html>`;
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } else if (req.method === 'POST') {
    const { username, password } = req.body;
    
    if (username === ADMIN_USERNAME && await bcrypt.compare(password, ADMIN_PASSWORD_HASH)) {
      res.setHeader('Set-Cookie', 'admin=true; HttpOnly; Path=/; Max-Age=86400');
      res.redirect(302, '/api/admin-dashboard');
    } else {
      res.redirect(302, '/api/admin-login?error=1');
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}