import type { Metadata } from "next";

import { PrivateRegistryImageListMain } from "@/domain/private-registry-image/components/list/private-registry-image-list-main";

export const metadata: Metadata = {
  title: "Private Registry",
};

export default function StandardPrivateRegistryImagePage() {
  return <PrivateRegistryImageListMain />;
}
