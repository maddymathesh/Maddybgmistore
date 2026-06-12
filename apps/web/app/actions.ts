/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { db, siteViews, products, ucPrices, xsuitGifts, supercarGifts, reviews, proofs, customerFeedback, paymentLinks, adminPaymentSettings, eq, desc, asc } from "@repo/db";
import { auth } from "@clerk/nextjs/server";

export async function getOrIncrementViews(shouldIncrement: boolean) {
  try {
    const rowId = "total_views";
    // Check if the views row exists
    let row = await db.query.siteViews.findFirst({
      where: eq(siteViews.id, rowId),
    });

    if (!row) {
      // Create initial row
      await db.insert(siteViews).values({
        id: rowId,
        count: 14852,
      });
      row = { id: rowId, count: 14852, updatedAt: new Date() };
    }

    if (shouldIncrement) {
      const newCount = row.count + 1;
      await db
        .update(siteViews)
        .set({ count: newCount, updatedAt: new Date() })
        .where(eq(siteViews.id, rowId));
      return { count: newCount };
    }

    return { count: row.count };
  } catch (error) {
    console.error("Failed to process site views:", error);
    // Fallback to local default
    return { count: 14852 };
  }
}

export async function getProducts() {
  try {
    const allProducts = await db
      .select()
      .from(products)
      .orderBy(desc(products.createdAt));
    return { success: true, products: allProducts };
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return { success: false, products: [] };
  }
}

export async function getProductById(id: string) {
  try {
    const product = await db.query.products.findFirst({
      where: eq(products.id, id),
    });
    return { success: true, product };
  } catch (error) {
    console.error(`Failed to fetch product with id ${id}:`, error);
    return { success: false, error: "Failed to fetch product" };
  }
}

export async function getUcPacks() {
  try {
    const packs = await db
      .select()
      .from(ucPrices)
      .orderBy(asc(ucPrices.offerPrice));
    return { success: true, packs };
  } catch (error) {
    console.error("Failed to fetch UC packs:", error);
    return { success: false, packs: [] };
  }
}

export async function getXsuitGifts() {
  try {
    const gifts = await db
      .select()
      .from(xsuitGifts)
      .orderBy(desc(xsuitGifts.createdAt));
    return { success: true, gifts };
  } catch (error) {
    console.error("Failed to fetch X-suit gifts:", error);
    return { success: false, gifts: [] };
  }
}

export async function getSupercarGifts() {
  try {
    const gifts = await db
      .select()
      .from(supercarGifts)
      .orderBy(desc(supercarGifts.createdAt));
    return { success: true, gifts };
  } catch (error) {
    console.error("Failed to fetch Supercar gifts:", error);
    return { success: false, gifts: [] };
  }
}

export async function getReviews(page: number = 0) {
  try {
    const limit = 6;
    const offset = page * limit;
    const data = await db
      .select()
      .from(reviews)
      .where(eq(reviews.status, "approved"))
      .orderBy(desc(reviews.createdAt))
      .limit(limit)
      .offset(offset);
    
    // Calculate stats
    const allReviews = await db
      .select({ rating: reviews.rating })
      .from(reviews)
      .where(eq(reviews.status, "approved"));
    
    const total = allReviews.length;
    const avg = total > 0 ? allReviews.reduce((acc, r) => acc + r.rating, 0) / total : 5.0;
    
    return { success: true, reviews: data, totalReviews: total, averageRating: avg };
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
    return { success: false, reviews: [], totalReviews: 0, averageRating: 5.0 };
  }
}

export async function submitReview(name: string, rating: number, comment: string) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Access Denied: You must be logged in to submit a review." };
    }

    const [newReview] = await db
      .insert(reviews)
      .values({
        name: name.trim() || "Anonymous",
        rating,
        comment: comment.trim(),
        status: "pending",
      })
      .returning();

    return { success: true, review: newReview, aiApproved: false };
  } catch (error) {
    console.error("Failed to submit review:", error);
    return { success: false, error: "Failed to submit review" };
  }
}

export async function getProofs() {
  try {
    const data = await db
      .select()
      .from(proofs)
      .orderBy(desc(proofs.createdAt));
    return { success: true, proofs: data };
  } catch (error) {
    console.error("Failed to fetch proofs:", error);
    return { success: false, proofs: [] };
  }
}

export async function submitFeedback(name: string, stars: number, comment: string, desiredItems: string, phone: string) {
  try {
    const [newFeedback] = await db
      .insert(customerFeedback)
      .values({
        name: name.trim() || "Anonymous",
        stars,
        comment: comment.trim(),
        desiredItems: desiredItems.trim() || "None specified",
        phone: phone.trim() || "Not provided",
        status: "unread",
      })
      .returning();
    return { success: true, feedback: newFeedback };
  } catch (error) {
    console.error("Failed to submit feedback:", error);
    return { success: false, error: "Failed to submit feedback" };
  }
}

export async function getPaymentLink(paymentId: string) {
  try {
    const link = await db.query.paymentLinks.findFirst({
      where: eq(paymentLinks.id, paymentId),
    });

    if (!link) {
      return { success: false, reason: "not_found" };
    }

    // Check expiration
    const isExpired = link.expiresAt && new Date(link.expiresAt) < new Date();
    if (isExpired && link.status === "active") {
      await db
        .update(paymentLinks)
        .set({ status: "expired" })
        .where(eq(paymentLinks.id, paymentId));
      return { success: false, reason: "expired", link: { ...link, status: "expired" } };
    }

    if (link.status !== "active") {
      const adminSettingsData = await db.query.adminPaymentSettings.findFirst({
        where: eq(adminPaymentSettings.id, 1),
      });
      const { pin, ...publicLink } = link;
      let proofUrl = null;
      if (link.status === "paid") {
        const proofRecord = await db.query.proofs.findFirst({
          where: eq(proofs.transactionId, link.transactionId),
        });
        if (proofRecord) {
          proofUrl = proofRecord.imageUrl;
        }
      }
      return { success: false, reason: link.status, link: publicLink, adminSettings: adminSettingsData || null, proofUrl };
    }

    if (link.failedAttempts >= 5) {
      if (link.status === "active") {
        await db
          .update(paymentLinks)
          .set({ status: "revoked", revokedReason: "MAX_PIN_ATTEMPTS_EXCEEDED", revokedAt: new Date() })
          .where(eq(paymentLinks.id, paymentId));
      }
      return { success: false, reason: "locked_out" };
    }

    // Get admin settings for global fallback coordinates
    const adminSettingsData = await db.query.adminPaymentSettings.findFirst({
      where: eq(adminPaymentSettings.id, 1),
    });

    // Remove PIN from public return
    const { pin, ...publicLink } = link;

    return { 
      success: true, 
      link: publicLink, 
      adminSettings: adminSettingsData || null,
      requiresPin: !!pin 
    };
  } catch (error) {
    console.error("Failed to get payment link:", error);
    return { success: false, reason: "error" };
  }
}

export async function verifyPaymentPin(paymentId: string, inputPin: string) {
  try {
    const link = await db.query.paymentLinks.findFirst({
      where: eq(paymentLinks.id, paymentId),
    });

    if (!link) {
      return { success: false, reason: "not_found" };
    }

    if (link.status !== "active" || link.failedAttempts >= 5) {
      return { success: false, reason: "inactive_or_locked" };
    }

    if (link.pin === inputPin) {
      // Reset attempts
      if (link.failedAttempts > 0) {
        await db
          .update(paymentLinks)
          .set({ failedAttempts: 0 })
          .where(eq(paymentLinks.id, paymentId));
      }
      return { success: true };
    } else {
      const newAttempts = link.failedAttempts + 1;
      const updates: any = { failedAttempts: newAttempts };
      
      if (newAttempts >= 5) {
        updates.status = "revoked";
        updates.revokedReason = "MAX_PIN_ATTEMPTS_EXCEEDED";
        updates.revokedAt = new Date();
      }

      await db
        .update(paymentLinks)
        .set(updates)
        .where(eq(paymentLinks.id, paymentId));

      return { 
        success: false, 
        failedAttempts: newAttempts, 
        locked: newAttempts >= 5 
      };
    }
  } catch (error) {
    console.error("Failed to verify payment PIN:", error);
    return { success: false, reason: "error" };
  }
}

export async function submitPaymentProof(paymentId: string, imageUrl: string) {
  try {
    const link = await db.query.paymentLinks.findFirst({
      where: eq(paymentLinks.id, paymentId),
    });

    if (!link) {
      return { success: false, error: "Payment session not found" };
    }

    if (link.status !== "active") {
      return { success: false, error: `This payment link is already ${link.status}` };
    }

    // 1. Update payment link status to paid
    await db
      .update(paymentLinks)
      .set({ status: "paid" })
      .where(eq(paymentLinks.id, paymentId));

    // 2. Automatically create a record in the proofs table
    const now = new Date();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const currentMonth = months[now.getMonth()] || "January";
    const currentYear = now.getFullYear().toString();

    await db.insert(proofs).values({
      title: `Payment Proof - ${link.customerName}`,
      imageUrl: imageUrl,
      month: currentMonth,
      year: currentYear,
      category: "Payment",
      transactionId: link.transactionId || null,
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to submit payment proof:", error);
    return { success: false, error: "Failed to submit payment proof" };
  }
}



