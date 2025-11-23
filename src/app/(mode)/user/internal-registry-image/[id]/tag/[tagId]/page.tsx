import type { Metadata } from "next";

import { InternalRegistryImageTagDetailMain } from "@/domain/internal-registry-image/components/tag/internal-registry-image-tag-detail-main";

export const metadata: Metadata = {
  title: "Internal Registry",
};

export default function UserInternalRegistryImageTagDetailPage() {
  return <InternalRegistryImageTagDetailMain />;
}
