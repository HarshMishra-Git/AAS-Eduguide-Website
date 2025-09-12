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

  // Handle DELETE requests
  if (req.method === 'DELETE') {
    try {
      const sql = neon(process.env.DATABASE_URL!);
      const { table, id } = req.query;
      
      if (!table || !id) {
        return res.status(400).json({ success: false, message: 'Table and ID required' });
      }

      let result;
      switch (table) {
        case 'leads':
          result = await sql`DELETE FROM leads WHERE id = ${id}`;
          break;
        case 'contacts':
          result = await sql`DELETE FROM contacts WHERE id = ${id}`;
          break;
        case 'bams_admissions':
          result = await sql`DELETE FROM bams_admissions WHERE id = ${id}`;
          break;
        case 'newsletters':
          result = await sql`DELETE FROM newsletters WHERE id = ${id}`;
          break;
        default:
          return res.status(400).json({ success: false, message: 'Invalid table' });
      }

      return res.json({ success: true, message: 'Record deleted successfully' });
    } catch (error) {
      console.error('Delete error:', error);
      return res.status(500).json({ success: false, message: 'Failed to delete record' });
    }
  }

  // Handle Excel export
  if (req.method === 'POST' && req.query.action === 'export') {
    try {
      const sql = neon(process.env.DATABASE_URL!);
      const { table } = req.query;
      
      let data: any[] = [];
      let filename = '';
      
      switch (table) {
        case 'leads':
          data = await sql`SELECT * FROM leads ORDER BY created_at DESC`;
          filename = 'leads_export.csv';
          break;
        case 'contacts':
          data = await sql`SELECT * FROM contacts ORDER BY created_at DESC`;
          filename = 'contacts_export.csv';
          break;
        case 'bams_admissions':
          data = await sql`SELECT * FROM bams_admissions ORDER BY created_at DESC`;
          filename = 'bams_admissions_export.csv';
          break;
        case 'newsletters':
          data = await sql`SELECT * FROM newsletters ORDER BY subscribed_at DESC`;
          filename = 'newsletters_export.csv';
          break;
        case 'blogs':
          data = await sql`SELECT * FROM blogs ORDER BY created_at DESC`;
          filename = 'blogs_export.csv';
          break;
        default:
          return res.status(400).json({ success: false, message: 'Invalid table' });
      }

      if (data.length === 0) {
        return res.status(404).json({ success: false, message: 'No data found' });
      }

      // Convert to CSV
      const headers = Object.keys(data[0]).join(',');
      const csvData = data.map(row => 
        Object.values(row).map(value => 
          typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
        ).join(',')
      ).join('\n');
      const csv = headers + '\n' + csvData;

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      return res.send(csv);
    } catch (error) {
      console.error('Export error:', error);
      return res.status(500).json({ success: false, message: 'Failed to export data' });
    }
  }

  if (req.method === 'GET') {
    try {
      const sql = neon(process.env.DATABASE_URL!);
      
      let leads: any[] = [], contacts: any[] = [], newsletters: any[] = [], bamsAdmissions: any[] = [], blogs: any[] = [];
      
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
      
      try {
        bamsAdmissions = await sql`SELECT * FROM bams_admissions ORDER BY created_at DESC LIMIT 50`;
      } catch (e) {
        console.log('BAMS admissions table not found or empty');
        bamsAdmissions = [];
      }
      
      try {
        blogs = await sql`SELECT * FROM blogs ORDER BY created_at DESC LIMIT 50`;
      } catch (e) {
        console.log('Blogs table not found or empty');
        blogs = [];
      }

      // Detect duplicates for highlighting
      const detectDuplicates = (data: any[], emailField: string, phoneField: string) => {
        const emailCounts: Record<string, number> = {};
        const phoneCounts: Record<string, number> = {};
        
        data.forEach(item => {
          const email = item[emailField];
          const phone = item[phoneField];
          if (email) emailCounts[email] = (emailCounts[email] || 0) + 1;
          if (phone) phoneCounts[phone] = (phoneCounts[phone] || 0) + 1;
        });
        
        return data.map(item => ({
          ...item,
          isDuplicate: (emailCounts[item[emailField]] > 1) || (phoneCounts[item[phoneField]] > 1)
        }));
      };

      leads = detectDuplicates(leads, 'email', 'phone');
      contacts = detectDuplicates(contacts, 'email', 'phone');
      bamsAdmissions = detectDuplicates(bamsAdmissions, 'email', 'phone');
      newsletters = detectDuplicates(newsletters, 'email', 'email'); // newsletters only have email

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
        .duplicate-row { background-color: #fff3cd !important; border-left: 4px solid #ffc107; }
        .duplicate-row:hover { background-color: #ffeaa7 !important; }
        .action-buttons { display: flex; gap: 5px; align-items: center; }
        .btn { padding: 4px 8px; border: none; border-radius: 4px; cursor: pointer; font-size: 0.75rem; text-decoration: none; display: inline-block; }
        .btn-danger { background: #dc3545; color: white; }
        .btn-danger:hover { background: #c82333; }
        .btn-success { background: #28a745; color: white; }
        .btn-success:hover { background: #218838; }
        .export-section { margin-bottom: 20px; padding: 15px; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .export-buttons { display: flex; gap: 10px; flex-wrap: wrap; }
        .section-header-with-export { display: flex; justify-content: space-between; align-items: center; }
        @media (max-width: 768px) {
            .container { padding: 10px; }
            .table { font-size: 0.9rem; }
            .table th, .table td { padding: 8px 4px; }
            .export-buttons { flex-direction: column; }
            .action-buttons { flex-direction: column; gap: 2px; }
        }
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
              // Update stats
              location.reload();
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
                <div class="stat-number">${bamsAdmissions.length}</div>
                <div class="stat-label">BAMS Admissions</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${newsletters.length}</div>
                <div class="stat-label">Newsletter Subscribers</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${blogs.length}</div>
                <div class="stat-label">Blog Posts</div>
            </div>
        </div>
        
        <div class="export-section">
            <h3 style="margin-bottom: 15px; color: #1a365d;">📊 Export Data</h3>
            <div class="export-buttons">
                <button class="btn btn-success" onclick="exportData('leads')">📥 Export Leads</button>
                <button class="btn btn-success" onclick="exportData('contacts')">📥 Export Contacts</button>
                <button class="btn btn-success" onclick="exportData('bams_admissions')">📥 Export BAMS</button>
                <button class="btn btn-success" onclick="exportData('newsletters')">📥 Export Newsletters</button>
            </div>
        </div>
        
        <div style="text-align: center; margin: 40px 0;">
            <a href="/admin/blog-manager" class="btn btn-success" style="margin: 5px; padding: 10px 20px; text-decoration: none;">📝 Manage Blog Posts</a>
            <a href="/admin/data" class="btn btn-success" style="margin: 5px; padding: 10px 20px; text-decoration: none;">📊 View All Data</a>
        </div>
        
        <div class="section">
            <div class="section-header-with-export">
                <span>Recent Leads</span>
                <button class="btn btn-success" onclick="exportData('leads')">📥 Export</button>
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
                    <tr id="lead-${lead.id}" ${lead.isDuplicate ? 'class="duplicate-row"' : ''}>
                        <td>${sanitizeHtml(lead.name)} ${lead.isDuplicate ? '⚠️' : ''}</td>
                        <td>${sanitizeHtml(lead.email)}</td>
                        <td>${sanitizeHtml(lead.phone)}</td>
                        <td><span class="badge badge-success">${sanitizeHtml(lead.exam)}</span></td>
                        <td>${lead.preferred_state ? sanitizeHtml(lead.preferred_state) : '-'}</td>
                        <td>${lead.created_at ? new Date(lead.created_at).toLocaleDateString() : '-'}</td>
                        <td>
                            <div class="action-buttons">
                                <button class="btn btn-danger" onclick="deleteRecord('leads', '${lead.id}', document.getElementById('lead-${lead.id}'))">🗑️ Delete</button>
                            </div>
                        </td>
                    </tr>
                    `).join('')}
                </tbody>
            </table>
            ` : '<div class="no-data">No leads found</div>'}
        </div>

        <div class="section">
            <div class="section-header-with-export">
                <span>Contact Form Submissions</span>
                <button class="btn btn-success" onclick="exportData('contacts')">📥 Export</button>
            </div>
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
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${contacts.map(contact => `
                    <tr id="contact-${contact.id}" ${contact.isDuplicate ? 'class="duplicate-row"' : ''}>
                        <td>${sanitizeHtml(contact.full_name)} ${contact.isDuplicate ? '⚠️' : ''}</td>
                        <td>${sanitizeHtml(contact.email)}</td>
                        <td>${sanitizeHtml(contact.phone)}</td>
                        <td><span class="badge badge-success">${sanitizeHtml(contact.exam)}</span></td>
                        <td>${contact.message ? sanitizeHtml(contact.message).substring(0, 50) + '...' : '-'}</td>
                        <td>${contact.created_at ? new Date(contact.created_at).toLocaleDateString() : '-'}</td>
                        <td>
                            <div class="action-buttons">
                                <button class="btn btn-danger" onclick="deleteRecord('contacts', '${contact.id}', document.getElementById('contact-${contact.id}'))">🗑️ Delete</button>
                            </div>
                        </td>
                    </tr>
                    `).join('')}
                </tbody>
            </table>
            ` : '<div class="no-data">No contact submissions found</div>'}
        </div>

        <div class="section">
            <div class="section-header-with-export">
                <span>BAMS Admissions</span>
                <button class="btn btn-success" onclick="exportData('bams_admissions')">📥 Export</button>
            </div>
            ${bamsAdmissions.length > 0 ? `
            <table class="table">
                <thead>
                    <tr>
                         <th>Name</th>
                         <th>Email</th>
                         <th>Phone</th>
                         <th>Category</th>
                         <th>Counseling Type</th>
                         <th>Date</th>
                         <th>Actions</th>
                     </tr>
                </thead>
                <tbody>
                    ${bamsAdmissions.map(admission => `
                     <tr id="bams-${admission.id}" ${admission.isDuplicate ? 'class="duplicate-row"' : ''}>
                         <td>${sanitizeHtml(admission.full_name)} ${admission.isDuplicate ? '⚠️' : ''}</td>
                         <td>${sanitizeHtml(admission.email)}</td>
                         <td>${sanitizeHtml(admission.phone)}</td>
                         <td><span class="badge badge-success">${sanitizeHtml(admission.category)}</span></td>
                         <td><span class="badge badge-success">${sanitizeHtml(admission.counseling_type)}</span></td>
                         <td>${admission.created_at ? new Date(admission.created_at).toLocaleDateString() : '-'}</td>
                         <td>
                             <div class="action-buttons">
                                 <button class="btn btn-danger" onclick="deleteRecord('bams_admissions', '${admission.id}', document.getElementById('bams-${admission.id}'))">🗑️ Delete</button>
                             </div>
                         </td>
                     </tr>
                     `).join('')}
                </tbody>
            </table>
            ` : '<div class="no-data">No BAMS admissions found</div>'}
        </div>

        <div class="section">
            <div class="section-header-with-export">
                <span>Newsletter Subscribers</span>
                <button class="btn btn-success" onclick="exportData('newsletters')">📥 Export</button>
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
                    <tr id="newsletter-${newsletter.id}" ${newsletter.isDuplicate ? 'class="duplicate-row"' : ''}>
                        <td>${sanitizeHtml(newsletter.email)} ${newsletter.isDuplicate ? '⚠️' : ''}</td>
                        <td>${newsletter.subscribed_at ? new Date(newsletter.subscribed_at).toLocaleDateString() : '-'}</td>
                        <td>
                            <div class="action-buttons">
                                <button class="btn btn-danger" onclick="deleteRecord('newsletters', '${newsletter.id}', document.getElementById('newsletter-${newsletter.id}'))">🗑️ Delete</button>
                            </div>
                        </td>
                    </tr>
                    `).join('')}
                </tbody>
            </table>
            ` : '<div class="no-data">No newsletter subscribers found</div>'}
        </div>
        
        <div class="section">
            <div class="section-header-with-export">
                <span>Blog Posts</span>
            </div>
            ${blogs.length > 0 ? `
            <table class="table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th>Updated</th>
                    </tr>
                </thead>
                <tbody>
                    ${blogs.map(blog => `
                    <tr>
                        <td>${sanitizeHtml(blog.title)}</td>
                        <td><span class="badge ${blog.status === 'published' ? 'badge-success' : 'badge-warning'}" style="background: ${blog.status === 'published' ? '#d4edda' : '#fff3cd'}; color: ${blog.status === 'published' ? '#155724' : '#856404'};">${blog.status}</span></td>
                        <td>${blog.created_at ? new Date(blog.created_at).toLocaleDateString() : '-'}</td>
                        <td>${blog.updated_at ? new Date(blog.updated_at).toLocaleDateString() : '-'}</td>
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
      console.error('Dashboard error:', error);
      res.status(500).send(`<h1>Error loading dashboard</h1><p>${error instanceof Error ? error.message : 'Unknown error'}</p>`);
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}