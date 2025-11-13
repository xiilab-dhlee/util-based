"use client";

import { useAtomValue } from "jotai";

import {
  alertEndDateAtom,
  alertPageAtom,
  alertStartDateAtom,
} from "@/atoms/alert/alert-list.atom";
import { ListRangePicker } from "@/components/common/datepicker/list-range-picker";
import alertListConstants from "@/constants/alert/alert-list.constant";
import { useGetAlerts } from "@/hooks/alert/use-get-alerts";
import { MySearchFilter } from "@/layouts/common/search-filter";

/**
 * 알림 목록 페이지 상단 필터 컴포넌트
 *
 * 알림 목록 페이지에서 날짜 필터와 총 개수를 표시합니다.
 *
 * @returns 알림 목록 페이지 상단 필터 컴포넌트
 */
export function AlertListFilter() {
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
    <MySearchFilter title="알림 목록" total={data?.totalSize}>
      <ListRangePicker
        startDateAtom={alertStartDateAtom}
        endDateAtom={alertEndDateAtom}
      />
    </MySearchFilter>
  );
}

