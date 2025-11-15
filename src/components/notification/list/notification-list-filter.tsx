"use client";

import { useAtomValue } from "jotai";

import {
  notificationEndDateAtom,
  notificationPageAtom,
  notificationStartDateAtom,
} from "@/atoms/notification/notification-list.atom";
import { ListRangePicker } from "@/components/common/datepicker/list-range-picker";
import notificationListConstants from "@/constants/notification/notification-list.constant";
import { useGetNotifications } from "@/hooks/notification/use-get-notifications";
import { MySearchFilter } from "@/layouts/common/search-filter";

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
    size: notificationListConstants.pageSize,
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

