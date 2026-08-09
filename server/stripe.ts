import Stripe from 'stripe';
import { getDb, saveDb } from './db.js';

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe | null {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (key) {
      try {
        stripeClient = new Stripe(key);
      } catch (err) {
        console.error('[Stripe] Failed to initialize Stripe client:', err);
      }
    }
  }
  return stripeClient;
}

export interface UserBillingInfo {
  id: string;
  plan: 'TRIAL' | 'PRO' | 'AGENCY';
  credits_remaining: number;
  credits_total: number;
  trial_ends_at: string;
  trial_days_remaining: number;
  is_trial_expired: boolean;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  created_at: string;
}

export async function initBillingTable() {
  const db = await getDb();
  db.run(`
    CREATE TABLE IF NOT EXISTS user_billing (
      id TEXT PRIMARY KEY,
      plan TEXT NOT NULL DEFAULT 'TRIAL',
      credits_remaining INTEGER DEFAULT 15,
      credits_total INTEGER DEFAULT 15,
      trial_ends_at TEXT NOT NULL,
      stripe_customer_id TEXT,
      stripe_subscription_id TEXT,
      created_at TEXT NOT NULL
    );
  `);
  saveDb();
}

export async function getUserBillingInfo(userId: string = 'default_user'): Promise<UserBillingInfo> {
  await initBillingTable();
  const db = await getDb();
  
  const stmt = db.exec(`SELECT * FROM user_billing WHERE id = '${userId}'`);
  const now = new Date();

  if (stmt.length === 0 || stmt[0].values.length === 0) {
    // Initialize default free trial user with 15 credits & 7-day trial
    const trialEnds = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const created_at = now.toISOString();
    const trial_ends_at = trialEnds.toISOString();

    db.run(
      `INSERT INTO user_billing (id, plan, credits_remaining, credits_total, trial_ends_at, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, 'TRIAL', 15, 15, trial_ends_at, created_at]
    );
    saveDb();

    return {
      id: userId,
      plan: 'TRIAL',
      credits_remaining: 15,
      credits_total: 15,
      trial_ends_at,
      trial_days_remaining: 7,
      is_trial_expired: false,
      stripe_customer_id: null,
      stripe_subscription_id: null,
      created_at,
    };
  }

  const row = stmt[0].values[0];
  const columns = stmt[0].columns;
  const data: any = {};
  columns.forEach((col, idx) => {
    data[col] = row[idx];
  });

  const trialEnd = new Date(data.trial_ends_at);
  const diffMs = trialEnd.getTime() - now.getTime();
  const trialDaysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  const isTrialExpired = data.plan === 'TRIAL' && diffMs <= 0;

  return {
    id: data.id,
    plan: data.plan as any,
    credits_remaining: Number(data.credits_remaining) || 0,
    credits_total: Number(data.credits_total) || 15,
    trial_ends_at: data.trial_ends_at,
    trial_days_remaining: trialDaysRemaining,
    is_trial_expired: isTrialExpired,
    stripe_customer_id: data.stripe_customer_id || null,
    stripe_subscription_id: data.stripe_subscription_id || null,
    created_at: data.created_at,
  };
}

export async function deductUserCredits(amount: number, userId: string = 'default_user'): Promise<{ success: boolean; remaining: number; error?: string }> {
  const billing = await getUserBillingInfo(userId);

  if (billing.credits_remaining < amount) {
    return {
      success: false,
      remaining: billing.credits_remaining,
      error: `Insufficient indexation credits. You need ${amount} credits, but only have ${billing.credits_remaining} remaining. Upgrade your plan to continue.`,
    };
  }

  const newRemaining = billing.credits_remaining - amount;
  const db = await getDb();
  db.run(`UPDATE user_billing SET credits_remaining = ? WHERE id = ?`, [newRemaining, userId]);
  saveDb();

  return {
    success: true,
    remaining: newRemaining,
  };
}

export async function addCreditsAndUpgradePlan(
  plan: 'PRO' | 'AGENCY' | 'TOPUP_100',
  stripeCustomerId?: string,
  stripeSubscriptionId?: string,
  userId: string = 'default_user'
): Promise<UserBillingInfo> {
  const billing = await getUserBillingInfo(userId);
  const db = await getDb();

  let newPlan = billing.plan;
  let addedCredits = 0;
  let newTotal = billing.credits_total;

  if (plan === 'PRO') {
    newPlan = 'PRO';
    addedCredits = 500;
    newTotal = Math.max(billing.credits_total, 500);
  } else if (plan === 'AGENCY') {
    newPlan = 'AGENCY';
    addedCredits = 3000;
    newTotal = Math.max(billing.credits_total, 3000);
  } else if (plan === 'TOPUP_100') {
    addedCredits = 100;
    newTotal += 100;
  }

  const newRemaining = billing.credits_remaining + addedCredits;

  db.run(
    `UPDATE user_billing SET
      plan = ?,
      credits_remaining = ?,
      credits_total = ?,
      stripe_customer_id = COALESCE(?, stripe_customer_id),
      stripe_subscription_id = COALESCE(?, stripe_subscription_id)
     WHERE id = ?`,
    [newPlan, newRemaining, newTotal, stripeCustomerId || null, stripeSubscriptionId || null, userId]
  );
  saveDb();

  return getUserBillingInfo(userId);
}
