import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

function sanitizeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Check admin cookie
  const cookies = req.headers.cookie || '';
  const isAdmin = cookies.includes('admin=true');
  
  if (!isAdmin) {
    return res.redirect(302, '/api/admin-login');
  }

  if (req.method === 'GET') {
    try {
      const sql = neon(process.env.DATABASE_URL!);
      
      let leads: any[] = [], contacts: any[] = [], newsletters: any[] = [];
      
      try {
        leads = await sql`SELECT * FROM leads ORDER BY created_at DESC LIMIT 50`;
      } catch (e) {
        console.log('Leads table not found or empty');
        leads = [];
      }
      
      try {
        contacts = await sql`SELECT * FROM contacts ORDER BY created_at DESC LIMIT 50`;
      } catch (e) {
        console.log('Contacts table not found or empty');
        contacts = [];
      }
      
      try {
        newsletters = await sql`SELECT * FROM newsletters ORDER BY subscribed_at DESC LIMIT 50`;
      } catch (e) {
        console.log('Newsletters table not found or empty');
        newsletters = [];
      }

      const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Admin Dashboard - AAS Eduguide</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .header { background: #1a365d; color: white; padding: 20px; margin-bottom: 30px; border-radius: 8px; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .stat-card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align: center; }
        .stat-number { font-size: 2rem; font-weight: bold; color: #7cb342; }
        .stat-label { color: #666; margin-top: 5px; }
        .section { background: white; margin-bottom: 30px; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .section-header { background: #7cb342; color: white; padding: 15px 20px; font-weight: bold; }
        .table { width: 100%; border-collapse: collapse; }
        .table th, .table td { padding: 12px; text-align: left; border-bottom: 1px solid #eee; }
        .table th { background: #f8f9fa; font-weight: 600; }
        .table tr:hover { background: #f8f9fa; }
        .badge { padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; }
        .badge-success { background: #d4edda; color: #155724; }
        .no-data { padding: 40px; text-align: center; color: #666; }
        @media (max-width: 768px) {
            .container { padding: 10px; }
            .table { font-size: 0.9rem; }
            .table th, .table td { padding: 8px 4px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h1>Admin Dashboard</h1>
                    <p>AAS Eduguide - All Admission Services</p>
                </div>
                <a href="/api/admin-logout" style="color: white; text-decoration: none; padding: 8px 16px; background: rgba(255,255,255,0.2); border-radius: 4px;">Logout</a>
            </div>
        </div>
        
        <div class="stats">
            <div class="stat-card">
                <div class="stat-number">${leads.length}</div>
                <div class="stat-label">Total Leads</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${contacts.length}</div>
                <div class="stat-label">Contact Forms</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${newsletters.length}</div>
                <div class="stat-label">Newsletter Subscribers</div>
            </div>
        </div>

        <div class="section">
            <div class="section-header">Recent Leads</div>
            ${leads.length > 0 ? `
            <table class="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Exam</th>
                        <th>State</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    ${leads.map(lead => `
                    <tr>
                        <td>${sanitizeHtml(lead.name)}</td>
                        <td>${sanitizeHtml(lead.email)}</td>
                        <td>${sanitizeHtml(lead.phone)}</td>
                        <td><span class="badge badge-success">${sanitizeHtml(lead.exam)}</span></td>
                        <td>${lead.preferred_state ? sanitizeHtml(lead.preferred_state) : '-'}</td>
                        <td>${lead.created_at ? new Date(lead.created_at).toLocaleDateString() : '-'}</td>
                    </tr>
                    `).join('')}
                </tbody>
            </table>
            ` : '<div class="no-data">No leads found</div>'}
        </div>

        <div class="section">
            <div class="section-header">Contact Form Submissions</div>
            ${contacts.length > 0 ? `
            <table class="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Exam</th>
                        <th>Message</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    ${contacts.map(contact => `
                    <tr>
                        <td>${sanitizeHtml(contact.first_name)} ${sanitizeHtml(contact.last_name)}</td>
                        <td>${sanitizeHtml(contact.email)}</td>
                        <td>${sanitizeHtml(contact.phone)}</td>
                        <td><span class="badge badge-success">${sanitizeHtml(contact.exam)}</span></td>
                        <td>${contact.message ? sanitizeHtml(contact.message).substring(0, 50) + '...' : '-'}</td>
                        <td>${contact.created_at ? new Date(contact.created_at).toLocaleDateString() : '-'}</td>
                    </tr>
                    `).join('')}
                </tbody>
            </table>
            ` : '<div class="no-data">No contact submissions found</div>'}
        </div>

        <div class="section">
            <div class="section-header">Newsletter Subscribers</div>
            ${newsletters.length > 0 ? `
            <table class="table">
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Subscribed Date</th>
                    </tr>
                </thead>
                <tbody>
                    ${newsletters.map(newsletter => `
                    <tr>
                        <td>${sanitizeHtml(newsletter.email)}</td>
                        <td>${newsletter.subscribed_at ? new Date(newsletter.subscribed_at).toLocaleDateString() : '-'}</td>
                    </tr>
                    `).join('')}
                </tbody>
            </table>
            ` : '<div class="no-data">No newsletter subscribers found</div>'}
        </div>
    </div>
</body>
</html>`;

      res.setHeader('Content-Type', 'text/html');
      res.send(html);
    } catch (error) {
      console.error('Dashboard error:', error);
      res.status(500).send(`<h1>Error loading dashboard</h1><p>${error instanceof Error ? error.message : 'Unknown error'}</p>`);
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}