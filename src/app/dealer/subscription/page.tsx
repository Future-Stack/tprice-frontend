"use client";

import React from "react";
import { toast } from "sonner";
import { useFeaturedPricingQuery, useFeaturedStatusQuery } from "@/hooks/useListings";
import { useCreateCheckoutSessionMutation } from "@/hooks/usePayments";
import { getPaymentReturnUrl } from "@/lib/api/payments";
import {
  SubscriptionHeader,
  ActiveSubscriptionBanner,
  SubscriptionErrorAlert,
  SubscriptionSkeleton,
  SinglePlanCard,
  UnlimitedPlanCard,
} from "./_components";

export default function DealerSubscriptionPage() {
  const {
    data: pricingData,
    isLoading: isPricingLoading,
    isError: isPricingError,
    error: pricingError,
    refetch: refetchPricing,
  } = useFeaturedPricingQuery();

  const {
    data: statusData,
    isLoading: isStatusLoading,
    isError: isStatusError,
    error: statusError,
    refetch: refetchStatus,
  } = useFeaturedStatusQuery();

  const { mutate: createCheckoutSession, isPending } = useCreateCheckoutSessionMutation();

  const isLoading = isPricingLoading || isStatusLoading;
  const isError = isPricingError || isStatusError;
  const error = pricingError || statusError;

  const handleRefetch = () => {
    refetchPricing();
    refetchStatus();
  };

  const handleSubscribeUnlimited = () => {
    const successUrl = getPaymentReturnUrl("/payment/success");
    const cancelUrl = getPaymentReturnUrl("/payment/cancel");

    createCheckoutSession(
      {
        type: pricingData?.unlimitedAnnual?.plan || "FEATURED_UNLIMITED_ANNUAL",
        successUrl,
        cancelUrl,
      },
      {
        onSuccess: (data) => {
          const responseData = data as unknown as {
            checkoutUrl?: string;
            data?: { checkoutUrl?: string };
            url?: string;
          };
          const checkoutUrl =
            data?.checkoutUrl || responseData?.data?.checkoutUrl || responseData?.url;

          if (checkoutUrl) {
            toast.success("Redirecting to secure Stripe checkout...");
            window.location.assign(checkoutUrl);
          } else {
            toast.error("Checkout session created, but no checkout URL was returned.");
          }
        },
        onError: (err: unknown) => {
          let errorMessage = "Failed to initiate subscription checkout.";
          const axiosErr = err as {
            response?: { data?: { message?: string | string[] } };
            message?: string;
          };
          const rawMsg = axiosErr?.response?.data?.message;
          if (Array.isArray(rawMsg)) {
            errorMessage = rawMsg.join(", ");
          } else if (typeof rawMsg === "string" && rawMsg.trim()) {
            errorMessage = rawMsg;
          } else if (axiosErr?.message) {
            errorMessage = axiosErr.message;
          }
          toast.error(errorMessage);
        },
      }
    );
  };

  const singlePlan = pricingData?.singleListing;
  const unlimitedPlan = pricingData?.unlimitedAnnual;
  const hasActiveSubscription = Boolean(statusData?.hasActiveSubscription);
  const errorMessage =
    (error as unknown as { response?: { data?: { message?: string } } })?.response?.data?.message ||
    error?.message;

  return (
    <div className="space-y-10 relative z-0 max-w-6xl mx-auto pb-12">
      <SubscriptionHeader isError={isError} onRefresh={handleRefetch} />

      {!isLoading && hasActiveSubscription && (
        <ActiveSubscriptionBanner
          daysRemaining={statusData?.daysRemaining}
          expiresAt={statusData?.expiresAt}
          totalFeaturedListings={statusData?.totalFeaturedListings}
        />
      )}

      {isError && <SubscriptionErrorAlert errorMessage={errorMessage} onReload={handleRefetch} />}

      {isLoading ? (
        <SubscriptionSkeleton />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          <SinglePlanCard
            price={singlePlan?.price}
            duration={singlePlan?.duration}
            billingInterval={singlePlan?.billingInterval}
            description={singlePlan?.description}
          />
          <UnlimitedPlanCard
            price={unlimitedPlan?.price}
            billingInterval={unlimitedPlan?.billingInterval}
            description={unlimitedPlan?.description}
            hasActiveSubscription={hasActiveSubscription}
            expiresAt={statusData?.expiresAt}
            daysRemaining={statusData?.daysRemaining}
            isPending={isPending}
            isLoading={isLoading}
            onSubscribe={handleSubscribeUnlimited}
          />
        </div>
      )}
    </div>
  );
}
