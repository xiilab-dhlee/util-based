import type { Metadata } from "next";

import { AdminInternalRegistryImageDetailMain } from "@/domain/internal-registry/components/detail/admin-internal-registry-image-detail-main";

export const metadata: Metadata = {
  title: "Internal Registry",
};

export default function AdminInternalRegistryImageDetailPage() {
  return <AdminInternalRegistryImageDetailMain />;
}
