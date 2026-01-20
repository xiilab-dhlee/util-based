import { type ResponsiveColumnType, Tooltip } from "xiilab-ui";

import type { MonitoringNotificationSendHistoryResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  getNotificationChannelLabel,
  getSendStatusLabel,
} from "@/domain/monitoring-notification/utils/monitoring-notification.util";
import type { CoreCreateColumnConfig } from "@/shared/types/core.model";
import { applyColumnConfigs } from "@/shared/utils/column.util";
import { formatDateTimeSafely } from "@/shared/utils/date.util";
import { ColumnTruncateText } from "@/styles/layers/column-layer.styled";

/**
 * 임계 조건 상세 테이블 데이터 타입
 */
export interface ThresholdDetailRow {
  key: string;
  item: string;
  setting: string;
  observed: string;
}

/**
 * 알림 내역 조회 모달 - 임계 조건 테이블 컬럼
 */
const createThresholdDetailColumnList =
  (): ResponsiveColumnType<ThresholdDetailRow>[] => [
    {
      title: "항목",
      key: "item",
      dataIndex: "item",
      align: "left",
    },
    {
      title: "설정 값",
      key: "setting",
      dataIndex: "setting",
      align: "left",
    },
    {
      title: "측정 값",
      key: "observed",
      dataIndex: "observed",
      align: "left",
    },
  ];

export const createThresholdDetailColumns = (
  config?: CoreCreateColumnConfig[],
): ResponsiveColumnType<ThresholdDetailRow>[] => {
  const columnList = createThresholdDetailColumnList();
  return applyColumnConfigs(columnList, config);
};

/**
 * 알림 내역 조회 모달 - 발송 이력 테이블 컬럼
 */
const createSendHistoryColumnList =
  (): ResponsiveColumnType<MonitoringNotificationSendHistoryResponse>[] => [
    {
      title: "사용자명",
      key: "userName",
      align: "left",
      width: "35%",
      render: (_, record) => (
        <Tooltip title={record.sentRecipient.creatorName}>
          <ColumnTruncateText width="100%">
            {record.sentRecipient.creatorName}
          </ColumnTruncateText>
        </Tooltip>
      ),
    },
    {
      title: "채널",
      key: "channel",
      dataIndex: "notificationChannel",
      align: "left",
      width: "15%",
      render: (
        value: MonitoringNotificationSendHistoryResponse["notificationChannel"],
      ) => getNotificationChannelLabel(value),
    },
    {
      title: "결과",
      key: "result",
      align: "left",
      width: "15%",
      render: (_, record) =>
        getSendStatusLabel(record.sentRecipient.sendStatus),
    },
    {
      title: "발송일시",
      key: "sentAt",
      dataIndex: "createdAt",
      align: "left",
      width: "35%",
      render: (value: string) => formatDateTimeSafely(value),
    },
  ];

export const createSendHistoryColumns = (
  config?: CoreCreateColumnConfig[],
): ResponsiveColumnType<MonitoringNotificationSendHistoryResponse>[] => {
  const columnList = createSendHistoryColumnList();
  return applyColumnConfigs(columnList, config);
};
