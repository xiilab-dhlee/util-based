import type { Metadata } from "next";

import { RegistrySecurityMain } from "@/domain/security/components/registry-security-main";

export const metadata: Metadata = {
  title: "Registry Security",
};

export default function AdminRegistrySecurityPage() {
  return <RegistrySecurityMain />;
}
