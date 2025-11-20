import type { Metadata } from "next";

import { RegistryMain } from "@/domain/registry/components/registry-main";

export const metadata: Metadata = {
  title: "Registry",
};

export default function AdminRegistryMainPage() {
  return <RegistryMain />;
}
