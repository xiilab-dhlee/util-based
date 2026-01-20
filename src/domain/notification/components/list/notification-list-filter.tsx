"use client";

import { useAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import styled from "styled-components";
import { Dropdown } from "xiilab-ui";

import {
  type GetAdminNotificationsNotificationTypeItem,
  GetAdminNotificationsNotificationTypeItem as NotificationTypeEnum,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  NOTIFICATION_HAS_READ_OPTIONS,
  NOTIFICATION_TYPE_OPTIONS,
} from "@/domain/notification/constants/notification.constant";
import {
  notificationEndDateAtom,
  notificationHasReadAtom,
  notificationPageAtom,
  notificationStartDateAtom,
  notificationTypeAtom,
} from "@/domain/notification/state/notification.atom";
import { ListRangePicker } from "@/shared/components/datepicker/list-range-picker";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";
import { ALL_OPTION } from "@/shared/constants/core.constant";
import { useSelect } from "@/shared/hooks/use-select";

function isNotificationType(
  value: string | null,
): value is GetAdminNotificationsNotificationTypeItem {
  return (
    value !== null &&
    Object.values(NotificationTypeEnum).some((type) => type === value)
  );
}

interface NotificationListFilterProps {
  /** 알림 총 개수 */
  total?: number;
}

/**
 * 알림 목록 페이지 상단 필터 컴포넌트
 *
 * 알림 목록 페이지에서 날짜 필터, 알림 유형 필터, 읽음 상태 필터, 총 개수를 표시합니다.
 *
 * @param total - 알림 총 개수
 * @returns 알림 목록 페이지 상단 필터 컴포넌트
 */
export function NotificationListFilter({ total }: NotificationListFilterProps) {
  const [startDate, setStartDate] = useAtom(notificationStartDateAtom);
  const [endDate, setEndDate] = useAtom(notificationEndDateAtom);
  const [, setType] = useAtom(notificationTypeAtom);
  const [, setHasRead] = useAtom(notificationHasReadAtom);
  const resetPage = useResetAtom(notificationPageAtom);

  const typeOptions = [ALL_OPTION, ...NOTIFICATION_TYPE_OPTIONS];
  const typeSelect = useSelect<string>(null, typeOptions);

  const hasReadOptions = [ALL_OPTION, ...NOTIFICATION_HAS_READ_OPTIONS];
  const hasReadSelect = useSelect<string>(null, hasReadOptions);

  /**
   * 알림 유형 변경 핸들러
   * 알림 유형 변경 시 페이지를 초기화
   */
  const handleChangeType = (newValue: string | null) => {
    resetPage();
    typeSelect.onChange(newValue);

    if (!isNotificationType(newValue)) {
      setType(undefined);
      return;
    }

    setType([newValue]);
  };

  /**
   * 읽음 상태 변경 핸들러
   * 읽음 상태 변경 시 페이지를 초기화
   */
  const handleChangeHasRead = (newValue: string | null) => {
    resetPage();
    hasReadSelect.onChange(newValue);

    if (!newValue) {
      setHasRead(undefined);
      return;
    }

    setHasRead(newValue === "true");
  };

  /**
   * 날짜 범위 변경 핸들러
   * 날짜 변경 시 페이지를 초기화
   */
  const handleDateChange = (start: string, end: string) => {
    resetPage();
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <MySearchFilter title="알림 내역" total={total}>
      <FilterControls>
        <Dropdown
          options={typeSelect.options}
          value={typeSelect.value}
          onChange={handleChangeType}
          placeholder="알림 유형"
          width={200}
        />
        <Dropdown
          options={hasReadSelect.options}
          value={hasReadSelect.value}
          onChange={handleChangeHasRead}
          placeholder="읽음 상태"
          width={140}
        />
        <ListRangePicker
          startDate={startDate}
          endDate={endDate}
          onChange={handleDateChange}
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
