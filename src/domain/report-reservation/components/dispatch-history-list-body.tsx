"use client";

import { useRouter } from "next/navigation";

import type { DispatchHistoryType } from "@/domain/report-reservation/schemas/report-reservation.schema";
import { createDispatchHistoryColumn } from "@/shared/components/column/create-dispatch-history-column";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { ROUTES } from "@/shared/constants/routes.constant";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";

interface DispatchHistoryListBodyProps {
  data: DispatchHistoryType[];
  isLoading: boolean;
}

/**
 * 발송 내역 목록 페이지 본문 컴포넌트
 *
 * 발송 내역 목록 페이지에서 발송 내역 목록을 표시하는 테이블을 제공합니다.
 *
 * @param data - 발송 내역 데이터 배열
 * @param isLoading - 로딩 상태
 * @returns 발송 내역 목록 페이지 본문 컴포넌트
 */
export function DispatchHistoryListBody({
  data,
  isLoading,
}: DispatchHistoryListBodyProps) {
  const router = useRouter();

  /** 리포트 이름 클릭 시 상세 페이지로 이동 */
  const handleReportNameClick = (id: string) => {
    router.push(ROUTES.ADMIN_REPORT_RESERVATION_DISPATCH_DETAIL(id));
  };

  return (
    <ListWrapper>
      <CustomizedTable
        columns={createDispatchHistoryColumn({
          onReportNameClick: handleReportNameClick,
        })}
        data={data}
        columnHeight={40}
        activePadding
        loading={isLoading}
      />
    </ListWrapper>
  );
}
