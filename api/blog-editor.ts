import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Check admin cookie
  const cookies = req.headers.cookie || '';
  const isAdmin = cookies.includes('admin=true');
  
  if (!isAdmin) {
    return res.redirect(302, '/api/admin-login');
  }

  if (req.method === 'GET') {
    const { id } = req.query;
    let blog = null;
    
    if (id) {
      try {
        const sql = neon(process.env.DATABASE_URL!);
        const result = await sql`SELECT * FROM blogs WHERE id = ${id}`;
        blog = result[0] || null;
      } catch (e) {
        console.log('Error fetching blog:', e);
      }
    }

    const html = `<!DOCTYPE html>
<html>
<head>
    <title>${id ? 'Edit' : 'Create'} Blog Post - AAS Eduguide</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; }
        .header { background: #1a365d; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
        .form-card { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; margin-bottom: 5px; font-weight: bold; color: #333; }
        .form-group input, .form-group textarea, .form-group select { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; }
        .form-group textarea { height: 200px; resize: vertical; }
        .btn { padding: 10px 20px; margin: 5px; border: none; border-radius: 4px; cursor: pointer; text-decoration: none; display: inline-block; }
        .btn-primary { background: #7cb342; color: white; }
        .btn-secondary { background: #6c757d; color: white; }
        .btn-success { background: #28a745; color: white; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div>
                <h1>${id ? 'Edit' : 'Create'} Blog Post</h1>
                <p>AAS Eduguide Blog Management</p>
            </div>
            <div>
                <a href="/api/blog-manager" class="btn btn-secondary">← Back to Blog Manager</a>
            </div>
        </div>
        
        <div class="form-card">
            <form id="blogForm">
                <div class="form-group">
                    <label for="title">Title *</label>
                    <input type="text" id="title" name="title" required value="${blog ? blog.title : ''}" placeholder="Enter blog title">
                </div>
                
                <div class="form-group">
                    <label for="slug">Slug *</label>
                    <input type="text" id="slug" name="slug" required value="${blog ? blog.slug : ''}" placeholder="blog-url-slug">
                </div>
                
                <div class="form-group">
                    <label for="excerpt">Excerpt *</label>
                    <textarea id="excerpt" name="excerpt" required placeholder="Brief description of the blog post">${blog ? blog.excerpt : ''}</textarea>
                </div>
                
                <div class="form-group">
                    <label for="content">Content *</label>
                    <textarea id="content" name="content" required placeholder="Full blog content">${blog ? blog.content : ''}</textarea>
                </div>
                
                <div class="form-group">
                    <label for="featuredImage">Featured Image URL</label>
                    <input type="url" id="featuredImage" name="featuredImage" value="${blog ? (blog.featured_image || '') : ''}" placeholder="https://example.com/image.jpg">
                </div>
                
                <div class="form-group">
                    <label for="tags">Tags</label>
                    <input type="text" id="tags" name="tags" value="${blog ? (blog.tags || '') : ''}" placeholder="tag1, tag2, tag3">
                </div>
                
                <div class="form-group">
                    <label for="status">Status *</label>
                    <select id="status" name="status" required>
                        <option value="draft" ${blog && blog.status === 'draft' ? 'selected' : ''}>Draft</option>
                        <option value="published" ${blog && blog.status === 'published' ? 'selected' : ''}>Published</option>
                    </select>
                </div>
                
                <div style="text-align: center; margin-top: 30px;">
                    <button type="submit" class="btn btn-success">${id ? 'Update' : 'Create'} Blog Post</button>
                    <a href="/api/blog-manager" class="btn btn-secondary">Cancel</a>
                </div>
            </form>
        </div>
    </div>
    
    <script>
        document.getElementById('title').addEventListener('input', function() {
            const title = this.value;
            const slug = title.toLowerCase()
                .replace(/[^a-z0-9 -]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .trim('-');
            document.getElementById('slug').value = slug;
        });
        
        document.getElementById('blogForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            try {
                const url = '${id ? `/api/blog-editor?id=${id}` : '/api/blog-editor'}';
                const method = '${id ? 'PUT' : 'POST'}';
                
                const response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    alert('Blog ${id ? 'updated' : 'created'} successfully!');
                    window.location.href = '/api/blog-manager';
                } else {
                    alert('Error: ' + result.message);
                }
            } catch (error) {
                alert('Error: ' + error.message);
            }
        });
    </script>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } 
  else if (req.method === 'POST') {
    // Create new blog
    try {
      const sql = neon(process.env.DATABASE_URL!);
      const { title, slug, excerpt, content, featuredImage, tags, status } = req.body;
      
      const result = await sql`
        INSERT INTO blogs (title, slug, excerpt, content, featured_image, tags, status, created_at, updated_at)
        VALUES (${title}, ${slug}, ${excerpt}, ${content}, ${featuredImage || null}, ${tags || null}, ${status}, NOW(), NOW())
        RETURNING *
      `;
      
      res.json({ success: true, blog: result[0] });
    } catch (error) {
      console.error('Create blog error:', error);
      res.status(500).json({ success: false, message: 'Failed to create blog' });
    }
  }
  else if (req.method === 'PUT') {
    // Update existing blog
    try {
      const sql = neon(process.env.DATABASE_URL!);
      const { id } = req.query;
      const { title, slug, excerpt, content, featuredImage, tags, status } = req.body;
      
      const result = await sql`
        UPDATE blogs 
        SET title = ${title}, slug = ${slug}, excerpt = ${excerpt}, content = ${content}, 
            featured_image = ${featuredImage || null}, tags = ${tags || null}, status = ${status}, updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
      `;
      
      res.json({ success: true, blog: result[0] });
    } catch (error) {
      console.error('Update blog error:', error);
      res.status(500).json({ success: false, message: 'Failed to update blog' });
    }
  }
  else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}