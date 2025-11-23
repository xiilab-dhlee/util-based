import type { Metadata } from "next";

import { InternalRegistryImageDetailMain } from "@/domain/internal-registry-image/components/detail/internal-registry-image-detail-main";

export const metadata: Metadata = {
  title: "Internal Registry",
};

export default function UserInternalRegistryImageDetailPage() {
  return <InternalRegistryImageDetailMain />;
}
