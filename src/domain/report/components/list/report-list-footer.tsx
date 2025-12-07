"use client";

import { useAtom, useAtomValue } from "jotai";
import { useResetAtom } from "jotai/utils";

import type { ReportListType } from "@/domain/report/schemas/report.schema";
import {
  reportCheckedListAtom,
  reportPageAtom,
} from "@/domain/report/state/report.atom";
import { ListDeleteButton } from "@/shared/components/button/list-delete-button";
import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { REPORT_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import type { CoreListResponse } from "@/shared/types/core.model";

interface ReportListFooterProps {
  data?: CoreListResponse<ReportListType>;
  isLoading: boolean;
}

/**
 * 리포트 목록 페이지 하단 컴포넌트
 *
 * 리포트 목록 페이지에서 페이지네이션과 삭제 버튼을 제공합니다.
 *
 * @returns 리포트 목록 페이지 하단 컴포넌트
 */
export function ReportListFooter({ data, isLoading }: ReportListFooterProps) {
  const [page, setPage] = useAtom(reportPageAtom);
  const selectedReports = useAtomValue(reportCheckedListAtom);
  const resetCheckedList = useResetAtom(reportCheckedListAtom);
  const publish = usePublish();

  const handlePage = (page: number) => {
    resetCheckedList();
    setPage(page);
  };

  const handleClickDelete = () => {
    const reportIds = Array.from(selectedReports);
    publish(REPORT_EVENTS.sendDeleteReport, reportIds);
  };

  return (
    <ListPageFooter
      total={data?.totalSize || 0}
      page={page}
      pageSize={LIST_PAGE_SIZE}
      onChange={handlePage}
      isLoading={isLoading}
      rightChildren={
        <ListDeleteButton
          onClick={handleClickDelete}
          disabled={selectedReports.size === 0}
          isLoading={isLoading}
        />
      }
    />
  );
}
