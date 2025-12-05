"use client";

import { useAtomValue } from "jotai";
import styled from "styled-components";
import { Dropdown } from "xiilab-ui";

import type { NotificationTypeValue } from "@/domain/notification/constants/notification.constant";
import { NOTIFICATION_TYPE_OPTIONS } from "@/domain/notification/constants/notification.constant";
import { useGetNotifications } from "@/domain/notification/hooks/use-get-notifications";
import {
  notificationEndDateAtom,
  notificationPageAtom,
  notificationStartDateAtom,
} from "@/domain/notification/state/notification.atom";
import { ListRangePicker } from "@/shared/components/datepicker/list-range-picker";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";
import { ALL_OPTION, LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { useSelect } from "@/shared/hooks/use-select";

/**
 * 알림 목록 페이지 상단 필터 컴포넌트
 *
 * 알림 목록 페이지에서 날짜 필터, 알림 유형 필터, 총 개수를 표시합니다.
 *
 * @returns 알림 목록 페이지 상단 필터 컴포넌트
 */
export function NotificationListFilter() {
  const page = useAtomValue(notificationPageAtom);
  const startDate = useAtomValue(notificationStartDateAtom);
  const endDate = useAtomValue(notificationEndDateAtom);

  const typeOptions = [ALL_OPTION, ...NOTIFICATION_TYPE_OPTIONS];
  const typeSelect = useSelect(null, typeOptions);

  const type =
    typeSelect.value === null || typeSelect.value === "ALL"
      ? undefined
      : (typeSelect.value as NotificationTypeValue);

  const { data } = useGetNotifications({
    page,
    size: LIST_PAGE_SIZE,
    startDate,
    endDate,
    type,
  });

  return (
    <MySearchFilter title="알림 내역" total={data?.totalSize}>
      <FilterControls>
        <Dropdown
          options={typeSelect.options}
          value={typeSelect.value}
          onChange={typeSelect.onChange}
          placeholder="알림 유형"
          width={200}
        />
        <ListRangePicker
          startDateAtom={notificationStartDateAtom}
          endDateAtom={notificationEndDateAtom}
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
