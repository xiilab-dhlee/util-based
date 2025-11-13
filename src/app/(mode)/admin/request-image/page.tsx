import type { Metadata } from "next";

import { RequestImageListMain } from "@/components/request-image/request-image-list-main";

/**
 * 표준 사용자 워크로드 목록 페이지 메타데이터
 */
export const metadata: Metadata = {
  title: "이미지 사용 요청 | AstraGo",
};
// 관리자 이미지 사용 요청 메인 페이지
export default function AdminRequestImagePage() {
  return <RequestImageListMain />;
}
