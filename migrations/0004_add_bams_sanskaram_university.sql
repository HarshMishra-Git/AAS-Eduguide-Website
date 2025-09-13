-- Migration: Add support for BAMS Sanskaram University inquiries
-- This migration adds indexes for better performance when querying BAMS Sanskaram University data

-- Add index for better performance on source queries
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);

-- Add index for better performance on exam queries  
CREATE INDEX IF NOT EXISTS idx_leads_exam ON leads(exam);