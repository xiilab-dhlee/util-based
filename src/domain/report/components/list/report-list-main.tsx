"use client";

import { useAtomValue } from "jotai";

import { ReportListBody } from "@/domain/report/components/list/report-list-body";
import { ReportListFilter } from "@/domain/report/components/list/report-list-filter";
import { ReportListFooter } from "@/domain/report/components/list/report-list-footer";
import { DeleteReportModal } from "@/domain/report/components/modals/delete-report-modal";
import { useGetReports } from "@/domain/report/hooks/use-get-reports";
import {
  reportDateTypeAtom,
  reportPageAtom,
  reportTypeAtom,
} from "@/domain/report/state/report.atom";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";

/**
 * 리포트 목록 페이지의 메인 컴포넌트
 */
export function ReportListMain() {
  const page = useAtomValue(reportPageAtom);
  const reportDateType = useAtomValue(reportDateTypeAtom);
  const reportType = useAtomValue(reportTypeAtom);

  const { data, isLoading, isError } = useGetReports({
    page,
    size: LIST_PAGE_SIZE,
    reportDateType,
    reportType,
  });

  return (
    <>
      {/* 리포트 목록 필터 */}
      <ReportListFilter data={data} />
      {/* 리포트 목록 본문 */}
      <ReportListBody data={data} isLoading={isLoading} isError={isError} />
      {/* 리포트 목록 페이지네이션 */}
      {!isLoading && <ReportListFooter data={data} isLoading={isLoading} />}
      {/* 삭제 모달 */}
      <DeleteReportModal />
    </>
  );
}
