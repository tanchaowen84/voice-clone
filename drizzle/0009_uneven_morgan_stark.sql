CREATE TABLE "subscription" (
	"id" text PRIMARY KEY NOT NULL,
	"plan_id" text NOT NULL,
	"price_id" text NOT NULL,
	"reference_id" text NOT NULL,
	"customer_id" text,
	"subscription_id" text,
	"status" text NOT NULL,
	"period_start" timestamp,
	"period_end" timestamp,
	"cancel_at_period_end" boolean,
	"trial_start" timestamp,
	"trial_end" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_subscriptions" (
	"user_id" text NOT NULL,
	"subscription_id" text NOT NULL,
	CONSTRAINT "user_subscriptions_user_id_subscription_id_pk" PRIMARY KEY("user_id","subscription_id")
);
--> statement-breakpoint
ALTER TABLE "user_subscriptions" ADD CONSTRAINT "user_subscriptions_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_subscriptions" ADD CONSTRAINT "user_subscriptions_subscription_id_subscription_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "public"."subscription"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "subscription_id";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "subscription_status";