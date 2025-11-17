"use client";

// import { isNull } from "lodash";
// import { useSearchParams } from "next/navigation";

// import ClusterReportMain from "./cluster-report-main";
// import SystemReportMain from "./system-report-main";
import { UnreadyReport } from "./unready-report";

/**
 * 리포트 페이지의 메인 컴포넌트
 */
export function ReportMain() {
  // const searchParams = useSearchParams();

  // const reportType = searchParams.get("reportType");

  // const endDate = searchParams.get("endDate");

  const render = <UnreadyReport />;
  // 기간이 설정되어 있고
  // if (!isNull(endDate)) {
  //   if (reportType === "WEEKLY_SYSTEM" || reportType === "MONTHLY_SYSTEM") {
  //     render = <SystemReportMain />;
  //   } else if (
  //     reportType === "WEEKLY_CLUSTER" ||
  //     reportType === "MONTHLY_CLUSTER"
  //   ) {
  //     render = <ClusterReportMain />;
  //   }
  // }

  return <>{render}</>;
}
