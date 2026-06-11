"use server";

import { 
  db, siteViews, products,
  reviews, customerFeedback, paymentLinks, adminPaymentSettings, 
  transactions, accountTransactions, xsuitTransactions, supercarTransactions, ucTransactions,
  activityLogs,
  eq, desc
} from "@repo/db";
import { auth } from "@clerk/nextjs/server";

// Auth Gatekeeper Helper
async function verifyAdminAccess() {
  const session = await auth();
  const userId = session.userId;
  type Claims = { publicMetadata?: { role?: string }; metadata?: { role?: string } };
  const claims = session.sessionClaims as Claims | undefined;
  const userRole = claims?.publicMetadata?.role || claims?.metadata?.role || "USER";
  
  const validAdminRoles = ["SUPER_ADMIN", "ADMIN", "TRANSACTION_MANAGER", "CONTENT_MANAGER"];
  
  if (!userId) {
    throw new Error("Access Denied: Administrative privileges required. (No user ID)");
  }

  let isPermanentAdmin = false;
  let userEmail = "";
  try {
    const { clerkClient } = await import("@clerk/nextjs/server");
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    userEmail = user.primaryEmailAddressId 
      ? user.emailAddresses.find(e => e.id === user.primaryEmailAddressId)?.emailAddress || ""
      : user.emailAddresses[0]?.emailAddress || "";
      
    console.log(`[Admin Access Check] User: ${userId}, Email: ${userEmail}, Role: ${userRole}`);
      
    if (userEmail === "r.mateshwaran.io@gmail.com" || userEmail === "maddybgmistoreog@gmail.com") {
      isPermanentAdmin = true;
    }
  } catch (error) {
    console.error("Could not fetch user email in verifyAdminAccess:", error);
  }

  if (!isPermanentAdmin && !validAdminRoles.includes(userRole)) {
    console.warn(`[Admin Access Denied] ${userEmail} is not an admin.`);
    throw new Error("Access Denied: Administrative privileges required.");
  }
  
  return { userId, userRole: isPermanentAdmin ? "SUPER_ADMIN" : userRole };
}

// 1. Dashboard Metrics
export async function getAdminMetrics() {
  await verifyAdminAccess();
  try {
    // 1.1 Total Views
    const viewsRow = await db.query.siteViews.findFirst({
      where: eq(siteViews.id, "total_views")
    });
    const totalViews = viewsRow?.count || 14852;

    // 1.2 Catalog Counts
    const allProducts = await db.select().from(products);
    const totalProducts = allProducts.length;
    const availableProducts = allProducts.filter(p => p.status === "available").length;
    const soldProducts = totalProducts - availableProducts;

    // 1.3 Review Counts
    const allReviews = await db.select().from(reviews);
    const pendingReviews = allReviews.filter(r => r.status === "pending").length;
    const approvedReviews = allReviews.filter(r => r.status === "approved").length;

    // 1.4 Feedback Counts
    const allFeedback = await db.select().from(customerFeedback);
    const unreadFeedback = allFeedback.filter(f => f.status === "unread").length;

    // 1.5 Transaction Analytics
    const allTransactions = await db.select().from(transactions);
    const transactionCount = allTransactions.length;
    
    let totalRevenue = 0;
    allTransactions.forEach(t => {
      totalRevenue += Number(t.totalAmount) || 0;
    });

    const accountTxList = await db.select().from(accountTransactions);
    let totalProfit = 0;
    accountTxList.forEach(at => {
      totalProfit += Number(at.profit) || 0;
    });

    return {
      success: true,
      metrics: {
        totalViews,
        products: { total: totalProducts, available: availableProducts, sold: soldProducts },
        reviews: { total: allReviews.length, pending: pendingReviews, approved: approvedReviews },
        feedback: { unread: unreadFeedback },
        analytics: { count: transactionCount, revenue: totalRevenue, profit: totalProfit }
      }
    };
  } catch (error) {
    console.error("Failed to fetch admin metrics:", error);
    return { success: false, error: "Failed to fetch admin metrics" };
  }
}

// 2. Ready Stocks (Products CRUD)
export async function getAdminProducts() {
  await verifyAdminAccess();
  try {
    const data = await db.select().from(products).orderBy(desc(products.createdAt));
    return { success: true, products: data };
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return { success: false, products: [] };
  }
}

export async function createProduct(data: {
  title: string;
  description: string;
  price: string;
  category: string;
  status: string;
  youtubeUrl: string;
  primaryLogin: string;
  secondaryLogin: string;
  unlinkGuarantee: string;
  tag: string;
  imageUrls: string[];
}) {
  await verifyAdminAccess();
  try {
    const [newProduct] = await db
      .insert(products)
      .values({
        title: data.title,
        description: data.description,
        price: data.price,
        category: data.category,
        status: data.status,
        youtubeUrl: data.youtubeUrl || null,
        primaryLogin: data.primaryLogin || "Facebook",
        secondaryLogin: data.secondaryLogin || "Play Games",
        unlinkGuarantee: data.unlinkGuarantee || "Not Applicable",
        tag: data.tag || "None",
        imageUrls: data.imageUrls || []
      })
      .returning();

    await logAdminAction("Catalog", `Created new product: ${data.title}`);
    return { success: true, product: newProduct };
  } catch (error) {
    console.error("Failed to create product:", error);
    return { success: false, error: "Failed to create product" };
  }
}

export async function updateProduct(id: string, data: Partial<{
  title: string;
  description: string;
  price: string;
  category: string;
  status: string;
  youtubeUrl: string;
  primaryLogin: string;
  secondaryLogin: string;
  unlinkGuarantee: string;
  tag: string;
  imageUrls: string[];
}>) {
  await verifyAdminAccess();
  try {
    const [updatedProduct] = await db
      .update(products)
      .set(data)
      .where(eq(products.id, id))
      .returning();
      
    await logAdminAction("Catalog", `Updated product: ${id}`);
    return { success: true, product: updatedProduct };
  } catch (error) {
    console.error("Failed to update product:", error);
    return { success: false, error: "Failed to update product" };
  }
}

export async function deleteProduct(id: string) {
  await verifyAdminAccess();
  try {
    await db.delete(products).where(eq(products.id, id));
    await logAdminAction("Catalog", `Deleted product: ${id}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to delete product:", error);
    return { success: false, error: "Failed to delete product" };
  }
}

// 3. Reviews Moderation
export async function getAdminReviews() {
  await verifyAdminAccess();
  try {
    const data = await db.select().from(reviews).orderBy(desc(reviews.createdAt));
    return { success: true, reviews: data };
  } catch (error) {
    console.error("Failed to fetch admin reviews:", error);
    return { success: false, reviews: [] };
  }
}

export async function updateReviewStatus(id: string, status: string) {
  await verifyAdminAccess();
  try {
    const [updatedReview] = await db
      .update(reviews)
      .set({ status })
      .where(eq(reviews.id, id))
      .returning();
    
    await logAdminAction("Reviews", `Updated review status to ${status} for review ID: ${id}`);
    return { success: true, review: updatedReview };
  } catch (error) {
    console.error("Failed to update review status:", error);
    return { success: false, error: "Failed to update review status" };
  }
}

export async function deleteReview(id: string) {
  await verifyAdminAccess();
  try {
    await db.delete(reviews).where(eq(reviews.id, id));
    await logAdminAction("Reviews", `Deleted review: ${id}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to delete review:", error);
    return { success: false, error: "Failed to delete review" };
  }
}

// 4. Customer Feedback logs
export async function getFeedbackLogs() {
  await verifyAdminAccess();
  try {
    const data = await db.select().from(customerFeedback).orderBy(desc(customerFeedback.createdAt));
    return { success: true, feedback: data };
  } catch (error) {
    console.error("Failed to fetch feedback logs:", error);
    return { success: false, feedback: [] };
  }
}

export async function updateFeedbackStatus(id: string, status: string) {
  await verifyAdminAccess();
  try {
    const [updated] = await db
      .update(customerFeedback)
      .set({ status })
      .where(eq(customerFeedback.id, id))
      .returning();
      
    await logAdminAction("Feedback", `Updated customer feedback status to ${status} for ID: ${id}`);
    return { success: true, feedback: updated };
  } catch (error) {
    console.error("Failed to update feedback:", error);
    return { success: false, error: "Failed to update feedback" };
  }
}

// 5. Payment Links CRUD
export async function getPaymentLinks() {
  await verifyAdminAccess();
  try {
    const data = await db.select().from(paymentLinks).orderBy(desc(paymentLinks.createdAt));
    return { success: true, paymentLinks: data };
  } catch (error) {
    console.error("Failed to fetch payment links:", error);
    return { success: false, paymentLinks: [] };
  }
}

export async function createPaymentLink(data: {
  customerName: string;
  amount: string;
  note?: string;
  pin: string; // User/Admin specified PIN
  expiresHours: number;
}) {
  await verifyAdminAccess();
  try {
    // Generate secure keys & access tokens
    const secureToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const txnId = `MBSPAY-${Math.floor(100000 + Math.random() * 900000)}`;
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + data.expiresHours);

    // Get payee details from active admin settings
    const adminSettingsData = await db.query.adminPaymentSettings.findFirst({
      where: eq(adminPaymentSettings.id, 1),
    });

    const [newLink] = await db
      .insert(paymentLinks)
      .values({
        accessToken: secureToken,
        transactionId: txnId,
        customerName: data.customerName,
        amount: data.amount,
        status: "active",
        expiresAt: expiresAt,
        note: data.note || "Order Payment Lockin",
        pin: data.pin || Math.floor(100000 + Math.random() * 900000).toString(),
        upiId: adminSettingsData?.payeeUpiId || "",
        payeeName: adminSettingsData?.payeeName || "Maddy BGMI Store",
        bankDetails: adminSettingsData ? {
          bankName: adminSettingsData.bankName,
          accountHolder: adminSettingsData.accountHolder,
          accountNumber: adminSettingsData.accountNumber,
          ifscCode: adminSettingsData.ifscCode,
          branch: adminSettingsData.branch,
          accountType: adminSettingsData.accountType
        } : null,
        failedAttempts: 0
      })
      .returning();

    await logAdminAction("Payments", `Created payment link for ${data.customerName} (${data.amount} INR)`);
    return { success: true, paymentLink: newLink };
  } catch (error) {
    console.error("Failed to create payment link:", error);
    return { success: false, error: "Failed to create payment link" };
  }
}

export async function revokePaymentLink(id: string) {
  await verifyAdminAccess();
  try {
    const [updated] = await db
      .update(paymentLinks)
      .set({ 
        status: "revoked", 
        revokedAt: new Date(), 
        revokedReason: "MANUALLY_REVOKED" 
      })
      .where(eq(paymentLinks.id, id))
      .returning();
      
    await logAdminAction("Payments", `Revoked payment link ID: ${id}`);
    return { success: true, paymentLink: updated };
  } catch (error) {
    console.error("Failed to revoke payment link:", error);
    return { success: false, error: "Failed to revoke payment link" };
  }
}

// 6. Transactions Registry & Manual Transaction Logging
export async function getTransactionsRegistry() {
  await verifyAdminAccess();
  try {
    const data = await db.query.transactions.findMany({
      orderBy: desc(transactions.createdAt),
      with: {
        accountTransactions: true,
        xsuitTransactions: true,
        supercarTransactions: true,
        ucTransactions: true
      }
    });
    return { success: true, transactions: data };
  } catch (error) {
    console.error("Failed to fetch transactions:", error);
    return { success: false, transactions: [] };
  }
}

export async function createManualTransaction(data: {
  transactionId: string; // e.g. MBSA403
  buyerName: string;
  buyerPhone?: string;
  buyerContact?: string;
  totalAmount: string;
  modeOfDeal: string; // WhatsApp, Telegram, F2F, Middleman
  dealDate: string; // YYYY-MM-DD
  details: {
    type: "account" | "uc" | "xsuit" | "supercar";
    productId?: string; // For account
    ownerPrice?: string; // For account profit calculations
    soldPrice?: string; // For itemized totals
    ownerPhone?: string;
    sellerPhone?: string;
    resellerPhone?: string;
    accountOwner?: string;
    logins?: string;
    credentials?: string;
    ucAmount?: number; // For UC sales
    xsuitName?: string; // For X-suit sales
    carName?: string; // For Supercar sales
  }
}) {
  await verifyAdminAccess();
  try {
    // 1. Insert core Transaction
    const [txn] = await db
      .insert(transactions)
      .values({
        transactionId: data.transactionId.trim() || `MBS-${Date.now().toString().slice(-6)}`,
        buyerName: data.buyerName,
        buyerPhone: data.buyerPhone || null,
        buyerContact: data.buyerContact || null,
        totalAmount: data.totalAmount,
        modeOfDeal: data.modeOfDeal,
        dealDate: data.dealDate
      })
      .returning();

    if (!txn) {
      throw new Error("Failed to insert core transaction record");
    }

    // 2. Insert itemized sub-details
    const details = data.details;
    if (details.type === "account") {
      const op = Number(details.ownerPrice) || 0;
      const sp = Number(details.soldPrice) || 0;
      const profitVal = sp - op;

      await db.insert(accountTransactions).values({
        transactionRef: txn.transactionId,
        productId: details.productId || null,
        ownerPrice: String(op),
        soldPrice: String(sp),
        profit: String(profitVal),
        logins: details.logins || null,
        credentials: details.credentials || null,
        ownerPhone: details.ownerPhone || null,
        sellerPhone: details.sellerPhone || null,
        resellerPhone: details.resellerPhone || null,
        accountOwner: details.accountOwner || null
      });

      // Update product status to sold
      if (details.productId) {
        await db
          .update(products)
          .set({ status: "sold" })
          .where(eq(products.id, details.productId));
      }

    } else if (details.type === "uc") {
      await db.insert(ucTransactions).values({
        transactionRef: txn.transactionId,
        ucAmount: details.ucAmount || 0,
        price: details.soldPrice || "0"
      });
    } else if (details.type === "xsuit") {
      await db.insert(xsuitTransactions).values({
        transactionRef: txn.transactionId,
        xsuitName: details.xsuitName || "Unknown X-Suit",
        price: details.soldPrice || "0"
      });
    } else if (details.type === "supercar") {
      await db.insert(supercarTransactions).values({
        transactionRef: txn.transactionId,
        carName: details.carName || "Unknown Supercar",
        price: details.soldPrice || "0"
      });
    }

    return { success: true, transaction: txn };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to log transaction";
    console.error("Failed to log transaction:", error);
    return { success: false, error: msg };
  }
}

// 7. Global Payment Settings CRUD
export async function getAdminPaymentSettings() {
  await verifyAdminAccess();
  try {
    let settings = await db.query.adminPaymentSettings.findFirst({
      where: eq(adminPaymentSettings.id, 1)
    });

    if (!settings) {
      // Create default settings if not exists
      const [newSettings] = await db
        .insert(adminPaymentSettings)
        .values({
          id: 1,
          payeeName: "Maddy Store",
          payeeUpiId: "maddy@ybl",
          bankName: "FEDERAL BANK",
          accountType: "SAVINGS ACCOUNT",
          accountHolder: "MATHESHWARAN R",
          accountNumber: "23550100026910",
          ifscCode: "FDRL0002355",
          branch: "Alagusenai"
        })
        .returning();
      settings = newSettings;
    }

    return { success: true, settings };
  } catch (error) {
    console.error("Failed to get admin payment settings:", error);
    return { success: false, settings: null };
  }
}

export async function updateAdminPaymentSettings(data: {
  payeeName: string;
  payeeUpiId: string;
  bankName: string;
  accountType: string;
  accountHolder: string;
  accountNumber: string;
  ifscCode: string;
  branch: string;
}) {
  await verifyAdminAccess();
  try {
    const [updated] = await db
      .update(adminPaymentSettings)
      .set({
        ...data,
        updatedAt: new Date()
      })
      .where(eq(adminPaymentSettings.id, 1))
      .returning();

    await logAdminAction("Settings", `Updated global payment settings (UPI: ${data.payeeUpiId})`);
    return { success: true, settings: updated };
  } catch (error) {
    console.error("Failed to update admin payment settings:", error);
    return { success: false, error: "Failed to update settings" };
  }
}

// 8. Admin Controls (Clerk Metadata & Activity Logging)
export async function logAdminAction(actionType: string, description: string) {
  try {
    const { userId } = await verifyAdminAccess();
    let adminEmail = "Unknown Admin";
    
    try {
      const { clerkClient } = await import("@clerk/nextjs/server");
      const client = await clerkClient();
      const user = await client.users.getUser(userId);
      adminEmail = user.primaryEmailAddressId 
        ? user.emailAddresses.find(e => e.id === user.primaryEmailAddressId)?.emailAddress || "Unknown Admin"
        : user.emailAddresses[0]?.emailAddress || "Unknown Admin";
    } catch(e) {}
    
    await db.insert(activityLogs).values({
      adminEmail,
      actionType,
      description
    });
  } catch (error) {
    console.error("Failed to log admin action:", error);
  }
}

export async function getAdminActivityLogs() {
  await verifyAdminAccess();
  try {
    const data = await db.select().from(activityLogs).orderBy(desc(activityLogs.createdAt)).limit(50);
    return { success: true, logs: data };
  } catch (error) {
    console.error("Failed to fetch activity logs:", error);
    return { success: false, logs: [] };
  }
}

export async function getActiveAdmins() {
  await verifyAdminAccess();
  try {
    const { clerkClient } = await import("@clerk/nextjs/server");
    const client = await clerkClient();
    const users = await client.users.getUserList(); // Simplified for beta - production would search/paginate
    
    const adminUsers = users.data.filter(u => {
      const role = u.publicMetadata?.role as string | undefined;
      const email = u.emailAddresses[0]?.emailAddress;
      return (role === "SUPER_ADMIN" || role === "ADMIN" || role === "TRANSACTION_MANAGER" || role === "CONTENT_MANAGER") || 
             email === "maddybgmistoreog@gmail.com" || email === "r.mateshwaran.io@gmail.com";
    }).map(u => ({
      id: u.id,
      email: u.emailAddresses[0]?.emailAddress || "Unknown",
      role: u.publicMetadata?.role as string || "SUPER_ADMIN",
      addedDate: new Date(u.createdAt).toLocaleDateString("en-GB", { day: 'numeric', month: 'short', year: 'numeric' })
    }));

    return { success: true, admins: adminUsers };
  } catch (error) {
    console.error("Failed to fetch active admins:", error);
    return { success: false, admins: [] };
  }
}

export async function addAdmin(email: string) {
  await verifyAdminAccess();
  try {
    const { clerkClient } = await import("@clerk/nextjs/server");
    const client = await clerkClient();
    
    const users = await client.users.getUserList({ emailAddress: [email] });
    if (users.data.length === 0) {
      return { success: false, error: "No user found with this email. They must sign up first." };
    }
    const targetUser = users.data[0];
    if (!targetUser) return { success: false, error: "User not found." };
    await client.users.updateUserMetadata(targetUser.id, {
      publicMetadata: {
        ...targetUser.publicMetadata,
        role: "ADMIN"
      }
    });

    await logAdminAction("Security", `Authorized new admin: ${email}`);
    
    return { success: true };
  } catch (error) {
    console.error("Failed to add admin:", error);
    return { success: false, error: "Failed to add admin." };
  }
}

export async function revokeAdmin(userId: string) {
  const { userId: currentUserId } = await verifyAdminAccess();
  if (userId === currentUserId) {
    return { success: false, error: "You cannot revoke your own admin access." };
  }

  try {
    const { clerkClient } = await import("@clerk/nextjs/server");
    const client = await clerkClient();
    
    const targetUser = await client.users.getUser(userId);
    const email = targetUser.emailAddresses[0]?.emailAddress || "Unknown";

    if (email === "maddybgmistoreog@gmail.com" || email === "r.mateshwaran.io@gmail.com") {
      return { success: false, error: "Cannot revoke permanent owner access." };
    }
    
    // Create new metadata excluding the role
    const newMetadata = { ...targetUser.publicMetadata };
    delete newMetadata.role;

    // Use empty string to delete field, or just overwrite with object without it
    // Clerk docs: to delete a key, set its value to null
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: null
      }
    });

    await logAdminAction("Security", `Revoked admin access for: ${email}`);
    
    return { success: true };
  } catch (error) {
    console.error("Failed to revoke admin:", error);
    return { success: false, error: "Failed to revoke admin." };
  }
}

