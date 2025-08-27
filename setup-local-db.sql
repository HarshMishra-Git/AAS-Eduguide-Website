
-- Local PostgreSQL Database Setup Script
-- Run this script to create the database and user for local development

-- Create database
CREATE DATABASE aaseduguide_db;

-- Create user (optional - you can use default postgres user)
-- CREATE USER aaseduguide WITH PASSWORD 'password';
-- GRANT ALL PRIVILEGES ON DATABASE aaseduguide_db TO aaseduguide;

-- Connect to the database
\c aaseduguide_db;

-- Create necessary extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- The tables will be created automatically by Drizzle migrations
-- when you run: npm run db:push
