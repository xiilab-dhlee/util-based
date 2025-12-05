import type { Metadata } from "next";

import { RevokeHistoryListMain } from "@/domain/revoke-history/components/list/revoke-history-list-main";

export const metadata: Metadata = {
  title: "Resource Revocation History",
};

export default function AdminRevokeHistoryPage() {
  return <RevokeHistoryListMain />;
}
