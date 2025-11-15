import type { Metadata } from "next";

import { NodeListMain } from "@/components/node/list/node-list-main";

/**
 * 표준 사용자 워크로드 목록 페이지 메타데이터
 */
export const metadata: Metadata = {
  title: "노드관리",
};

// 관리자 노드 관리 페이지
export default function AdminNodePage() {
  return <NodeListMain />;
}
