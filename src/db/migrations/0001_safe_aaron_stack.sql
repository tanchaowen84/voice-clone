CREATE TABLE "credits_history" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"amount" integer NOT NULL,
	"type" text NOT NULL,
	"description" text,
	"creem_order_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"metadata" jsonb DEFAULT '{}'
);
--> statement-breakpoint
ALTER TABLE "payment" ADD COLUMN "canceled_at" timestamp;--> statement-breakpoint
ALTER TABLE "payment" ADD COLUMN "metadata" jsonb DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "creem_customer_id" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "country" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "credits" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "metadata" jsonb DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "credits_history" ADD CONSTRAINT "credits_history_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_creem_customer_id_unique" UNIQUE("creem_customer_id");