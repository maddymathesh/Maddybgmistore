import { 
  pgTable, uuid, text, numeric, integer, timestamp, 
  pgEnum, jsonb, bigint, date 
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// 1. Core Profile & RBAC Role Enum
export const roleEnum = pgEnum("user_role", [
  "SUPER_ADMIN", 
  "ADMIN", 
  "TRANSACTION_MANAGER", 
  "CONTENT_MANAGER", 
  "USER"
]);

export const profiles = pgTable("profiles", {
  id: text("id").primaryKey(), // Clerk User ID
  email: text("email").notNull().unique(),
  role: roleEnum("role").default("USER").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// 2. Products Table (BGMI Accounts Catalog)
export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  price: numeric("price").notNull(),
  category: text("category").default("Budget").notNull(), // Budget, Mid Range, Premium, Ultra Premium
  status: text("status").default("available").notNull(), // available, sold
  youtubeUrl: text("youtube_url"),
  primaryLogin: text("primary_login"),
  secondaryLogin: text("secondary_login"),
  unlinkGuarantee: text("unlink_guarantee").default("Not Applicable").notNull(),
  tag: text("tag").default("None").notNull(),
  imageUrls: text("image_urls").array(), // Array of Cloudinary image URLs
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// 3. UC Prices Table (Catalog)
export const ucPrices = pgTable("uc_prices", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name"),
  ucAmount: integer("uc_amount").notNull(),
  marketPrice: numeric("market_price"),
  offerPrice: numeric("offer_price").notNull(),
  bonusUc: integer("bonus_uc").default(0).notNull(),
  method: text("method").default("view_login").notNull(), // view_login, character_id
  tag: text("tag").default("None").notNull(),
  status: text("status").default("Available").notNull(), // Available, Coming Soon, Limited Stock, Out of Stock, Hidden
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// 4. X-Suit Gifts Table (Catalog)
export const xsuitGifts = pgTable("xsuit_gifts", {
  id: uuid("id").defaultRandom().primaryKey(),
  xsuitName: text("xsuit_name").notNull(),
  sellingPrice: numeric("selling_price").notNull(),
  offerPrice: numeric("offer_price").notNull(),
  promoTag: text("promo_tag").default("None").notNull(),
  imageUrl: text("image_url").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// 5. Supercar Gifts Table (Catalog)
export const supercarGifts = pgTable("supercar_gifts", {
  id: uuid("id").defaultRandom().primaryKey(),
  supercarName: text("supercar_name").notNull(),
  sellingPrice: numeric("selling_price").notNull(),
  offerPrice: numeric("offer_price").notNull(),
  carType: text("car_type").default("Sports").notNull(), // Sports, SUV
  imageUrl: text("image_url").notNull(),
  promoTag: text("promo_tag").default("None").notNull(),
  applicableVehicle: text("applicable_vehicle").default("UAZ").notNull(), // UAZ, SEDAN, Buggy
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// 6. Reviews Table (Public + Moderated)
export const reviews = pgTable("reviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  comment: text("comment"),
  rating: integer("stars").notNull(),
  status: text("status").default("pending").notNull(), // pending, approved, rejected
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// 7. Proofs Table (Deal Screenshots)
export const proofs = pgTable("proofs", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title"),
  imageUrl: text("image_url").notNull(),
  month: text("month").notNull(),
  year: text("year").notNull(),
  category: text("category").default("Payment").notNull(),
  transactionId: text("transaction_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// 8. Admin Payment Settings
export const adminPaymentSettings = pgTable("admin_payment_settings", {
  id: integer("id").primaryKey().default(1),
  payeeName: text("payee_name").notNull(),
  payeeUpiId: text("payee_upi_id"),
  bankName: text("bank_name"),
  accountType: text("account_type").default("SAVINGS ACCOUNT").notNull(),
  accountHolder: text("account_holder"),
  accountNumber: text("account_number"),
  ifscCode: text("ifsc_code"),
  branch: text("branch"),
  defaultPin: text("default_pin"),
  rolePermissions: jsonb("role_permissions"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// 9. Payment Links Table (Generated Checkouts)
export const paymentLinks = pgTable("payment_links", {
  id: uuid("id").defaultRandom().primaryKey(),
  accessToken: text("access_token").notNull().unique(),
  transactionId: text("transaction_id").notNull(),
  customerName: text("customer_name").notNull(),
  amount: numeric("amount").notNull(),
  status: text("status").default("active").notNull(), // active, paid, revoked, expired
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  note: text("note"),
  pin: text("pin").notNull(),
  upiId: text("upi_id"),
  payeeName: text("payee_name"),
  bankDetails: jsonb("bank_details"),
  failedAttempts: integer("failed_attempts").default(0).notNull(),
  revokedAt: timestamp("revoked_at", { withTimezone: true }),
  revokedReason: text("revoked_reason"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// 10. Site Views Counter Table
export const siteViews = pgTable("site_views", {
  id: text("id").primaryKey(),
  count: bigint("count", { mode: "number" }).default(0).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// 11. Customer Feedback Logs Table
export const customerFeedback = pgTable("customer_feedback", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  stars: integer("stars").notNull(),
  comment: text("comment").notNull(),
  desiredItems: text("desired_items"),
  phone: text("phone"),
  status: text("status").default("unread").notNull(), // unread, read, archived
  readBy: text("read_by"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// 11.5 Activity Logs Table
export const activityLogs = pgTable("activity_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  adminEmail: text("admin_email").notNull(),
  adminRole: text("admin_role"),
  actionType: text("action_type").notNull(), // e.g. "Security", "Catalog", "Inventory"
  description: text("description").notNull(),
  ipAddress: text("ip_address"),
  deviceInfo: text("device_info"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// 12. Main Transactions Log Table
export const transactions = pgTable("transactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  transactionId: text("transaction_id").notNull().unique(), // e.g. MBSA403
  buyerName: text("buyer_name").notNull(),
  buyerPhone: text("buyer_phone"),
  buyerContact: text("buyer_contact"),
  totalAmount: numeric("total_amount").notNull(),
  modeOfDeal: text("mode_of_deal").default("WhatsApp").notNull(), // Telegram, WhatsApp, Face-to-Face, Middleman
  dealDate: date("deal_date").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// 13. Account Transaction Details Table
export const accountTransactions = pgTable("account_transactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  transactionRef: text("transaction_ref").references(() => transactions.transactionId, { onDelete: "cascade" }).notNull(),
  productId: uuid("product_id").references(() => products.id, { onDelete: "set null" }),
  ownerPrice: numeric("owner_price").notNull(),
  soldPrice: numeric("sold_price").notNull(),
  profit: numeric("profit").notNull(),
  logins: text("logins"),
  credentials: text("credentials"),
  ownerPhone: text("owner_phone"),
  sellerPhone: text("seller_phone"),
  resellerPhone: text("reseller_phone"),
  accountOwner: text("account_owner"),
});

// 14. X-Suit Transaction Details Table
export const xsuitTransactions = pgTable("xsuit_transactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  transactionRef: text("transaction_ref").references(() => transactions.transactionId, { onDelete: "cascade" }).notNull(),
  xsuitName: text("xsuit_name").notNull(),
  price: numeric("price").notNull(),
});

// 15. Supercar Transaction Details Table
export const supercarTransactions = pgTable("supercar_transactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  transactionRef: text("transaction_ref").references(() => transactions.transactionId, { onDelete: "cascade" }).notNull(),
  carName: text("car_name").notNull(),
  price: numeric("price").notNull(),
});

// 16. UC Transaction Details Table
export const ucTransactions = pgTable("uc_transactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  transactionRef: text("transaction_ref").references(() => transactions.transactionId, { onDelete: "cascade" }).notNull(),
  ucAmount: integer("uc_amount").notNull(),
  price: numeric("price").notNull(),
});

// Relationships
export const transactionsRelations = relations(transactions, ({ many }) => ({
  accountTransactions: many(accountTransactions),
  xsuitTransactions: many(xsuitTransactions),
  supercarTransactions: many(supercarTransactions),
  ucTransactions: many(ucTransactions),
}));

export const accountTransactionsRelations = relations(accountTransactions, ({ one }) => ({
  transaction: one(transactions, {
    fields: [accountTransactions.transactionRef],
    references: [transactions.transactionId],
  }),
}));

export const xsuitTransactionsRelations = relations(xsuitTransactions, ({ one }) => ({
  transaction: one(transactions, {
    fields: [xsuitTransactions.transactionRef],
    references: [transactions.transactionId],
  }),
}));

export const supercarTransactionsRelations = relations(supercarTransactions, ({ one }) => ({
  transaction: one(transactions, {
    fields: [supercarTransactions.transactionRef],
    references: [transactions.transactionId],
  }),
}));

export const ucTransactionsRelations = relations(ucTransactions, ({ one }) => ({
  transaction: one(transactions, {
    fields: [ucTransactions.transactionRef],
    references: [transactions.transactionId],
  }),
}));
