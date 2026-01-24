"use client";

import { useSetAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import type { TableProps } from "xiilab-ui";

import type { MonitoringNotificationSetListResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { createMonitoringNotificationColumn } from "@/domain/monitoring-notification/column/create-monitoring-notification-column";
import {
  MONITORING_NOTIFICATION_SETTING_SORT_FIELDS,
  type MonitoringNotificationSettingSortField,
  type MonitoringNotificationSettingSortState,
} from "@/domain/monitoring-notification/constants/monitoring-notification.constant";
import {
  monitoringNotificationSettingPageAtom,
  monitoringNotificationSettingSortAtom,
} from "@/domain/monitoring-notification/state/monitoring-notification.atom";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { parseSorterToAntdState } from "@/shared/utils/sort.util";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";

interface MonitoringNotificationSettingListBodyProps {
  content: MonitoringNotificationSetListResponse[];
  loading: boolean;
  isError: boolean;
  sort: MonitoringNotificationSettingSortState;
}

export function MonitoringNotificationSettingListBody({
  content,
  loading,
  isError,
  sort,
}: MonitoringNotificationSettingListBodyProps) {
  const resetPage = useResetAtom(monitoringNotificationSettingPageAtom);
  const setSort = useSetAtom(monitoringNotificationSettingSortAtom);

  const handleTableChange: TableProps<MonitoringNotificationSetListResponse>["onChange"] =
    (_, __, sorter) => {
      const parsed = parseSorterToAntdState<
        MonitoringNotificationSetListResponse,
        MonitoringNotificationSettingSortField
      >(sorter, MONITORING_NOTIFICATION_SETTING_SORT_FIELDS);

      if (!parsed.field || !parsed.order) return;

      setSort({
        field: parsed.field,
        order: parsed.order,
      });
      resetPage();
    };

  return (
    <ListWrapper>
      <CustomizedTable
        columns={createMonitoringNotificationColumn(sort, [
          {
            key: "notificationSetName",
          },
          {
            key: "channel",
          },
          {
            key: "isEnabled",
          },
          {
            key: "delete",
          },
        ])}
        data={content}
        loading={loading}
        isError={isError}
        activePadding
        onChange={handleTableChange}
        rowKey="notificationSetId"
      />
    </ListWrapper>
  );
}
