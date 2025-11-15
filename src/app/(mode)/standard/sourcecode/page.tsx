import type { Metadata } from "next";

import { SourcecodeListMain } from "@/components/sourcecode/list/sourcecode-list-main";

/**
 * 소스코드 페이지 메타데이터
 */
export const metadata: Metadata = {
  title: "소스코드",
};

/**
 * 표준 사용자 소스코드 관리 페이지
 */
export default function StandardSourcecodePage() {
  return <SourcecodeListMain />;
}
