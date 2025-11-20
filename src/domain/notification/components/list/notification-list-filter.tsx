"use client";

import { useAtomValue } from "jotai";

import { useGetNotifications } from "@/domain/notification/hooks/use-get-notifications";
import {
  notificationEndDateAtom,
  notificationPageAtom,
  notificationStartDateAtom,
} from "@/domain/notification/state/notification.atom";
import { ListRangePicker } from "@/shared/components/datepicker/list-range-picker";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { MySearchFilter } from "@/shared/layouts/common/search-filter";

/**
 * 알림 목록 페이지 상단 필터 컴포넌트
 *
 * 알림 목록 페이지에서 날짜 필터와 총 개수를 표시합니다.
 *
 * @returns 알림 목록 페이지 상단 필터 컴포넌트
 */
export function NotificationListFilter() {
  const page = useAtomValue(notificationPageAtom);
  const startDate = useAtomValue(notificationStartDateAtom);
  const endDate = useAtomValue(notificationEndDateAtom);

  const { data } = useGetNotifications({
    page,
    size: LIST_PAGE_SIZE,
    startDate,
    endDate,
  });

  return (
    <MySearchFilter title="알림 목록" total={data?.totalSize}>
      <ListRangePicker
        startDateAtom={notificationStartDateAtom}
        endDateAtom={notificationEndDateAtom}
      />
    </MySearchFilter>
  );
}
