CREATE TABLE "monthly_usage" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"month_year" text NOT NULL,
	"characters_used" integer DEFAULT 0 NOT NULL,
	"requests_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_user_monthly_usage" UNIQUE("user_id","month_year")
);
--> statement-breakpoint
CREATE TABLE "user_usage" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"usage_date" date NOT NULL,
	"characters_used" integer DEFAULT 0 NOT NULL,
	"requests_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_user_daily_usage" UNIQUE("user_id","usage_date")
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "plan_id" text DEFAULT 'free';--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "plan_expires_at" timestamp;--> statement-breakpoint
ALTER TABLE "monthly_usage" ADD CONSTRAINT "monthly_usage_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_usage" ADD CONSTRAINT "user_usage_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "monthly_usage_user_month_idx" ON "monthly_usage" USING btree ("user_id","month_year");--> statement-breakpoint
CREATE INDEX "monthly_usage_month_idx" ON "monthly_usage" USING btree ("month_year");--> statement-breakpoint
CREATE INDEX "user_usage_user_date_idx" ON "user_usage" USING btree ("user_id","usage_date");--> statement-breakpoint
CREATE INDEX "user_usage_date_idx" ON "user_usage" USING btree ("usage_date");--> statement-breakpoint
CREATE INDEX "user_plan_id_idx" ON "user" USING btree ("plan_id");