ALTER TABLE payment_links ADD COLUMN IF NOT EXISTS access_token text;
UPDATE payment_links SET access_token = gen_random_uuid()::text WHERE access_token IS NULL;
ALTER TABLE payment_links ALTER COLUMN access_token SET NOT NULL;
ALTER TABLE payment_links ADD CONSTRAINT payment_links_access_token_unique UNIQUE (access_token);

ALTER TABLE reviews ADD COLUMN IF NOT EXISTS comment text;

-- Admin Metrics fetches `customer_feedback` now, which is created. 
