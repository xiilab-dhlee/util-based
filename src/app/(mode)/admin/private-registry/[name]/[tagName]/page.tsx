import type { Metadata } from "next";

import { RegistryTagMain } from "@/domain/registry/components/tag/registry-tag-main";

export const metadata: Metadata = {
  title: "Private Registry",
};

export default function AdminPrivateRegistryTagDetailPage() {
  return <RegistryTagMain mode="private" />;
}
