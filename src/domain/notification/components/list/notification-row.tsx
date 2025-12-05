"use client";

import classNames from "classnames";
import { useParams, useRouter } from "next/navigation";
import type { HTMLAttributes, MouseEvent } from "react";

import type { NotificationListType } from "@/domain/notification/schemas/notification.schema";
import { ROUTES } from "@/shared/constants/routes.constant";

interface NotificationRowProps extends HTMLAttributes<HTMLTableRowElement> {
  rowData: NotificationListType;
}

/**
 * NotificationRow 컴포넌트
 *
 * 알림 목록 테이블의 행 컴포넌트입니다.
 * 행을 클릭하면 해당 알림의 상세 페이지로 이동합니다.
 * 현재 URL의 id와 일치하는 행은 활성 상태로 표시됩니다.
 *
 * @param rowData - 알림 목록 데이터
 * @returns 알림 테이블 행 컴포넌트
 */
export function NotificationRow({
  children,
  rowData,
  className,
  ...restProps
}: NotificationRowProps) {
  const router = useRouter();
  const { id } = useParams<{ id?: string }>();

  const isActive = id === rowData?.id;

  const handleClickRow = (evt: MouseEvent) => {
    evt.stopPropagation();

    if (rowData) {
      router.push(ROUTES.ADMIN_NOTIFICATION_DETAIL(rowData.id));
    }
  };

  return (
    <tr
      {...restProps}
      className={classNames("pointer", { active: isActive }, className)}
      onClick={handleClickRow}
    >
      {children}
    </tr>
  );
}
