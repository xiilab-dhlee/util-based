"use client";

import { useAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import type { TableProps } from "xiilab-ui";

import type { MonitoringNotificationHistoryListResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { createMonitoringNotificationHistoryColumn } from "@/domain/monitoring-notification/column/create-monitoring-notification-history-column";
import {
  MONITORING_NOTIFICATION_HISTORY_SORT_FIELDS,
  type MonitoringNotificationHistorySortField,
} from "@/domain/monitoring-notification/constants/monitoring-notification.constant";
import {
  monitoringNotificationHistorySortAtom,
  monitoringNotificationPageAtom,
} from "@/domain/monitoring-notification/state/monitoring-notification.atom";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { parseSorterToAntdState } from "@/shared/utils/sort.util";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";

interface MonitoringNotificationHistoryListBodyProps {
  content: MonitoringNotificationHistoryListResponse[];
  loading: boolean;
  isError: boolean;
}

export function MonitoringNotificationHistoryListBody({
  content,
  loading,
  isError,
}: MonitoringNotificationHistoryListBodyProps) {
  const resetPage = useResetAtom(monitoringNotificationPageAtom);
  const [sort, setSortAtom] = useAtom(monitoringNotificationHistorySortAtom);

  const handleTableChange: TableProps<MonitoringNotificationHistoryListResponse>["onChange"] =
    (_, __, sorter) => {
      const parsed = parseSorterToAntdState<
        MonitoringNotificationHistoryListResponse,
        MonitoringNotificationHistorySortField
      >(sorter, MONITORING_NOTIFICATION_HISTORY_SORT_FIELDS);

      if (!parsed.field || !parsed.order) return;

      setSortAtom({
        field: parsed.field,
        order: parsed.order,
      });
      resetPage();
    };

  return (
    <ListWrapper>
      <CustomizedTable
        columns={createMonitoringNotificationHistoryColumn(sort)}
        data={content}
        loading={loading}
        isError={isError}
        activePadding
        onChange={handleTableChange}
        rowKey="monitoringNotificationHistoryId"
      />
    </ListWrapper>
  );
}
