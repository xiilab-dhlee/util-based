import type { Metadata } from "next";

import { HubDetailMain } from "@/domain/hub/components/detail/hub-detail-main";

export const metadata: Metadata = {
  title: "Hub Detail",
};

export default function UserHubDetailPage() {
  return <HubDetailMain />;
}
