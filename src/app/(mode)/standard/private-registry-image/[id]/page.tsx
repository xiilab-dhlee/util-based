import type { Metadata } from "next";

import { PrivateRegistryImageDetailMain } from "@/components/private-registry-image/detail/private-registry-image-detail-main";

export const metadata: Metadata = {
  title: "Private Registry",
};

export default function StandardPrivateRegistryImageDetailPage() {
  return <PrivateRegistryImageDetailMain />;
}
