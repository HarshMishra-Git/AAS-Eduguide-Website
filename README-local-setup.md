
# Local Development Setup

## Prerequisites
1. **Node.js** (version 20 or higher)
2. **PostgreSQL** (version 12 or higher)
3. **npm** or **yarn**

## Step-by-Step Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Install dotenv (if not already installed)
```bash
npm install dotenv
npm install --save-dev @types/dotenv
```

### 3. Database Setup

#### Install PostgreSQL locally:
- **Windows**: Download from https://www.postgresql.org/download/windows/
- **macOS**: Use Homebrew: `brew install postgresql`
- **Linux**: Use package manager: `sudo apt-get install postgresql postgresql-contrib`

#### Start PostgreSQL service:
- **Windows**: PostgreSQL should start automatically
- **macOS**: `brew services start postgresql`
- **Linux**: `sudo systemctl start postgresql`

#### Create database:
```bash
# Connect to PostgreSQL as superuser
psql -U postgres

# Run the setup script
\i setup-local-db.sql

# Or manually create database
CREATE DATABASE aaseduguide_db;
\q
```

### 4. Environment Configuration
1. Copy `.env.example` to `.env`
2. Update the database URL in `.env`:
   ```
   DATABASE_URL=postgresql://postgres:your_password@localhost:5432/aaseduguide_db
   ```
3. Add your SendGrid API key if you want email functionality

### 5. Database Migration
```bash
npm run db:push
```

### 6. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `SENDGRID_API_KEY`: For email notifications (optional for development)
- `EMAIL_TO_ADDRESS`: Email address to receive notifications
- `NODE_ENV`: Set to 'development' for local development
- `PORT`: Server port (default: 5000)

## Troubleshooting

### Database Connection Issues
1. Ensure PostgreSQL is running
2. Check your database credentials in `.env`
3. Verify the database exists: `psql -U postgres -l`

### Port Issues
- If port 5000 is in use, change the PORT in `.env`
- Make sure no other applications are using the same port

### Missing Dependencies
```bash
npm install dotenv @types/dotenv
```
