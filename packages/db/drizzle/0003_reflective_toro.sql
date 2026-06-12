ALTER TABLE "xsuit_gifts" ALTER COLUMN "image_url" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "uc_prices" ADD COLUMN IF NOT EXISTS "name" text;--> statement-breakpoint
ALTER TABLE "xsuit_gifts" ADD COLUMN "xsuit_name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "xsuit_gifts" ADD COLUMN "selling_price" numeric NOT NULL;--> statement-breakpoint
ALTER TABLE "xsuit_gifts" ADD COLUMN "offer_price" numeric NOT NULL;--> statement-breakpoint
ALTER TABLE "xsuit_gifts" ADD COLUMN "promo_tag" text DEFAULT 'None' NOT NULL;--> statement-breakpoint
ALTER TABLE "xsuit_gifts" DROP COLUMN "name";--> statement-breakpoint
ALTER TABLE "xsuit_gifts" DROP COLUMN "price";--> statement-breakpoint
ALTER TABLE "xsuit_gifts" DROP COLUMN "tag";