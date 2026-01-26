"use client";

import type { TableProps } from "xiilab-ui";

import type { AdminNotificationItemResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { createNotificationListColumn } from "@/domain/notification/components/create-notification-list-column";
import { NotificationRow } from "@/domain/notification/components/list/notification-row";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import {
  NOTIFICATION_SORT_FIELDS,
  type NotificationSortField,
} from "@/shared/constants/notification";
import type { AntdTableSortOrder } from "@/shared/types/core.model";
import { parseSorterToAntdState } from "@/shared/utils/sort.util";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";

interface NotificationListBodyProps {
  /** 알림 목록 데이터 */
  data: AdminNotificationItemResponse[];
  /** 로딩 상태 */
  isLoading: boolean;
  /** 에러 상태 */
  isError: boolean;
  /** 활성화된 행의 키 값 */
  activeRowKey?: string | number;
  /** 정렬 순서 */
  sortOrder: AntdTableSortOrder;
  /** 정렬 변경 핸들러 */
  onSortChange: (order: AntdTableSortOrder) => void;
}

/**
 * 알림 목록 페이지 본문 컴포넌트
 *
 * 알림 목록 페이지에서 알림 목록을 표시하는 테이블을 제공합니다.
 * 알림 데이터를 테이블 형태로 렌더링합니다.
 *
 * @param data - 알림 목록 데이터
 * @param isLoading - 로딩 상태
 * @param isError - 에러 상태
 * @returns 알림 목록 페이지 본문 컴포넌트
 */
export function NotificationListBody({
  data,
  isLoading,
  isError,
  activeRowKey,
  sortOrder,
  onSortChange,
}: NotificationListBodyProps) {
  const handleChange: TableProps<AdminNotificationItemResponse>["onChange"] = (
    _,
    __,
    sorter,
  ) => {
    const parsed = parseSorterToAntdState<
      AdminNotificationItemResponse,
      NotificationSortField
    >(sorter, NOTIFICATION_SORT_FIELDS);
    if (!parsed.order) return;

    onSortChange(parsed.order);
  };

  return (
    <ListWrapper>
      <CustomizedTable<AdminNotificationItemResponse>
        columns={createNotificationListColumn(sortOrder)}
        data={data}
        rowKey="notificationId"
        activeRowKey={activeRowKey}
        customRow={NotificationRow}
        activePadding
        columnHeight={32}
        loading={isLoading}
        isError={isError}
        onChange={handleChange}
      />
    </ListWrapper>
  );
}
