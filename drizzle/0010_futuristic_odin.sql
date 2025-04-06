ALTER TABLE "user_subscriptions" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "user_subscriptions" CASCADE;--> statement-breakpoint
ALTER TABLE "subscription" ADD COLUMN "user_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscription" DROP COLUMN "reference_id";