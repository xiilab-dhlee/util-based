import type { ResponsiveColumnType } from "xiilab-ui";

import type { ClusterNodeListResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { NodeGpuDivisionButton } from "@/domain/node/components/list/node-gpu-division-button";
import { NodeListIp } from "@/domain/node/components/list/node-list-ip";
import { NodeLogButton } from "@/domain/node/components/list/node-log-button";
import { NodeMigButton } from "@/domain/node/components/list/node-mig-button";
import { NodeScheduleSwitch } from "@/domain/node/components/list/node-schedule-switch";
import { NodeStatusText } from "@/shared/components/text/node-status-text";
import { formatElapsedTime } from "@/shared/utils/date.util";
import {
  ColumnAlignCenterWrap,
  ColumnAlignLeftWrap,
  ColumnLink,
} from "@/styles/layers/column-layer.styled";

export const nodeListColumn: ResponsiveColumnType[] = [
  {
    title: "NO.",
    dataIndex: "index",
    align: "center",
    width: 40,
    render: (_: unknown, __: unknown, index: number) => {
      return <span>{index + 1}</span>;
    },
  },
  {
    title: "노드 이름",
    dataIndex: "nodeName",
    align: "left",
    render: (nodeName: string, record: ClusterNodeListResponse) => {
      // isScheduling이 true이면 노드가 정상 동작 중
      const status = record.isScheduling ?? true;
      return (
        <ColumnLink href={`/admin/node/${nodeName}`}>
          <NodeStatusText status={status} text={nodeName} />
        </ColumnLink>
      );
    },
  },
  {
    title: "IP 주소",
    dataIndex: "nodeIp",
    align: "left",
    width: 140,
    render: (nodeIp: string, record: ClusterNodeListResponse) => {
      // MIG 활성화 여부에 따라 타입 결정
      let type = "NONE";
      if (record.isMigEnabled) {
        type = "MIG";
      }
      // TODO: MPS 상태 확인 로직 추가 필요
      return (
        <ColumnAlignLeftWrap>
          <NodeListIp ip={nodeIp} type={type} />
        </ColumnAlignLeftWrap>
      );
    },
  },
  {
    title: "GPU 타입",
    dataIndex: "gpuType",
    align: "left",
    width: 120,
    render: (gpuType: string | undefined) => {
      return <span>{gpuType || "-"}</span>;
    },
  },
  {
    title: "GPU",
    dataIndex: "gpuCount",
    align: "center",
    width: 50,
  },
  {
    title: "GPU 사용량",
    dataIndex: "gpuUtilizationPercent",
    align: "center",
    width: 70,
    render: (gpuUtilizationPercent: number | undefined) => {
      return (
        <ColumnAlignCenterWrap>
          {gpuUtilizationPercent != null ? `${gpuUtilizationPercent}%` : "-"}
        </ColumnAlignCenterWrap>
      );
    },
  },
  {
    title: "CPU",
    dataIndex: "cpuUtilizationPercent",
    align: "center",
    width: 50,
    render: (cpuUtilizationPercent: number | undefined) => {
      return (
        <ColumnAlignCenterWrap>
          {cpuUtilizationPercent != null ? `${cpuUtilizationPercent}%` : "-"}
        </ColumnAlignCenterWrap>
      );
    },
  },
  {
    title: "Memory",
    dataIndex: "memoryUtilizationPercent",
    align: "center",
    width: 50,
    render: (memoryUtilizationPercent: number | undefined) => {
      return (
        <ColumnAlignCenterWrap>
          {memoryUtilizationPercent != null
            ? `${memoryUtilizationPercent}%`
            : "-"}
        </ColumnAlignCenterWrap>
      );
    },
  },
  {
    title: "Disk",
    dataIndex: "diskUtilizationPercent",
    align: "center",
    width: 50,
    render: (diskUtilizationPercent: number | undefined) => {
      return (
        <ColumnAlignCenterWrap>
          {diskUtilizationPercent != null ? `${diskUtilizationPercent}%` : "-"}
        </ColumnAlignCenterWrap>
      );
    },
  },
  {
    title: "경과 시간",
    dataIndex: "createdAt",
    align: "center",
    width: 120,
    render: (createdAt: string | undefined) => {
      if (!createdAt) {
        return <span>-</span>;
      }
      return <span>{formatElapsedTime(createdAt)}</span>;
    },
  },
  {
    title: "스케줄링",
    dataIndex: "isScheduling",
    align: "center",
    width: 80,
    render: (isScheduling: boolean, record: ClusterNodeListResponse) => {
      return (
        <ColumnAlignCenterWrap>
          <NodeScheduleSwitch
            nodeName={record.nodeName}
            schedulable={isScheduling}
          />
        </ColumnAlignCenterWrap>
      );
    },
  },
  {
    title: "GPU 분할",
    dataIndex: "nodeName",
    align: "center",
    width: 70,
    render: (nodeName: string, record: ClusterNodeListResponse) => {
      let component = null;
      // MIG 활성화 상태에 따라 버튼 표시
      if (record.isMigEnabled) {
        component = <NodeMigButton nodeName={nodeName} />;
      } else {
        // GPU가 있는 경우에만 분할 버튼 표시
        if (record.gpuCount > 0) {
          component = <NodeGpuDivisionButton nodeName={nodeName} />;
        } else {
          component = <span>-</span>;
        }
      }
      // TODO: MPS 상태 확인 로직 추가 필요
      return <ColumnAlignCenterWrap>{component}</ColumnAlignCenterWrap>;
    },
  },
  {
    title: "Activity",
    dataIndex: "nodeName",
    align: "center",
    width: 70,
    render: (nodeName: string) => {
      return (
        <ColumnAlignCenterWrap>
          <NodeLogButton nodeName={nodeName} />
        </ColumnAlignCenterWrap>
      );
    },
  },
];
