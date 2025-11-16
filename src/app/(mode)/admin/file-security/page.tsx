import type { Metadata } from "next";

import { FileSecurityMain } from "@/components/security/file-security-main";

export const metadata: Metadata = {
  title: "File Security",
};

export default function AdminFileSecurityPage() {
  return <FileSecurityMain />;
}
