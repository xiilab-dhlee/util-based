import type { Metadata } from "next";

import { RegistryDetailMain } from "@/domain/registry/components/detail/registry-detail-main";

export const metadata: Metadata = {
  title: "Public Registry",
};

export default function UserPublicRegistryDetailPage() {
  return <RegistryDetailMain mode="public" />;
}
