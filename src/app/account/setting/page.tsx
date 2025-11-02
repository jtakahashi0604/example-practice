import * as authService from "@/_services/app/auth";
import * as subscriptionService from "@/_services/app/subscription";

import SubscriptionForm from "@/_components/app/account/setting/subscription/form";

export default async function Page() {
  const teamId = await authService.getTeamId();

  const subscriptionStatus = await subscriptionService.getSubscriptionStatus({
    clientReferenceId: teamId,
  });
  const paymentUrl = await subscriptionService.getPaymentUrl({
    clientReferenceId: teamId,
  });
  const settingUrl = await subscriptionService.getSettingUrl({
    clientReferenceId: teamId,
  });

  return (
    <div className="space-y-4">
      <SubscriptionForm
        subscriptionStatus={subscriptionStatus}
        paymentUrl={paymentUrl}
        settingUrl={settingUrl}
      />
    </div>
  );
}
