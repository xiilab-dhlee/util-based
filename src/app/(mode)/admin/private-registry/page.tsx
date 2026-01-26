import type { Metadata } from "next";

import { RegistryUserListMain } from "@/domain/registry/components/user-list/registry-user-list-main";

export const metadata: Metadata = {
  title: "Private Registry",
};

export default function AdminPrivateRegistryPage() {
  return <RegistryUserListMain mode="private" />;
}
