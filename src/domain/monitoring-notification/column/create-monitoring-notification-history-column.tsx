import type { ResponsiveColumnType } from "xiilab-ui";

import { MonitoringNotificationHistoryNameButton } from "@/domain/monitoring-notification/components/monitoring-notification-history-name-button";
import {
  MONITORING_NOTIFICATION_DURATION_UNIT,
  MONITORING_NOTIFICATION_OPERATOR_LABEL_MAP,
  MONITORING_NOTIFICATION_THRESHOLD_UNIT,
  MONITORING_NOTIFICATION_TYPE_LABEL_MAP,
} from "@/domain/monitoring-notification/constants/monitoring-notification.constant";
import type {
  MonitoringNotificationListType,
  MonitoringNotificationSettingType,
} from "@/domain/monitoring-notification/schemas/monitoring-notification.schema";
import type { CoreCreateColumnConfig } from "@/shared/types/core.model";
import { applyColumnConfigs } from "@/shared/utils/column.util";
import { formatDateTimeSafely } from "@/shared/utils/date.util";

/**
 * 컬럼 정의 배열 생성 (dataIndex 한 번만 정의)
 */
const createColumnList = (): ResponsiveColumnType[] => {
  return [
    {
      title: "노드 이름",
      dataIndex: "nodeName",
      align: "left",
    },
    {
      title: "IP 주소",
      dataIndex: "ip",
      align: "left",
    },
    {
      title: "알림 이름",
      dataIndex: "name",
      align: "left",
      render: (name: string, record: MonitoringNotificationListType) => {
        return (
          <MonitoringNotificationHistoryNameButton id={record.id} name={name} />
        );
      },
    },
    {
      title: "알림 유형",
      dataIndex: "channel",
      align: "left",
      render: () => {
        return <span>E-mail, System</span>;
      },
    },
    {
      title: "발생일시",
      dataIndex: "createdDate",
      align: "left",
      width: 180,
      render: (creatorDateTime: Date) => {
        return <span>{formatDateTimeSafely(creatorDateTime)}</span>;
      },
    },
    {
      title: "결과",
      dataIndex: "result",
      align: "center",
    },
    {
      title: "발송일시",
      dataIndex: "sentAt",
      align: "left",
      render: (sentAt: Date) => {
        return <span>{formatDateTimeSafely(sentAt)}</span>;
      },
    },
    {
      title: "항목",
      dataIndex: "item",
      align: "center",
      render: (item: string) => {
        const label =
          MONITORING_NOTIFICATION_TYPE_LABEL_MAP[
            item as keyof typeof MONITORING_NOTIFICATION_TYPE_LABEL_MAP
          ];

        return label ?? item;
      },
    },
    {
      title: "설정",
      dataIndex: "setting",
      align: "center",
      render: (_: unknown, record: MonitoringNotificationSettingType) => {
        const operatorLabel =
          MONITORING_NOTIFICATION_OPERATOR_LABEL_MAP[
            record.operator as keyof typeof MONITORING_NOTIFICATION_OPERATOR_LABEL_MAP
          ] ?? record.operator;

        return `${operatorLabel} ${record.threshold} ${MONITORING_NOTIFICATION_THRESHOLD_UNIT}`;
      },
    },
    {
      title: "감지한 값",
      dataIndex: "duration",
      align: "center",
      render: (duration: string) =>
        `${duration}${MONITORING_NOTIFICATION_DURATION_UNIT}`,
    },
    {
      title: "이름",
      dataIndex: "userName",
      align: "left",
    },
  ];
};

export const createMonitoringNotificationHistoryColumn = (
  config?: CoreCreateColumnConfig[],
): ResponsiveColumnType[] => {
  const columnList = createColumnList();

  return applyColumnConfigs(columnList, config);
};
