import type { Metadata } from "next";

import { HubDetailMain } from "@/domain/hub/components/detail/hub-detail-main";

export const metadata: Metadata = {
  title: "Hub Detail",
};

/**
 * Hub 상세 페이지
 *
 * URL 파라미터에서 id를 읽어 해당 허브의 상세 정보를 표시합니다.
 * layout.tsx의 children 슬롯으로 렌더링되어 AsideHub에 hubId를 전달합니다.
 */
export default function UserHubDetailPage() {
  return <HubDetailMain />;
}
