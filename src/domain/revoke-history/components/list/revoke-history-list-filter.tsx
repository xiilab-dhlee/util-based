"use client";

import { useAtomValue } from "jotai";

import { useGetRevokeHistories } from "@/domain/revoke-history/hooks/use-get-revoke-histories";
import {
  revokeHistoryEndDateAtom,
  revokeHistoryPageAtom,
  revokeHistoryStartDateAtom,
} from "@/domain/revoke-history/state/revoke-history.atom";
import { ListRangePicker } from "@/shared/components/datepicker/list-range-picker";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";

/**
 * 리소스 회수 이력 목록 필터 컴포넌트
 *
 * 기간 필터와 총 개수를 표시합니다.
 */
export function RevokeHistoryListFilter() {
  const page = useAtomValue(revokeHistoryPageAtom);
  const startDate = useAtomValue(revokeHistoryStartDateAtom);
  const endDate = useAtomValue(revokeHistoryEndDateAtom);

  const { data } = useGetRevokeHistories({
    page,
    size: LIST_PAGE_SIZE,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });

  return (
    <MySearchFilter
      title="리소스 회수 대상 검사 실행 이력"
      total={data?.totalSize}
    >
      <ListRangePicker
        startDateAtom={revokeHistoryStartDateAtom}
        endDateAtom={revokeHistoryEndDateAtom}
      />
    </MySearchFilter>
  );
}
