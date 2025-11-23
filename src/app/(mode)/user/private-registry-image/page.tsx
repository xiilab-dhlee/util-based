import type { Metadata } from "next";

import { InternalRegistryImageListMain } from "@/domain/internal-registry-image/components/list/internal-registry-image-list-main";

export const metadata: Metadata = {
  title: "Internal Registry",
};

export default function UserInternalRegistryImagePage() {
  return <InternalRegistryImageListMain />;
}
