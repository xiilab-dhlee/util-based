import type { Metadata } from "next";

import { HubListMain } from "@/domain/hub/components/list/hub-list-main";

export const metadata: Metadata = {
  title: "Hub",
};

export default function UserHubPage() {
  return <HubListMain />;
}
