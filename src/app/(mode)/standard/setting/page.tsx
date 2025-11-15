import type { Metadata } from "next";

// import { SettingMain } from "@/components/setting/setting-main";

/**
 * 표준 사용자 설정 페이지 메타데이터
 */
export const metadata: Metadata = {
  title: "설정 | AstraGo",
  description: "멤버 관리, 워크스페이스 정보, 리소스 신청 현황을 관리하세요.",
};

/**
 * 표준 사용자 설정 페이지
 *
 * App Router에서 서버 컴포넌트로 구현된 설정 페이지입니다.
 * 멤버 관리, 워크스페이스 상세정보, 리소스 신청, 크레덴셜 관리 기능을 제공합니다.
 *
 * 참고: 인증 및 권한 체크는 middleware.ts에서 처리됨
 */
export default async function StandardSettingPage() {
  // return <SettingMain />;
  return null;
}
