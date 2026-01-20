import type { ResponsiveColumnType } from "xiilab-ui";

import type { MonitoringNotificationHistoryListResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { MonitoringNotificationHistoryNameButton } from "@/domain/monitoring-notification/components/monitoring-notification-history-name-button";
import type { MonitoringNotificationHistorySortState } from "@/domain/monitoring-notification/constants/monitoring-notification.constant";
import { getChannelLabel } from "@/domain/monitoring-notification/utils/monitoring-notification.util";
import type { CoreCreateColumnConfig } from "@/shared/types/core.model";
import { applyColumnConfigs } from "@/shared/utils/column.util";
import { formatDateTimeSafely } from "@/shared/utils/date.util";
import { getColumnSortOrder } from "@/shared/utils/sort.util";

/**
 * 컬럼 정의 배열 생성
 */
const createColumnList = (
  sort: MonitoringNotificationHistorySortState,
): ResponsiveColumnType[] => {
  return [
    {
      title: "알림 이름",
      key: "notificationSetName",
      dataIndex: "notificationSetName",
      align: "left",
      sorter: true,
      sortOrder: getColumnSortOrder(sort, "notificationSetName"),
      render: (
        name: string,
        record: MonitoringNotificationHistoryListResponse,
      ) => {
        if (!record.monitoringNotificationHistoryId) {
          return <span>{name}</span>;
        }
        return (
          <MonitoringNotificationHistoryNameButton
            id={String(record.monitoringNotificationHistoryId)}
            name={name}
          />
        );
      },
    },
    {
      title: "노드 이름",
      key: "nodeName",
      dataIndex: "nodeName",
      align: "left",
      sorter: true,
      sortOrder: getColumnSortOrder(sort, "nodeName"),
    },
    {
      title: "IP 주소",
      key: "nodeIp",
      dataIndex: "nodeIp",
      align: "left",
      sorter: true,
      sortOrder: getColumnSortOrder(sort, "nodeIp"),
    },

    {
      title: "채널",
      key: "channel",
      align: "left",
      render: (
        _: unknown,
        record: MonitoringNotificationHistoryListResponse,
      ) => {
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
      title: "발생일시",
      key: "createdAt",
      dataIndex: "createdAt",
      align: "left",
      width: 180,
      sorter: true,
      sortOrder: getColumnSortOrder(sort, "createdAt"),
      render: (createdAt: string) => {
        return <span>{formatDateTimeSafely(createdAt)}</span>;
      },
    },
  ];
};

export const createMonitoringNotificationHistoryColumn = (
  sort: MonitoringNotificationHistorySortState,
  config?: CoreCreateColumnConfig[],
): ResponsiveColumnType[] => {
  const columnList = createColumnList(sort);

  return applyColumnConfigs(columnList, config);
};
