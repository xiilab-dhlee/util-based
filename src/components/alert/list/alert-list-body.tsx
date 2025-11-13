"use client";

import { useAtomValue } from "jotai";

import {
  alertEndDateAtom,
  alertPageAtom,
  alertStartDateAtom,
} from "@/atoms/alert/alert-list.atom";
import { alertListColumn } from "@/components/alert/alert-list-column";
import { AlertRow } from "@/components/alert/list/alert-row";
import { CustomizedTable } from "@/components/common/table/customized-table";
import alertListConstants from "@/constants/alert/alert-list.constant";
import { useGetAlerts } from "@/hooks/alert/use-get-alerts";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";

/**
 * 알림 목록 페이지 본문 컴포넌트
 *
 * 알림 목록 페이지에서 알림 목록을 표시하는 테이블을 제공합니다.
 * 페이지네이션과 날짜 필터 기능을 지원하며, 알림 데이터를 테이블 형태로 렌더링합니다.
 *
 * @returns 알림 목록 페이지 본문 컴포넌트
 */
export function AlertListBody() {
  const page = useAtomValue(alertPageAtom);
  const startDate = useAtomValue(alertStartDateAtom);
  const endDate = useAtomValue(alertEndDateAtom);

  const { data } = useGetAlerts({
    page,
    size: alertListConstants.pageSize,
    startDate,
    endDate,
  });

  return (
    <ListWrapper>
      <CustomizedTable
        columns={alertListColumn}
        data={data?.content || []}
        customRow={AlertRow}
        activePadding
      />
    </ListWrapper>
  );
}
