import type { ResponsiveColumnType } from "xiilab-ui";

import type { MonitoringNotificationSetListResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { MonitoringNotificationDeleteButton } from "@/domain/monitoring-notification/components/monitoring-notification-delete-button";
import { MonitoringNotificationNameButton } from "@/domain/monitoring-notification/components/monitoring-notification-name-button";
import { MonitoringNotificationSettingSwitch } from "@/domain/monitoring-notification/components/monitoring-notification-setting-switch";
import { getChannelLabel } from "@/domain/monitoring-notification/utils/monitoring-notification.util";
import type { CoreCreateColumnConfig } from "@/shared/types/core.model";
import { applyColumnConfigs } from "@/shared/utils/column.util";
import { ColumnAlignCenterWrap } from "@/styles/layers/column-layer.styled";

const createColumnList = (): ResponsiveColumnType[] => {
  return [
    {
      title: "알림 이름",
      key: "notificationSetName",
      dataIndex: "notificationSetName",
      align: "left",
      width: "40%",
      ellipsis: true,
      render: (name: string, record: MonitoringNotificationSetListResponse) => {
        return (
          <MonitoringNotificationNameButton
            id={String(record.notificationSetId)}
            name={name}
          />
        );
      },
    },
    {
      title: "채널",
      key: "channel",
      align: "left",
      width: "25%",
      render: (_: unknown, record: MonitoringNotificationSetListResponse) => {
        return (
          <span>
            {getChannelLabel(
              record.isSystemNotificationEnabled,
              record.isEmailNotificationEnabled,
            )}
          </span>
        );
      },
    },
    {
      title: "알림 설정",
      key: "isEnabled",
      dataIndex: "isEnabled",
      align: "center",
      width: "25%",
      render: (
        isEnabled: boolean,
        record: MonitoringNotificationSetListResponse,
      ) => {
        return (
          <MonitoringNotificationSettingSwitch
            notificationSetId={record.notificationSetId}
            isEnabled={isEnabled}
          />
        );
      },
    },
    {
      title: "삭제",
      key: "delete",
      align: "center",
      width: "10%",
      render: (_: unknown, record: MonitoringNotificationSetListResponse) => {
        return (
          <ColumnAlignCenterWrap>
            <MonitoringNotificationDeleteButton
              notificationSetId={record.notificationSetId}
            />
          </ColumnAlignCenterWrap>
        );
      },
    },
  ];
};

export const createMonitoringNotificationColumn = (
  config?: CoreCreateColumnConfig[],
): ResponsiveColumnType[] => {
  const columnList = createColumnList();

  return applyColumnConfigs(columnList, config);
};
