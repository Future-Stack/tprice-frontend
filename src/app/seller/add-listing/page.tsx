"use client";

import React from "react";
import { ListingWizard } from "@/components/shared/ListingWizard";

export default function SellerAddListingPage() {
  return <ListingWizard role="seller" redirectPath="/seller/my-listing" />;
}
