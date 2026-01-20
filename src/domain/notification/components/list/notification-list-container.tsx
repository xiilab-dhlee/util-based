"use client";

import { useAtom, useAtomValue } from "jotai";
import { useResetAtom } from "jotai/utils";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";

import { useGetAdminNotifications } from "@/api/generated/admin-account-notification/admin-account-notification";
import { NotificationListBody } from "@/domain/notification/components/list/notification-list-body";
import { NotificationListFilter } from "@/domain/notification/components/list/notification-list-filter";
import { NotificationListFooter } from "@/domain/notification/components/list/notification-list-footer";
import {
  notificationHasReadAtom,
  notificationPageAtom,
  notificationSortOrderAtom,
  notificationTypeAtom,
} from "@/domain/notification/state/notification.atom";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import type { AntdTableSortOrder } from "@/shared/types/core.model";
import { getSessionAccountId } from "@/shared/utils/auth.util";
import { toSortDirection } from "@/shared/utils/sort.util";

/**
 * 알림 목록 컨테이너 컴포넌트
 *
 * 알림 목록 페이지에서 필터, 본문, 페이지네이션을 관리하는 컨테이너입니다.
 * 데이터 조회를 수행하고 하위 컴포넌트에 데이터를 전달합니다.
 */
export function NotificationListContainer() {
  const { id } = useParams<{ id?: string }>();
  const { data: session } = useSession();
  const accountId = getSessionAccountId(session) ?? "";

  const page = useAtomValue(notificationPageAtom);
  const resetPage = useResetAtom(notificationPageAtom);
  const type = useAtomValue(notificationTypeAtom);
  const hasRead = useAtomValue(notificationHasReadAtom);
  const [sortOrder, setSortOrder] = useAtom(notificationSortOrderAtom);

  const {
    data: notificationData,
    isLoading,
    isError,
  } = useGetAdminNotifications(
    accountId,
    {
      pageNo: page - 1,
      pageSize: LIST_PAGE_SIZE,
      hasRead,
      notificationType: type?.length ? type : undefined,
      order: toSortDirection(sortOrder),
      // TODO: API 날짜 파라미터 지원 시 활성화 (toUtcIsoString 사용)
    },
    {
      query: {
        enabled: Boolean(accountId),
      },
    },
  );

  const handleSortChange = (order: AntdTableSortOrder) => {
    setSortOrder(order);
    resetPage();
  };

  return (
    <>
      {/* 알림 목록 필터 */}
      <NotificationListFilter total={notificationData?.totalSize} />
      {/* 알림 목록 본문 */}
      <NotificationListBody
        data={notificationData?.content || []}
        isLoading={isLoading}
        isError={isError}
        activeRowKey={id}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
      />
      {/* 알림 목록 페이지네이션 */}
      <NotificationListFooter
        total={notificationData?.totalSize || 0}
        isLoading={isLoading}
      />
    </>
  );
}
