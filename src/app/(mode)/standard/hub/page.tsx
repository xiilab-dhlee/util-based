import type { Metadata } from "next";

import { HubListMain } from "@/components/hub/list/hub-list-main";

export const metadata: Metadata = {
  title: "Hub",
};

export default function StandardHubPage() {
  return <HubListMain />;
}
