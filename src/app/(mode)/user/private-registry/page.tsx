import type { Metadata } from "next";

import { RegistryListMain } from "@/domain/registry/components/list/registry-list-main";

export const metadata: Metadata = {
  title: "Private Registry",
};

export default function UserPrivateRegistryPage() {
  return <RegistryListMain mode="private" />;
}
