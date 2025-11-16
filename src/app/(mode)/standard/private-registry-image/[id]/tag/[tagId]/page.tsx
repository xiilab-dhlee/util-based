import type { Metadata } from "next";

import { PrivateRegistryImageTagDetailMain } from "@/components/private-registry-image/tag/private-registry-image-tag-detail-main";

export const metadata: Metadata = {
  title: "Private Registry",
};

export default function StandardPrivateRegistryImageTagDetailPage() {
  return <PrivateRegistryImageTagDetailMain />;
}
