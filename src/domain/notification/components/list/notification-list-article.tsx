"use client";

import { useAtom, useAtomValue } from "jotai";
import { useResetAtom } from "jotai/utils";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

import { useGetAdminNotifications } from "@/api/generated/admin-account-notification/admin-account-notification";
import { NotificationListBody } from "@/domain/notification/components/list/notification-list-body";
import { NotificationListFilter } from "@/domain/notification/components/list/notification-list-filter";
import { NotificationListFooter } from "@/domain/notification/components/list/notification-list-footer";
import {
  notificationDateRangeAtom,
  notificationHasReadAtom,
  notificationPageAtom,
  notificationSortOrderAtom,
  notificationTypeAtom,
} from "@/domain/notification/state/notification.atom";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import type { AntdTableSortOrder } from "@/shared/types/core.model";
import { getSessionAccountId } from "@/shared/utils/auth.util";
import { formatDateForRequest } from "@/shared/utils/date.util";
import { toSortDirection } from "@/shared/utils/sort.util";

/**
 * 알림 목록 아티클 컴포넌트
 *
 * 알림 목록 페이지에서 필터, 본문, 페이지네이션을 관리합니다.
 */
export function NotificationListArticle() {
  const { id } = useParams<{ id?: string }>();
  const { data: session } = useSession();
  const accountId = getSessionAccountId(session) ?? "";

  const page = useAtomValue(notificationPageAtom);
  const resetPage = useResetAtom(notificationPageAtom);
  const resetDateRange = useResetAtom(notificationDateRangeAtom);
  const type = useAtomValue(notificationTypeAtom);
  const hasRead = useAtomValue(notificationHasReadAtom);
  const dateRange = useAtomValue(notificationDateRangeAtom);
  const [sortOrder, setSortOrder] = useAtom(notificationSortOrderAtom);

  // biome-ignore lint/correctness/useExhaustiveDependencies: 초기화 시 의존성 배열 비워둠
  useEffect(() => {
    resetPage();
    resetDateRange();
  }, []);

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
      startDate: dateRange?.start
        ? formatDateForRequest(dateRange.start)
        : undefined,
      endDate: dateRange?.end ? formatDateForRequest(dateRange.end) : undefined,
      order: toSortDirection(sortOrder),
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
      <NotificationListFilter total={notificationData?.totalSize} />
      <NotificationListBody
        data={notificationData?.content || []}
        isLoading={isLoading}
        isError={isError}
        activeRowKey={id}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
      />
      <NotificationListFooter
        total={notificationData?.totalSize || 0}
        isLoading={isLoading}
      />
    </>
  );
}
