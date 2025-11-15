"use client";

import { useAtomValue } from "jotai";

import {
  notificationEndDateAtom,
  notificationPageAtom,
  notificationStartDateAtom,
} from "@/atoms/notification/notification-list.atom";
import { notificationListColumn } from "@/components/notification/notification-list-column";
import { NotificationRow } from "@/components/notification/list/notification-row";
import { CustomizedTable } from "@/components/common/table/customized-table";
import notificationListConstants from "@/constants/notification/notification-list.constant";
import { useGetNotifications } from "@/hooks/notification/use-get-notifications";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";

/**
 * 알림 목록 페이지 본문 컴포넌트
 *
 * 알림 목록 페이지에서 알림 목록을 표시하는 테이블을 제공합니다.
 * 페이지네이션과 날짜 필터 기능을 지원하며, 알림 데이터를 테이블 형태로 렌더링합니다.
 *
 * @returns 알림 목록 페이지 본문 컴포넌트
 */
export function NotificationListBody() {
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
    <ListWrapper>
      <CustomizedTable
        columns={notificationListColumn}
        data={data?.content || []}
        customRow={NotificationRow}
        activePadding
      />
    </ListWrapper>
  );
}

