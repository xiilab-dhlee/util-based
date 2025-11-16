import type { Metadata } from "next";

import { PrivateRegistryListMain } from "@/components/private-registry/list/private-registry-list-main";

export const metadata: Metadata = {
  title: "Private Registry",
};

export default function AdminPrivateRegistryPage() {
  return <PrivateRegistryListMain />;
}
