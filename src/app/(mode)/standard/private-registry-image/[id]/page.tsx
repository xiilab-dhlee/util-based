import type { Metadata } from "next";

import { PrivateRegistryImageDetailMain } from "@/domain/private-registry-image/components/detail/private-registry-image-detail-main";

export const metadata: Metadata = {
  title: "Private Registry",
};

export default function StandardPrivateRegistryImageDetailPage() {
  return <PrivateRegistryImageDetailMain />;
}
