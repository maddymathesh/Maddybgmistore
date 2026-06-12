ALTER TABLE "supercar_gifts" ALTER COLUMN "image_url" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "supercar_gifts" ADD COLUMN "supercar_name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "supercar_gifts" ADD COLUMN "selling_price" numeric NOT NULL;--> statement-breakpoint
ALTER TABLE "supercar_gifts" ADD COLUMN "offer_price" numeric NOT NULL;--> statement-breakpoint
ALTER TABLE "supercar_gifts" ADD COLUMN "car_type" text DEFAULT 'Sports' NOT NULL;--> statement-breakpoint
ALTER TABLE "supercar_gifts" ADD COLUMN "promo_tag" text DEFAULT 'None' NOT NULL;--> statement-breakpoint
ALTER TABLE "supercar_gifts" DROP COLUMN "name";--> statement-breakpoint
ALTER TABLE "supercar_gifts" DROP COLUMN "price";--> statement-breakpoint
ALTER TABLE "supercar_gifts" DROP COLUMN "type";--> statement-breakpoint
ALTER TABLE "supercar_gifts" DROP COLUMN "tag";