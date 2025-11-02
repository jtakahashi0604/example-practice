import { NextResponse } from "next/server";
import Stripe from "stripe";

import * as subscriptionService from "@/_services/app/subscription";

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-10-29.clover" as any,
});

export async function POST(request: Request) {
  if (STRIPE_WEBHOOK_SECRET == null) {
    return NextResponse.json(
      {
        message: "Bad request",
      },
      {
        status: 400,
      },
    );
  }

  const sign = request.headers.get("stripe-signature");

  if (sign == null) {
    return NextResponse.json(
      {
        message: "Bad request",
      },
      {
        status: 400,
      },
    );
  }

  try {
    const body = await request.arrayBuffer();
    const buff = Buffer.from(body);

    const event = stripe.webhooks.constructEvent(
      buff,
      sign,
      STRIPE_WEBHOOK_SECRET,
    );

    if (event.type !== "checkout.session.completed") {
      console.error(event.data.object);
      throw new Error("Invalid event type");
    }

    const clientReferenceId = event.data.object.client_reference_id;
    const subscriptionId = event.data.object.subscription?.toString();

    if (clientReferenceId == null || subscriptionId == null) {
      console.error(event.data.object);
      throw new Error("Invalid event data");
    }

    await subscriptionService.create({
      clientReferenceId,
      subscriptionId,
    });
  } catch (error) {
    const message = `${(error as Error).message}`;

    console.error(message);

    return NextResponse.json(
      {
        message: "Bad request",
      },
      {
        status: 400,
      },
    );
  }

  return NextResponse.json(
    {
      message: "Success",
    },
    {
      status: 200,
    },
  );
}

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;
export const fetchCache = "force-no-store";
