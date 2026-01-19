import type { Metadata } from "next";

import { HubListMain } from "@/domain/hub/components/list/hub-list-main";

export const metadata: Metadata = {
  title: "Hub",
};

/**
 * Hub 목록 페이지
 *
 * 데이터 로드 후 첫 번째 허브 상세 페이지로 자동 리다이렉트됩니다.
 * layout.tsx의 children 슬롯으로 렌더링됩니다.
 */
export default function UserHubPage() {
  return <HubListMain />;
}
