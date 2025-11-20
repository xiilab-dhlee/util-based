import type { Metadata } from "next";

import { NodeDetailMain } from "@/domain/node/components/detail/node-detail-main";

export const metadata: Metadata = {
  title: "Node Management",
};

/**
 * 관리자 노드 상세 페이지
 */
export default function AdminNodeDetailPage() {
  return <NodeDetailMain />;
}
