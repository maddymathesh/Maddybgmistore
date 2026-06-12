ALTER TABLE "proofs" ADD COLUMN "category" text DEFAULT 'Payment' NOT NULL;--> statement-breakpoint
ALTER TABLE "proofs" ADD COLUMN "transaction_id" text;