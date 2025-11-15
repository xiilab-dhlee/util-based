import type { Metadata } from "next";

import { SourcecodeDetailMain } from "@/components/sourcecode/detail/sourcecode-detail-main";

/**
 * 소스코드 페이지 메타데이터
 */
export const metadata: Metadata = {
  title: "소스코드",
};

/**
 * 표준 사용자 소스코드 관리 페이지
 */
export default function StandardSourcecodeDetailPage() {
  return <SourcecodeDetailMain />;
}
