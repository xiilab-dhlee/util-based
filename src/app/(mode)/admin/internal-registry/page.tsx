import type { Metadata } from "next";

import { InternalRegistryListMain } from "@/domain/internal-registry/components/list/internal-registry-list-main";

export const metadata: Metadata = {
  title: "Internal Registry",
};

export default function AdminInternalRegistryPage() {
  return <InternalRegistryListMain />;
}
