"use client";

import { useAtom } from "jotai";
import { Checkbox } from "xiilab-ui";

import type { NotificationListType } from "@/domain/notification/schemas/notification.schema";
import { notificationCheckedListAtom } from "@/domain/notification/state/notification.atom";
import { ColumnAlignCenterWrap } from "@/styles/layers/column-layer.styled";

interface NotificationItemCheckProps {
  notification: NotificationListType;
}

/**
 * 개별 알림 선택 체크박스 컴포넌트
 */
export function NotificationItemCheck({
  notification,
}: NotificationItemCheckProps) {
  const [checkedList, setCheckedList] = useAtom(notificationCheckedListAtom);

  const isChecked = checkedList.has(notification.id);

  const handleSelect = (checked: boolean) => {
    setCheckedList((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(notification.id);
      } else {
        next.delete(notification.id);
      }
      return next;
    });
  };

  return (
    <ColumnAlignCenterWrap>
      <Checkbox
        size="small"
        checked={isChecked}
        onChange={(e) => handleSelect(e.target.checked)}
      />
    </ColumnAlignCenterWrap>
  );
}
