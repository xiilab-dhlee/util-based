import type { ResponsiveColumnType } from "xiilab-ui";

import { MonitoringNotificationNameButton } from "@/components/monitoring-notification/monitoring-notification-name-button";
import { MonitoringNotificationSettingSwitch } from "@/components/monitoring-notification/monitoring-notification-setting-switch";
import coreConstants from "@/constants/common/core.constant";
import type { MonitoringNotificationListType } from "@/schemas/monitoring-notification.schema";
import {
  ColumnAlignCenterWrap,
  ColumnIconWrap,
} from "@/styles/layers/column-layer.styled";
import type { CoreCreateColumnConfig } from "@/types/common/core.model";
import { applyColumnConfigs } from "@/utils/common/column.util";
import MyIcon from "../icon";

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
        return <MonitoringNotificationNameButton id={record.id} name={name} />;
      },
    },
    {
      title: "채널",
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
      width: coreConstants.iconColumnWidth,
      render: () => {
        return (
          <ColumnAlignCenterWrap>
            <ColumnIconWrap onClick={() => alert("준비 중입니다.")}>
              <MyIcon name="Delete" color="var(--icon-fill)" size={16} />
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
