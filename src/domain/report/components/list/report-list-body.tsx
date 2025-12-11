"use client";

import { useAtom } from "jotai";
import { useRouter } from "next/navigation";

import type { ReportListType } from "@/domain/report/schemas/report.schema";
import { reportCheckedListAtom } from "@/domain/report/state/report.atom";
import { createReportColumn } from "@/shared/components/column/create-report-column";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { useTableSelection } from "@/shared/hooks/use-table-selection";
import type { CoreListResponse } from "@/shared/types/core.model";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";

interface ReportListBodyProps {
  data?: CoreListResponse<ReportListType>;
  isLoading: boolean;
  isError: boolean;
}

/**
 * 리포트 목록 페이지 본문 컴포넌트
 *
 * 리포트 목록 페이지에서 리포트 목록을 표시하는 테이블을 제공합니다.
 *
 * @returns 리포트 목록 페이지 본문 컴포넌트
 */
export function ReportListBody({
  data,
  isLoading,
  isError,
}: ReportListBodyProps) {
  const router = useRouter();
  const [checkedList, setCheckedList] = useAtom(reportCheckedListAtom);
  const { rowSelection } = useTableSelection<ReportListType>(
    checkedList,
    setCheckedList,
  );

  return (
    <ListWrapper data-error-state={isError}>
      <CustomizedTable<ReportListType>
        columns={createReportColumn(router)}
        data={data?.content || []}
        rowKey="id"
        rowSelection={rowSelection}
        columnHeight={38}
        loading={isLoading}
        isError={isError}
      />
    </ListWrapper>
  );
}
