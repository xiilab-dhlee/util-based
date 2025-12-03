import type { Metadata } from "next";

import { RegistryImageTagDetailMain } from "@/domain/security/components/registry-image/tag/registry-image-tag-detail-main";

export const metadata: Metadata = {
  title: "Registry Security",
};

export default function AdminRegistrySecurityPage() {
  return <RegistryImageTagDetailMain />;
}
