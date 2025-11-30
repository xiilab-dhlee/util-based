import type { ResponsiveColumnType } from "xiilab-ui";
import { Icon } from "xiilab-ui";

import { MonitoringNotificationNameButton } from "@/domain/monitoring-notification/components/monitoring-notification-name-button";
import { MonitoringNotificationSettingSwitch } from "@/domain/monitoring-notification/components/monitoring-notification-setting-switch";
import type { MonitoringNotificationListResponseType } from "@/domain/monitoring-notification/schemas/monitoring-notification.schema";
import { ICON_COLUMN_WIDTH } from "@/shared/constants/core.constant";
import type { CoreCreateColumnConfig } from "@/shared/types/core.model";
import { applyColumnConfigs } from "@/shared/utils/column.util";
import {
  ColumnAlignCenterWrap,
  ColumnIconWrap,
} from "@/styles/layers/column-layer.styled";

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
      render: (
        name: string,
        record: MonitoringNotificationListResponseType,
      ) => {
        return <MonitoringNotificationNameButton id={record.id} name={name} />;
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
      title: "알림 설정",
      dataIndex: "status",
      align: "center",
      render: () => {
        return <MonitoringNotificationSettingSwitch />;
      },
    },
    {
      title: "삭제",
      dataIndex: "delete",
      align: "center",
      width: ICON_COLUMN_WIDTH,
      render: () => {
        return (
          <ColumnAlignCenterWrap>
            <ColumnIconWrap onClick={() => alert("준비 중입니다.")}>
              <Icon name="Delete" color="var(--icon-fill)" size={16} />
            </ColumnIconWrap>
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
