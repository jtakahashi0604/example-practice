"use client";

import { cn } from "@/_lib/utils";

const ACTIVE_SUBSCRIPTION_STATUSES = ["trialing", "active"];

export default function Component({
  subscriptionStatus,
  paymentUrl,
  settingUrl,
  className,
  ...props
}: {
  subscriptionStatus: string | null;
  paymentUrl: string;
  settingUrl: string | null;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("space-y-4", className)} {...props}>
      {subscriptionStatus !== null &&
      settingUrl !== null &&
      ACTIVE_SUBSCRIPTION_STATUSES.includes(subscriptionStatus) ? (
        <div>
          <p>Plan: plus</p>
          <a href={settingUrl} className="hover:underline">
            Manage Subscription
          </a>
        </div>
      ) : (
        <div>
          <p>Plan: free</p>
          <a href={paymentUrl} className="hover:underline">
            Manage Subscription
          </a>
        </div>
      )}
    </div>
  );
}
