import type { Metadata } from "next";

import { AsideDispatchDetail } from "@/domain/report-reservation/components/aside-dispatch-detail";

/**
 * 관리자 리포트 예약 페이지 메타데이터
 */
export const metadata: Metadata = {
  title: "Report Reservation",
};

/**
 * 관리자 리포트 예약 페이지
 */
export default function AdminReportReservationPage() {
  return <AsideDispatchDetail />;
}
