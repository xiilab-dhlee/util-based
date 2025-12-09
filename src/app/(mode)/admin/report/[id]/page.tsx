"use client";

import { useParams } from "next/navigation";

import { ClusterReportMain } from "@/domain/report/components/cluster-report-main";
import { SystemReportMain } from "@/domain/report/components/system-report-main";
import { useGetReportDetail } from "@/domain/report/hooks/use-get-report-detail";

export default function AdminReportDetailPage() {
  const params = useParams<{ id: string }>();
  const { data, isLoading } = useGetReportDetail(params.id);

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (!data) {
    return <div>데이터를 불러올 수 없습니다.</div>;
  }
  return <SystemReportMain />;
  // return data.reportType === "SYSTEM" ? (
  //   <SystemReportMain />
  // ) : (
  //   <ClusterReportMain />
  // );
}
