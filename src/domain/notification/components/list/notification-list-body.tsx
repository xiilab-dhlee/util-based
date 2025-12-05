"use client";

import { useAtom, useAtomValue } from "jotai";

import { notificationListColumn } from "@/domain/notification/components/create-notification-list-column";
import { NotificationRow } from "@/domain/notification/components/list/notification-row";
import { useGetNotifications } from "@/domain/notification/hooks/use-get-notifications";
import type { NotificationListType } from "@/domain/notification/schemas/notification.schema";
import {
  notificationCheckedListAtom,
  notificationEndDateAtom,
  notificationPageAtom,
  notificationStartDateAtom,
  notificationTypeAtom,
} from "@/domain/notification/state/notification.atom";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { useTableSelection } from "@/shared/hooks/use-table-selection";
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
  const type = useAtomValue(notificationTypeAtom);
  const { data, isLoading, isError } = useGetNotifications({
    page,
    size: LIST_PAGE_SIZE,
    startDate,
    endDate,
    type,
  });

  const [checkedList, setCheckedList] = useAtom(notificationCheckedListAtom);
  const { rowSelection } = useTableSelection<NotificationListType>(
    checkedList,
    setCheckedList,
  );

  return (
    <ListWrapper>
      <CustomizedTable<NotificationListType>
        columns={notificationListColumn}
        data={data?.content || []}
        rowKey="id"
        rowSelection={rowSelection}
        customRow={NotificationRow}
        activePadding
        columnHeight={32}
        loading={isLoading}
        isError={isError}
      />
    </ListWrapper>
  );
}
