"use client";

import classNames from "classnames";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import type { HTMLAttributes, MouseEvent } from "react";

import type { AdminNotificationItemResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { useMarkAdminNotificationAsReadAction } from "@/domain/notification/hooks/notification-actions";
import { ROUTES } from "@/shared/constants/routes.constant";
import { getSessionAccountId } from "@/shared/utils/auth.util";

interface NotificationRowProps extends HTMLAttributes<HTMLTableRowElement> {
  rowData: AdminNotificationItemResponse;
}

/**
 * NotificationRow 컴포넌트
 *
 * 알림 목록 테이블의 행 컴포넌트입니다.
 * 행을 클릭하면 해당 알림의 상세 페이지로 이동하고,
 * 읽지 않은 알림인 경우 읽음 처리합니다.
 */
export function NotificationRow({
  children,
  rowData,
  className,
  ...restProps
}: NotificationRowProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const accountId = getSessionAccountId(session) ?? "";

  const { mutate: markAsRead } = useMarkAdminNotificationAsReadAction();

  const handleClickRow = (evt: MouseEvent) => {
    evt.stopPropagation();

    if (rowData) {
      router.push(ROUTES.ADMIN_NOTIFICATION_DETAIL(rowData.notificationId));

      // 읽지 않은 알림인 경우 읽음 처리
      if (!rowData.isRead && accountId) {
        markAsRead({
          accountId,
          notificationId: rowData.notificationId,
        });
      }
    }
  };

  return (
    <tr
      {...restProps}
      className={classNames("pointer", className)}
      onClick={handleClickRow}
    >
      {children}
    </tr>
  );
}
