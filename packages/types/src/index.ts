export type UserRole = "SUPER_ADMIN" | "ADMIN" | "TRANSACTION_MANAGER" | "CONTENT_MANAGER" | "USER";

export interface Profile {
  id: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "EXPIRED" | "REVOKED";
