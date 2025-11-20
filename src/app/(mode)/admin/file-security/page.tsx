import type { Metadata } from "next";

import { FileSecurityMain } from "@/domain/security/components/file-security-main";

export const metadata: Metadata = {
  title: "File Security",
};

export default function AdminFileSecurityPage() {
  return <FileSecurityMain />;
}
