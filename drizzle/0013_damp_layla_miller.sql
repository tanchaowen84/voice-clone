-- First add the column as nullable
ALTER TABLE "subscription" ADD COLUMN "type" text;

-- Update existing records
UPDATE "subscription" SET "type" = 
  CASE 
    WHEN "subscription_id" IS NULL THEN 'one_time'
    ELSE 'subscription'
  END;

-- Now make it not nullable
ALTER TABLE "subscription" ALTER COLUMN "type" SET NOT NULL;