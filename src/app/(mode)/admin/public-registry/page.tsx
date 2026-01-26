import type { Metadata } from "next";

import { RegistryUserListMain } from "@/domain/registry/components/user-list/registry-user-list-main";

export const metadata: Metadata = {
  title: "Public Registry",
};

export default function AdminPublicRegistryPage() {
  return <RegistryUserListMain mode="public" />;
}
