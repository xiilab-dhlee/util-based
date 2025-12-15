import type { Metadata } from "next";

import { AsideDispatchDetail } from "@/domain/report-reservation/components/aside-dispatch-detail";

/**
 * 관리자 발송 내역 상세 페이지 메타데이터
 */
export const metadata: Metadata = {
  title: "Report reservation detail",
};

/**
 * 관리자 발송 내역 상세 페이지
 */
export default function AdminDispatchDetailPage() {
  return <AsideDispatchDetail />;
}
