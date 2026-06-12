export type UserRole = "SUPER_ADMIN" | "ADMIN" | "TRANSACTION_MANAGER" | "CONTENT_MANAGER" | "USER";

export interface Profile {
  id: string; // Clerk ID
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  title: string;
  description?: string;
  price: string; // decimal numeric
  category: "Budget" | "Mid Range" | "Premium" | "Ultra Premium";
  status: "available" | "sold";
  youtubeUrl?: string;
  primaryLogin?: string;
  secondaryLogin?: string;
  unlinkGuarantee: string;
  tag: string;
  imageUrls?: string[];
  createdAt: Date;
}

export interface UcPrice {
  id: string;
  name?: string;
  ucAmount: number;
  marketPrice?: string;
  offerPrice: string;
  bonusUc: number;
  method: "view_login" | "character_id";
  tag: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface XsuitGift {
  id: string;
  xsuitName: string;
  sellingPrice: string;
  offerPrice: string;
  promoTag: string;
  imageUrl: string;
  createdAt: Date;
}

export interface SupercarGift {
  id: string;
  supercarName: string;
  sellingPrice: string;
  offerPrice: string;
  carType: string;
  imageUrl: string;
  promoTag: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  name: string;
  comment?: string;
  rating: number;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
}

export interface Proof {
  id: string;
  title?: string;
  imageUrl: string;
  month: string;
  year: string;
  category: string;
  transactionId?: string;
  createdAt: Date;
}

export interface AdminPaymentSettings {
  id: number; // Lock to 1
  payeeName: string;
  payeeUpiId?: string;
  bankName?: string;
  accountType: string;
  accountHolder?: string;
  accountNumber?: string;
  ifscCode?: string;
  branch?: string;
  defaultPin?: string;
  updatedAt: Date;
}

export interface PaymentLink {
  id: string;
  accessToken: string;
  transactionId: string;
  customerName: string;
  amount: string;
  status: "active" | "paid" | "revoked" | "expired";
  expiresAt: Date;
  note?: string;
  pin: string;
  upiId?: string;
  payeeName?: string;
  bankDetails?: Record<string, any>;
  failedAttempts: number;
  revokedAt?: Date;
  revokedReason?: string;
  createdAt: Date;
}

export interface CustomerFeedback {
  id: string;
  name: string;
  stars: number;
  comment: string;
  desiredItems?: string;
  phone?: string;
  status: "unread" | "read" | "archived";
  readBy?: string;
  createdAt: Date;
}

export interface Transaction {
  id: string;
  transactionId: string;
  buyerName: string;
  buyerPhone?: string;
  buyerContact?: string;
  totalAmount: string;
  modeOfDeal: "Telegram" | "WhatsApp" | "Face-to-Face" | "Middleman";
  dealDate: string; // ISO date string YYYY-MM-DD
  createdAt: Date;
}

export interface AccountTransaction {
  id: string;
  transactionRef: string;
  productId?: string;
  ownerPrice: string;
  soldPrice: string;
  profit: string;
  logins?: string;
  credentials?: string;
  ownerPhone?: string;
  sellerPhone?: string;
  resellerPhone?: string;
  accountOwner?: string;
}

export interface XsuitTransaction {
  id: string;
  transactionRef: string;
  xsuitName: string;
  price: string;
}

export interface SupercarTransaction {
  id: string;
  transactionRef: string;
  carName: string;
  price: string;
}

export interface UcTransaction {
  id: string;
  transactionRef: string;
  ucAmount: number;
  price: string;
}
