import type { Metadata } from "next";

import { PrivateRegistryTagMain } from "@/domain/private-registry/components/tag/private-registry-tag-main";

export const metadata: Metadata = {
  title: "Private Registry",
};

export default function UserPrivateRegistryTagPage() {
  return <PrivateRegistryTagMain />;
}
