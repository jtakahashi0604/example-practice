import Stripe from "stripe";

import db from "@/_lib/db";

const ACTIVE_SUBSCRIPTION_STATUSES = ["trialing", "active"];

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-10-29.clover" as any,
});

export async function create({
  clientReferenceId,
  subscriptionId,
}: {
  clientReferenceId: string;
  subscriptionId: string;
}) {
  await db.subscription.create({
    data: {
      clientReferenceId,
      subscriptionId,
    },
  });
}

export async function getPaymentUrl({
  clientReferenceId,
}: {
  clientReferenceId: string;
}) {
  return `${process.env.NEXT_PUBLIC_STRIPE_PAYMENT_URL}?client_reference_id=${clientReferenceId}`;
}

export async function getSettingUrl({
  clientReferenceId,
}: {
  clientReferenceId: string;
}) {
  const subscription = await db.subscription.findFirst({
    where: { clientReferenceId },
    orderBy: { createdAt: "desc" },
  });

  if (subscription == null) {
    return null;
  }

  return `${process.env.NEXT_PUBLIC_STRIPE_SETTING_URL}`;
}

export async function getSubscriptionStatus({
  clientReferenceId,
}: {
  clientReferenceId: string;
}) {
  const subscription = await db.subscription.findFirst({
    where: { clientReferenceId },
    orderBy: { createdAt: "desc" },
  });

  if (subscription == null) {
    return null;
  }

  const stripeSubscription = await stripe.subscriptions.retrieve(
    subscription.subscriptionId,
  );

  return stripeSubscription.status;
}

export async function isActive({
  clientReferenceId,
}: {
  clientReferenceId: string;
}): Promise<boolean> {
  const status = await getSubscriptionStatus({
    clientReferenceId,
  });

  if (status === null) {
    return false;
  }

  return ACTIVE_SUBSCRIPTION_STATUSES.includes(status);
}
