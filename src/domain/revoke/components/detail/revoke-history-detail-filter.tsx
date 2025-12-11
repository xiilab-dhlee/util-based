"use client";

import { useAtom, useAtomValue } from "jotai";
import styled from "styled-components";
import { Dropdown } from "xiilab-ui";

import { REVOKE_HISTORY_TYPE_OPTIONS } from "@/domain/revoke/constants/revoke-history.constant";
import { useGetRevokeHistoryDetail } from "@/domain/revoke/hooks/use-get-revoke-history-detail";
import {
  revokeHistoryDetailEndDateAtom,
  revokeHistoryDetailPageAtom,
  revokeHistoryDetailStartDateAtom,
  revokeHistoryDetailTypeAtom,
} from "@/domain/revoke/state/revoke-history.atom";
import type { RevokeHistoryDetailType } from "@/domain/revoke/types/revoke-history.type";
import { ListRangePicker } from "@/shared/components/datepicker/list-range-picker";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";
import { ALL_OPTION, LIST_PAGE_SIZE } from "@/shared/constants/core.constant";

interface RevokeHistoryDetailFilterProps {
  id: string;
}

/**
 * 리소스 회수 이력 상세 필터 컴포넌트
 *
 * 기간 필터와 구분(경고/회수) 필터를 제공합니다.
 */
export function RevokeHistoryDetailFilter({
  id,
}: RevokeHistoryDetailFilterProps) {
  const [typeValue, setTypeValue] = useAtom(revokeHistoryDetailTypeAtom);
  const page = useAtomValue(revokeHistoryDetailPageAtom);
  const startDate = useAtomValue(revokeHistoryDetailStartDateAtom);
  const endDate = useAtomValue(revokeHistoryDetailEndDateAtom);

  const { data } = useGetRevokeHistoryDetail(id, {
    page,
    size: LIST_PAGE_SIZE,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    type: typeValue,
  });

  const total = data?.totalSize ?? 0;

  const typeOptions = [ALL_OPTION, ...REVOKE_HISTORY_TYPE_OPTIONS];

  const handleTypeChange = (value: string | null) => {
    if (value === ALL_OPTION.value || value === null) {
      setTypeValue(undefined);
      return;
    }

    setTypeValue(value as RevokeHistoryDetailType);
  };

  return (
    <MySearchFilter title="경고 및 회수 목록" total={total}>
      <FilterControls>
        <ListRangePicker
          startDateAtom={revokeHistoryDetailStartDateAtom}
          endDateAtom={revokeHistoryDetailEndDateAtom}
        />
        <Dropdown
          options={typeOptions}
          value={typeValue ?? ALL_OPTION.value}
          onChange={handleTypeChange}
          placeholder="구분"
          width={120}
        />
      </FilterControls>
    </MySearchFilter>
  );
}

const FilterControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
