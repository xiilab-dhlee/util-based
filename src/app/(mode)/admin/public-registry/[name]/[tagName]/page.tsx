import type { Metadata } from "next";

import { RegistryTagMain } from "@/domain/registry/components/tag/registry-tag-main";

export const metadata: Metadata = {
  title: "Public Registry",
};

export default function AdminPublicRegistryTagDetailPage() {
  return <RegistryTagMain mode="public" />;
}
