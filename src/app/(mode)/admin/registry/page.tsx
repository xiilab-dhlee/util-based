import type { Metadata } from "next";

import { RegistryMain } from "@/components/registry/registry-main";

export const metadata: Metadata = {
  title: "Registry",
};

export default function AdminRegistryMainPage() {
  return <RegistryMain />;
}
