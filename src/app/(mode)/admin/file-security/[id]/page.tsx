import type { Metadata } from "next";

import { FileSecurityScanDetailMain } from "@/domain/security/components/file-security/scan/file-security-scan-detail-main";

export const metadata: Metadata = {
  title: "File Security Scan Detail",
};

export default function AdminFileSecurityScanDetailPage() {
  return <FileSecurityScanDetailMain />;
}
