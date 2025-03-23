ALTER TABLE "user" ADD COLUMN "customer_id" text;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_customer_id_unique" UNIQUE("customer_id");