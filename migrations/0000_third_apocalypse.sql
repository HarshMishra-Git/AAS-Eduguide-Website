-- Migration to update contacts table: combine firstName and lastName into fullName

-- First, add the new full_name column
ALTER TABLE "contacts" ADD COLUMN "full_name" text;

-- Update existing records to combine first_name and last_name
UPDATE "contacts" SET "full_name" = CONCAT("first_name", ' ', "last_name") WHERE "first_name" IS NOT NULL AND "last_name" IS NOT NULL;

-- Make the full_name column NOT NULL
ALTER TABLE "contacts" ALTER COLUMN "full_name" SET NOT NULL;

-- Drop the old columns
ALTER TABLE "contacts" DROP COLUMN "first_name";
ALTER TABLE "contacts" DROP COLUMN "last_name";
