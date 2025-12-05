"use client";

import { useAtom, useAtomValue } from "jotai";
import { useMemo } from "react";
import { Checkbox } from "xiilab-ui";

import { useGetNotifications } from "@/domain/notification/hooks/use-get-notifications";
import type { NotificationListType } from "@/domain/notification/schemas/notification.schema";
import {
  notificationCheckedListAtom,
  notificationEndDateAtom,
  notificationPageAtom,
  notificationStartDateAtom,
} from "@/domain/notification/state/notification.atom";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { ColumnAlignCenterWrap } from "@/styles/layers/column-layer.styled";

/**
 * 알림 목록 전체 선택 체크박스 컴포넌트
 */
export function NotificationAllCheck() {
  const [checkedList, setCheckedList] = useAtom(notificationCheckedListAtom);
  const page = useAtomValue(notificationPageAtom);
  const startDate = useAtomValue(notificationStartDateAtom);
  const endDate = useAtomValue(notificationEndDateAtom);

  const { data } = useGetNotifications({
    page,
    size: LIST_PAGE_SIZE,
    startDate,
    endDate,
  });

  const currentPageIds: string[] = useMemo(() => {
    return data?.content?.map((v: NotificationListType) => v.id) || [];
  }, [data?.content]);

  const isAllChecked = useMemo(() => {
    if (currentPageIds.length === 0) return false;
    return currentPageIds.every((id) => checkedList.has(id));
  }, [currentPageIds, checkedList]);

  const isIndeterminate = useMemo(() => {
    if (currentPageIds.length === 0) return false;
    const checkedCount = currentPageIds.filter((id) =>
      checkedList.has(id),
    ).length;
    return checkedCount > 0 && checkedCount < currentPageIds.length;
  }, [currentPageIds, checkedList]);

  const handleSelectAll = (checked: boolean) => {
    setCheckedList((prev) => {
      const next = new Set(prev);
      if (checked) {
        currentPageIds.forEach((id) => {
          next.add(id);
        });
      } else {
        currentPageIds.forEach((id) => {
          next.delete(id);
        });
      }
      return next;
    });
  };

  return (
    <ColumnAlignCenterWrap>
      <Checkbox
        size="small"
        checked={isAllChecked}
        indeterminate={isIndeterminate}
        onChange={(e) => handleSelectAll(e.target.checked)}
      />
    </ColumnAlignCenterWrap>
  );
}
