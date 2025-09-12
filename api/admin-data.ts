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
      
      let leads: any[] = [], contacts: any[] = [], newsletters: any[] = [], bamsAdmissions: any[] = [], blogs: any[] = [];
      
      try {
        leads = await sql`SELECT * FROM leads ORDER BY created_at DESC`;
      } catch (e) {
        leads = [];
      }
      
      try {
        contacts = await sql`SELECT * FROM contacts ORDER BY created_at DESC`;
      } catch (e) {
        contacts = [];
      }
      
      try {
        newsletters = await sql`SELECT * FROM newsletters ORDER BY subscribed_at DESC`;
      } catch (e) {
        newsletters = [];
      }
      
      try {
        bamsAdmissions = await sql`SELECT * FROM bams_admissions ORDER BY created_at DESC`;
      } catch (e) {
        bamsAdmissions = [];
      }
      
      try {
        blogs = await sql`SELECT * FROM blogs ORDER BY created_at DESC`;
      } catch (e) {
        blogs = [];
      }

      const html = `<!DOCTYPE html>
<html>
<head>
    <title>All Data View - AAS Eduguide</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { background: #1a365d; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
        .section { background: white; margin-bottom: 30px; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .section-header { background: #7cb342; color: white; padding: 15px 20px; font-weight: bold; display: flex; justify-content: space-between; align-items: center; }
        .table { width: 100%; border-collapse: collapse; }
        .table th, .table td { padding: 12px; text-align: left; border-bottom: 1px solid #eee; }
        .table th { background: #f8f9fa; font-weight: 600; }
        .table tr:hover { background: #f8f9fa; }
        .badge { padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; }
        .badge-success { background: #d4edda; color: #155724; }
        .badge-warning { background: #fff3cd; color: #856404; }
        .no-data { padding: 40px; text-align: center; color: #666; }
        .btn { padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; text-decoration: none; display: inline-block; font-size: 0.9rem; }
        .btn-primary { background: #007bff; color: white; }
        .btn-secondary { background: #6c757d; color: white; }
        .btn-success { background: #28a745; color: white; }
        .btn-danger { background: #dc3545; color: white; }
        .btn-danger:hover { background: #c82333; }
    </style>
    <script>
        async function deleteRecord(table, id, rowElement) {
          if (!confirm('Are you sure you want to delete this record? This action cannot be undone.')) {
            return;
          }
          
          try {
            const response = await fetch('/api/admin-dashboard?table=' + table + '&id=' + id, {
              method: 'DELETE'
            });
            
            const result = await response.json();
            
            if (result.success) {
              rowElement.remove();
              alert('Record deleted successfully!');
            } else {
              alert('Failed to delete record: ' + result.message);
            }
          } catch (error) {
            alert('Error deleting record: ' + error.message);
          }
        }
        
        async function exportData(table) {
          try {
            const response = await fetch('/api/admin-dashboard?action=export&table=' + table, {
              method: 'POST'
            });
            
            if (response.ok) {
              const blob = await response.blob();
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = table + '_export_' + new Date().toISOString().split('T')[0] + '.csv';
              document.body.appendChild(a);
              a.click();
              window.URL.revokeObjectURL(url);
              document.body.removeChild(a);
              alert('Export completed successfully!');
            } else {
              const result = await response.json();
              alert('Export failed: ' + result.message);
            }
          } catch (error) {
            alert('Error exporting data: ' + error.message);
          }
        }
    </script>
</head>
<body>
    <div class="container">
        <div class="header">
            <div>
                <h1>All Data View</h1>
                <p>Complete database records for AAS Eduguide</p>
            </div>
            <div>
                <a href="/api/admin-dashboard" class="btn btn-secondary">← Back to Dashboard</a>
                <a href="/api/admin-logout" class="btn btn-danger">Logout</a>
            </div>
        </div>
        
        <div class="section">
            <div class="section-header">
                <span>📋 Leads (${leads.length})</span>
                <button class="btn btn-primary" onclick="exportData('leads')">📥 Export CSV</button>
            </div>
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
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${leads.map(lead => `
                    <tr id="lead-${lead.id}">
                        <td>${sanitizeHtml(lead.name)}</td>
                        <td>${sanitizeHtml(lead.email)}</td>
                        <td>${sanitizeHtml(lead.phone)}</td>
                        <td><span class="badge badge-success">${sanitizeHtml(lead.exam)}</span></td>
                        <td>${lead.preferred_state ? sanitizeHtml(lead.preferred_state) : '-'}</td>
                        <td>${lead.created_at ? new Date(lead.created_at).toLocaleDateString() : '-'}</td>
                        <td>
                            <button class="btn btn-danger" onclick="deleteRecord('leads', '${lead.id}', document.getElementById('lead-${lead.id}'))">🗑️</button>
                        </td>
                    </tr>
                    `).join('')}
                </tbody>
            </table>
            ` : '<div class="no-data">No leads found</div>'}
        </div>

        <div class="section">
            <div class="section-header">
                <span>📞 Contact Forms (${contacts.length})</span>
                <button class="btn btn-primary" onclick="exportData('contacts')">📥 Export CSV</button>
            </div>
            ${contacts.length > 0 ? `
            <table class="table">
                <thead>
                    <tr>
                        <th>Full Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Exam</th>
                        <th>State</th>
                        <th>Message</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${contacts.map(contact => `
                    <tr id="contact-${contact.id}">
                        <td>${sanitizeHtml(contact.full_name)}</td>
                        <td>${sanitizeHtml(contact.email)}</td>
                        <td>${sanitizeHtml(contact.phone)}</td>
                        <td><span class="badge badge-success">${sanitizeHtml(contact.exam)}</span></td>
                        <td>${contact.preferred_state ? sanitizeHtml(contact.preferred_state) : '-'}</td>
                        <td>${contact.message ? sanitizeHtml(contact.message).substring(0, 50) + '...' : '-'}</td>
                        <td>${contact.created_at ? new Date(contact.created_at).toLocaleDateString() : '-'}</td>
                        <td>
                            <button class="btn btn-danger" onclick="deleteRecord('contacts', '${contact.id}', document.getElementById('contact-${contact.id}'))">🗑️</button>
                        </td>
                    </tr>
                    `).join('')}
                </tbody>
            </table>
            ` : '<div class="no-data">No contact submissions found</div>'}
        </div>

        <div class="section">
            <div class="section-header">
                <span>🏥 BAMS Admissions (${bamsAdmissions.length})</span>
                <button class="btn btn-primary" onclick="exportData('bams_admissions')">📥 Export CSV</button>
            </div>
            ${bamsAdmissions.length > 0 ? `
            <table class="table">
                <thead>
                    <tr>
                        <th>Full Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Category</th>
                        <th>State</th>
                        <th>Counseling</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${bamsAdmissions.map(admission => `
                    <tr id="bams-${admission.id}">
                        <td>${sanitizeHtml(admission.full_name)}</td>
                        <td>${sanitizeHtml(admission.email)}</td>
                        <td>${sanitizeHtml(admission.phone)}</td>
                        <td><span class="badge badge-success">${sanitizeHtml(admission.category)}</span></td>
                        <td>${admission.domicile_state ? sanitizeHtml(admission.domicile_state) : '-'}</td>
                        <td><span class="badge badge-success">${sanitizeHtml(admission.counseling_type)}</span></td>
                        <td>${admission.created_at ? new Date(admission.created_at).toLocaleDateString() : '-'}</td>
                        <td>
                            <button class="btn btn-danger" onclick="deleteRecord('bams_admissions', '${admission.id}', document.getElementById('bams-${admission.id}'))">🗑️</button>
                        </td>
                    </tr>
                    `).join('')}
                </tbody>
            </table>
            ` : '<div class="no-data">No BAMS admissions found</div>'}
        </div>

        <div class="section">
            <div class="section-header">
                <span>📧 Newsletter Subscribers (${newsletters.length})</span>
                <button class="btn btn-primary" onclick="exportData('newsletters')">📥 Export CSV</button>
            </div>
            ${newsletters.length > 0 ? `
            <table class="table">
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Subscribed Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${newsletters.map(newsletter => `
                    <tr id="newsletter-${newsletter.id}">
                        <td>${sanitizeHtml(newsletter.email)}</td>
                        <td>${newsletter.subscribed_at ? new Date(newsletter.subscribed_at).toLocaleDateString() : '-'}</td>
                        <td>
                            <button class="btn btn-danger" onclick="deleteRecord('newsletters', '${newsletter.id}', document.getElementById('newsletter-${newsletter.id}'))">🗑️</button>
                        </td>
                    </tr>
                    `).join('')}
                </tbody>
            </table>
            ` : '<div class="no-data">No newsletter subscribers found</div>'}
        </div>

        <div class="section">
            <div class="section-header">
                <span>📝 Blog Posts (${blogs.length})</span>
                <a href="/api/blog-manager" class="btn btn-success">Manage Blogs</a>
            </div>
            ${blogs.length > 0 ? `
            <table class="table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Slug</th>
                        <th>Status</th>
                        <th>Tags</th>
                        <th>Created</th>
                        <th>Updated</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${blogs.map(blog => `
                    <tr id="blog-${blog.id}">
                        <td>${sanitizeHtml(blog.title)}</td>
                        <td>${sanitizeHtml(blog.slug)}</td>
                        <td><span class="badge ${blog.status === 'published' ? 'badge-success' : 'badge-warning'}">${blog.status.toUpperCase()}</span></td>
                        <td>${blog.tags ? sanitizeHtml(blog.tags) : '-'}</td>
                        <td>${blog.created_at ? new Date(blog.created_at).toLocaleDateString() : '-'}</td>
                        <td>${blog.updated_at ? new Date(blog.updated_at).toLocaleDateString() : '-'}</td>
                        <td>
                            <a href="/blog/${blog.slug}" class="btn btn-primary" target="_blank">👁️</a>
                            <button class="btn btn-danger" onclick="deleteRecord('blogs', '${blog.id}', document.getElementById('blog-${blog.id}'))">🗑️</button>
                        </td>
                    </tr>
                    `).join('')}
                </tbody>
            </table>
            ` : '<div class="no-data">No blog posts found</div>'}
        </div>
    </div>
</body>
</html>`;

      res.setHeader('Content-Type', 'text/html');
      res.send(html);
    } catch (error) {
      console.error('Admin data error:', error);
      res.status(500).send(`<h1>Error loading admin data</h1><p>${error instanceof Error ? error.message : 'Unknown error'}</p>`);
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}