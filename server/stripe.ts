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
  try {
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

    // Ensure missing columns exist in case table was created with partial schema earlier
    const alterCols = [
      'plan TEXT NOT NULL DEFAULT "TRIAL"',
      'credits_remaining INTEGER DEFAULT 15',
      'credits_total INTEGER DEFAULT 15',
      'trial_ends_at TEXT',
      'stripe_customer_id TEXT',
      'stripe_subscription_id TEXT',
      'created_at TEXT'
    ];
    for (const colDef of alterCols) {
      try {
        db.run(`ALTER TABLE user_billing ADD COLUMN ${colDef};`);
      } catch (e) {
        // column likely exists, ignore
      }
    }
    saveDb();
  } catch (err) {
    console.error('[initBillingTable error]:', err);
  }
}

export async function getUserBillingInfo(userId: string = 'default_user'): Promise<UserBillingInfo> {
  const now = new Date();
  const defaultTrialEnds = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
  const defaultCreatedAt = now.toISOString();

  const defaultBilling: UserBillingInfo = {
    id: userId,
    plan: 'TRIAL',
    credits_remaining: 15,
    credits_total: 15,
    trial_ends_at: defaultTrialEnds,
    trial_days_remaining: 7,
    is_trial_expired: false,
    stripe_customer_id: null,
    stripe_subscription_id: null,
    created_at: defaultCreatedAt,
  };

  try {
    await initBillingTable();
    const db = await getDb();

    const stmt = db.exec(`SELECT * FROM user_billing WHERE id = '${userId}'`);

    if (stmt.length === 0 || stmt[0].values.length === 0) {
      db.run(
        `INSERT OR REPLACE INTO user_billing (id, plan, credits_remaining, credits_total, trial_ends_at, created_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, 'TRIAL', 15, 15, defaultTrialEnds, defaultCreatedAt]
      );
      saveDb();
      return defaultBilling;
    }

    const row = stmt[0].values[0];
    const columns = stmt[0].columns;
    const data: any = {};
    columns.forEach((col, idx) => {
      data[col] = row[idx];
    });

    const trialEndsAtStr = data.trial_ends_at || defaultTrialEnds;
    const trialEnd = new Date(trialEndsAtStr);
    const validTrialEnd = isNaN(trialEnd.getTime()) ? new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) : trialEnd;
    const diffMs = validTrialEnd.getTime() - now.getTime();
    const trialDaysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
    const isTrialExpired = (data.plan === 'TRIAL' || !data.plan) && diffMs <= 0;

    return {
      id: userId,
      plan: (data.plan as any) || 'TRIAL',
      credits_remaining: typeof data.credits_remaining === 'number' ? data.credits_remaining : (Number(data.credits_remaining) || 15),
      credits_total: typeof data.credits_total === 'number' ? data.credits_total : (Number(data.credits_total) || 15),
      trial_ends_at: validTrialEnd.toISOString(),
      trial_days_remaining: trialDaysRemaining,
      is_trial_expired: isTrialExpired,
      stripe_customer_id: data.stripe_customer_id || null,
      stripe_subscription_id: data.stripe_subscription_id || null,
      created_at: data.created_at || defaultCreatedAt,
    };
  } catch (err) {
    console.error('[getUserBillingInfo Error]:', err);
    return defaultBilling;
  }
}

export async function deductUserCredits(amount: number, userId: string = 'default_user'): Promise<{ success: boolean; remaining: number; error?: string }> {
  try {
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
  } catch (err: any) {
    console.error('[deductUserCredits error]:', err);
    return {
      success: false,
      remaining: 0,
      error: 'Failed to process credit deduction: ' + err.message,
    };
  }
}

export async function addCreditsAndUpgradePlan(
  plan: 'PRO' | 'AGENCY' | 'TOPUP_100',
  stripeCustomerId?: string,
  stripeSubscriptionId?: string,
  userId: string = 'default_user'
): Promise<UserBillingInfo> {
  try {
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
  } catch (err: any) {
    console.error('[addCreditsAndUpgradePlan error]:', err);
    return getUserBillingInfo(userId);
  }
}
