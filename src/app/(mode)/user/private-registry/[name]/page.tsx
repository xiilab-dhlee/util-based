import type { Metadata } from "next";

import { PrivateRegistryDetailMain } from "@/domain/private-registry/components/detail/private-registry-detail-main";

export const metadata: Metadata = {
  title: "Private Registry",
};

export default function UserPrivateRegistryDetailPage() {
  return <PrivateRegistryDetailMain />;
}
