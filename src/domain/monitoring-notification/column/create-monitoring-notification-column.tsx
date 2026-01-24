import type { ResponsiveColumnType } from "xiilab-ui";

import type { MonitoringNotificationSetListResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { MonitoringNotificationDeleteButton } from "@/domain/monitoring-notification/components/monitoring-notification-delete-button";
import { MonitoringNotificationNameButton } from "@/domain/monitoring-notification/components/monitoring-notification-name-button";
import { MonitoringNotificationSettingSwitch } from "@/domain/monitoring-notification/components/monitoring-notification-setting-switch";
import type { MonitoringNotificationSettingSortState } from "@/domain/monitoring-notification/constants/monitoring-notification.constant";
import { getChannelLabel } from "@/domain/monitoring-notification/utils/monitoring-notification.util";
import type { CoreCreateColumnConfig } from "@/shared/types/core.model";
import { applyColumnConfigs } from "@/shared/utils/column.util";
import { formatDateTimeSafely } from "@/shared/utils/date.util";
import { getColumnSortOrder } from "@/shared/utils/sort.util";
import { ColumnAlignCenterWrap } from "@/styles/layers/column-layer.styled";

const createColumnList = (
  sort: MonitoringNotificationSettingSortState,
): ResponsiveColumnType[] => {
  return [
    {
      title: "알림 이름",
      key: "notificationSetName",
      dataIndex: "notificationSetName",
      align: "left",
      width: "40%",
      ellipsis: true,
      sorter: true,
      sortOrder: getColumnSortOrder(sort, "notificationSetName"),
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
      width: "20%",
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
      title: "생성일시",
      key: "createdAt",
      dataIndex: "createdAt",
      align: "left",
      width: "15%",
      sorter: true,
      sortOrder: getColumnSortOrder(sort, "createdAt"),
      render: (createdAt: string) => {
        return <span>{formatDateTimeSafely(createdAt)}</span>;
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
  sort: MonitoringNotificationSettingSortState,
  config?: CoreCreateColumnConfig[],
): ResponsiveColumnType[] => {
  const columnList = createColumnList(sort);

  return applyColumnConfigs(columnList, config);
};
