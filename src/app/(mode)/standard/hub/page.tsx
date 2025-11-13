import type { Metadata } from "next";

import { HubListMain } from "@/components/hub/list/hub-list-main";

/**
 * 표준 사용자 허브 페이지 메타데이터
 */
export const metadata: Metadata = {
  title: "허브 | AstraGo",
};
/**
 * 표준 사용자 허브 페이지
 *
 */
export default function StandardHubPage() {
  return <HubListMain />;
}
