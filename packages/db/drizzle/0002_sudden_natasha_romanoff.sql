ALTER TABLE "uc_prices" ADD COLUMN "status" text DEFAULT 'Available' NOT NULL;--> statement-breakpoint
ALTER TABLE "uc_prices" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;