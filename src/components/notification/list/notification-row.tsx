"use client";

import classNames from "classnames";
import { useAtom } from "jotai";
import type { HTMLAttributes, MouseEvent } from "react";

import { notificationSelectedAtom } from "@/atoms/notification.atom";
import type { NotificationListType } from "@/schemas/notification.schema";

interface NotificationRowProps extends HTMLAttributes<HTMLTableRowElement> {
  rowData: NotificationListType;
}

/**
 * NotificationRow 컴포넌트
 *
 * 알림 목록 테이블의 행 컴포넌트입니다.
 * 행을 클릭하면 해당 알림을 선택 상태로 변경하고 상세 정보를 표시합니다.
 * 현재 선택된 알림과 일치하는 행은 활성 상태로 표시됩니다.
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
  const [selectedNotification, setSelectedNotification] = useAtom(
    notificationSelectedAtom,
  );

  const isActive = selectedNotification === rowData?.id;

  const handleClickRow = (evt: MouseEvent) => {
    evt.stopPropagation();

    if (rowData) {
      setSelectedNotification(rowData.id);
    }
  };

  return (
    <tr
      {...restProps}
      className={classNames({ active: isActive }, className)}
      onClick={handleClickRow}
    >
      {children}
    </tr>
  );
}
