import type { Metadata } from "next";

import { RegistryDetailMain } from "@/domain/registry/components/detail/registry-detail-main";

export const metadata: Metadata = {
  title: "Private Registry",
};

export default function UserPrivateRegistryDetailPage() {
  return <RegistryDetailMain mode="private" />;
}
