import type { Metadata } from "next";

import { RegistryListMain } from "@/domain/registry/components/list/registry-list-main";

export const metadata: Metadata = {
  title: "Public Registry",
};

export default function UserPublicRegistryPage() {
  return <RegistryListMain mode="public" />;
}
