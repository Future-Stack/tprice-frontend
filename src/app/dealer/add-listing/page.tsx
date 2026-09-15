"use client";

import React from "react";
import { ListingWizard } from "@/components/shared/ListingWizard";

export default function DealerAddListingPage() {
  return <ListingWizard role="dealer" redirectPath="/dealer/listing" />;
}
