const { pgTable, uuid, text, numeric, integer, timestamp, jsonb, bigint } = require('drizzle-orm/pg-core');

// 1. PRODUCTS (Catalog accounts)
const products = pgTable('products', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  price: numeric('price').notNull(),
  category: text('category').default('Budget'),
  status: text('status').default('available'),
  youtubeUrl: text('youtube_url'),
  primaryLogin: text('primary_login'),
  secondaryLogin: text('secondary_login'),
  garuntee: text('garuntee'), // legacy spelling preserved for database compatibility
  tag: text('tag').default('None'),
  imageUrls: text('image_urls').array(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
});

// 2. UC PRICES
const ucPrices = pgTable('uc_prices', {
  id: uuid('id').defaultRandom().primaryKey(),
  ucAmount: integer('uc_amount').notNull(),
  marketPrice: numeric('market_price'),
  offerPrice: numeric('offer_price').notNull(),
  bonusUc: integer('bonus_uc').default(0),
  tag: text('tag'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
});

// 3. XSUIT GIFTS (Catalog)
const xsuitGifts = pgTable('xsuit_gifts', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  price: numeric('price').notNull(),
  imageUrl: text('image_url'),
  tag: text('tag').default('None'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
});

// 4. SUPERCAR GIFTS (Catalog)
const supercarGifts = pgTable('supercar_gifts', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  price: numeric('price').notNull(),
  type: text('type'),
  imageUrl: text('image_url'),
  tag: text('tag').default('None'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow()
});

// 5. REVIEWS
const reviews = pgTable('reviews', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  comment: text('comment'),
  rating: integer('rating'), // checked 1-5 in DB constraint
  status: text('status').default('pending'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
});

// 6. PROOFS (Deal Screenshots)
const proofs = pgTable('proofs', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title'),
  imageUrl: text('image_url').notNull(),
  month: text('month'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
});

// 7. ADMIN PAYMENT SETTINGS (Global Defaults)
const adminPaymentSettings = pgTable('admin_payment_settings', {
  id: integer('id').primaryKey(), // Row id is check (id = 1)
  payeeName: text('payee_name'),
  payeeUpiId: text('payee_upi_id'),
  bankName: text('bank_name'),
  accountType: text('account_type').default('SAVINGS ACCOUNT'),
  accountHolder: text('account_holder'),
  accountNumber: text('account_number'),
  ifscCode: text('ifsc_code'),
  branch: text('branch'),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow()
});

// 8. PAYMENT LINKS (Generated Checkout Pages)
const paymentLinks = pgTable('payment_links', {
  id: uuid('id').defaultRandom().primaryKey(),
  transactionId: text('transaction_id'),
  customerName: text('customer_name'),
  amount: numeric('amount').notNull(),
  status: text('status').default('active'),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
  note: text('note'),
  pin: text('pin'),
  payeeName: text('payee_name'),
  payeeUpi: text('payee_upi'),
  bankDetails: jsonb('bank_details'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
});

// 9. SITE VIEWS COUNTER (Global Analytics)
const siteViews = pgTable('site_views', {
  id: text('id').primaryKey(),
  count: bigint('count', { mode: 'number' }).default(0).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow()
});

// 10. CUSTOMER FEEDBACK (Constructive store improvement logs)
const customerFeedback = pgTable('customer_feedback', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  stars: integer('stars'),
  comment: text('comment').notNull(),
  desiredItems: text('desired_items'),
  phone: text('phone'),
  status: text('status').default('unread'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
});

module.exports = {
  products,
  ucPrices,
  xsuitGifts,
  supercarGifts,
  reviews,
  proofs,
  adminPaymentSettings,
  paymentLinks,
  siteViews,
  customerFeedback
};
