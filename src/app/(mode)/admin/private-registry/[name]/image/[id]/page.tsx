import type { Metadata } from "next";

import { AdminPrivateRegistryImageDetailMain } from "@/domain/private-registry/components/detail/admin-private-registry-image-detail-main";

export const metadata: Metadata = {
  title: "Private Registry",
};

export default function AdminPrivateRegistryImageDetailPage() {
  return <AdminPrivateRegistryImageDetailMain />;
}
