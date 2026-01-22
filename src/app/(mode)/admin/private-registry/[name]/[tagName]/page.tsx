import type { Metadata } from "next";

import { RegistryTagMain } from "@/domain/registry/components/tag/registry-tag-main";

export const metadata: Metadata = {
  title: "Registry Tag Detail",
};

export default function AdminRegistryTagDetailPage() {
  return <RegistryTagMain />;
}
