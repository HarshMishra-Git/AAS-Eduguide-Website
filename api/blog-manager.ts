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
      
      let blogs: any[] = [];
      try {
        blogs = await sql`SELECT * FROM blogs ORDER BY created_at DESC`;
      } catch (e) {
        console.log('Blogs table not found or empty');
        blogs = [];
      }

      const html = `<!DOCTYPE html>
<html>
<head>
    <title>Blog Manager - AAS Eduguide</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { background: #1a365d; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
        .btn { padding: 10px 20px; margin: 5px; border: none; border-radius: 4px; cursor: pointer; text-decoration: none; display: inline-block; }
        .btn-primary { background: #7cb342; color: white; }
        .btn-secondary { background: #6c757d; color: white; }
        .btn-success { background: #28a745; color: white; }
        .btn-danger { background: #dc3545; color: white; }
        .blog-card { background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .blog-title { font-size: 1.5rem; font-weight: bold; margin-bottom: 10px; }
        .blog-meta { color: #666; font-size: 0.9rem; margin-bottom: 15px; }
        .badge { padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; }
        .badge-success { background: #d4edda; color: #155724; }
        .badge-warning { background: #fff3cd; color: #856404; }
        .no-data { padding: 40px; text-align: center; color: #666; background: white; border-radius: 8px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div>
                <h1>Blog Manager</h1>
                <p>Manage blog posts for AAS Eduguide</p>
            </div>
            <div>
                <a href="/api/admin-dashboard" class="btn btn-secondary">← Back to Dashboard</a>
                <a href="/api/admin-logout" class="btn btn-danger">Logout</a>
            </div>
        </div>
        
        ${blogs.length > 0 ? blogs.map(blog => `
            <div class="blog-card">
                <div class="blog-title">"${sanitizeHtml(blog.title)}" 
                    <span class="badge ${blog.status === 'published' ? 'badge-success' : 'badge-warning'}">${blog.status.toUpperCase()}</span>
                </div>
                <div class="blog-meta">
                    Created: ${blog.created_at ? new Date(blog.created_at).toLocaleDateString() : '-'} | 
                    Updated: ${blog.updated_at ? new Date(blog.updated_at).toLocaleDateString() : '-'} | 
                    Tag: ${blog.tags || 'No tags'}
                </div>
                <div class="blog-excerpt">
                    ${blog.excerpt ? sanitizeHtml(blog.excerpt) : 'No excerpt available'}
                </div>
                <div style="margin-top: 15px;">
                    <a href="/blog/${blog.slug}" class="btn btn-primary" target="_blank">👁️ View</a>
                    <button class="btn btn-success" onclick="alert('Edit functionality requires full admin panel')">✏️ Edit</button>
                    <button class="btn btn-danger" onclick="deleteBlog('${blog.id}', this.parentElement.parentElement)">🗑️ Delete</button>
                </div>
            </div>
        `).join('') : '<div class="no-data">No blog posts found</div>'}
    </div>
    
    <script>
        async function deleteBlog(id, element) {
            if (!confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
                return;
            }
            
            try {
                const response = await fetch('/api/admin-dashboard?table=blogs&id=' + id, {
                    method: 'DELETE'
                });
                
                const result = await response.json();
                
                if (result.success) {
                    element.remove();
                    alert('Blog deleted successfully!');
                } else {
                    alert('Failed to delete blog: ' + result.message);
                }
            } catch (error) {
                alert('Error deleting blog: ' + error.message);
            }
        }
    </script>
</body>
</html>`;

      res.setHeader('Content-Type', 'text/html');
      res.send(html);
    } catch (error) {
      console.error('Blog manager error:', error);
      res.status(500).send(`<h1>Error loading blog manager</h1><p>${error instanceof Error ? error.message : 'Unknown error'}</p>`);
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}