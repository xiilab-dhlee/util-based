"use client";

import type { MonitoringNotificationSetListResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { createMonitoringNotificationColumn } from "@/domain/monitoring-notification/column/create-monitoring-notification-column";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";

interface MonitoringNotificationSettingListBodyProps {
  content: MonitoringNotificationSetListResponse[];
  loading: boolean;
  isError: boolean;
}

export function MonitoringNotificationSettingListBody({
  content,
  loading,
  isError,
}: MonitoringNotificationSettingListBodyProps) {
  return (
    <ListWrapper>
      <CustomizedTable
        columns={createMonitoringNotificationColumn([
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
        rowKey="notificationSetId"
      />
    </ListWrapper>
  );
}
