import type { ResponsiveColumnType } from "xiilab-ui";

import { NodeGpuDivisionButton } from "@/components/node/list/node-gpu-division-button";
import { NodeListIp } from "@/components/node/list/node-list-ip";
import { NodeLogButton } from "@/components/node/list/node-log-button";
import { NodeMigButton } from "@/components/node/list/node-mig-button";
import { NodeMpsButton } from "@/components/node/list/node-mps-button";
import { NodeScheduleSwitch } from "@/components/node/list/node-schedule-switch";
import type { NodeListType } from "@/schemas/node.schema";
import { formatElapsedTime } from "@/utils/common/date.util";
import {
  ColumnAlignCenterWrap,
  ColumnAlignLeftWrap,
  ColumnLink,
} from "../../../styles/layers/column-layer.styled";
import NodeStatusText from "../text/node-status-text";

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
    render: (nodeName: string, record: NodeListType) => {
      return (
        <ColumnLink href={`/admin/node/${nodeName}`}>
          <NodeStatusText status={record.status} text={nodeName} />
        </ColumnLink>
      );
    },
  },
  {
    title: "IP 주소",
    dataIndex: "ip",
    align: "left",
    width: 140,
    render: (ip: string, _, index: number) => {
      let type = "NONE";
      if (index % 3 === 0) {
        type = "MPS";
      } else if (index % 4 === 0) {
        type = "MIG";
      }
      return (
        <ColumnAlignLeftWrap>
          <NodeListIp ip={ip} type={type} />
        </ColumnAlignLeftWrap>
      );
    },
  },
  {
    title: "GPU 타입",
    dataIndex: "modelName",
    align: "left",
    width: 120,
  },
  {
    title: "GPU",
    dataIndex: "gpuCount",
    align: "center",
    width: 50,
  },
  {
    title: "GPU 사용량",
    dataIndex: "gpuPercent",
    align: "center",
    width: 70,
    render: (gpuPercent: number) => {
      return <ColumnAlignCenterWrap>{gpuPercent}%</ColumnAlignCenterWrap>;
    },
  },
  {
    title: "CPU",
    dataIndex: "cpuPercent",
    align: "center",
    width: 50,
    render: (cpuPercent: number) => {
      return <ColumnAlignCenterWrap>{cpuPercent}%</ColumnAlignCenterWrap>;
    },
  },
  {
    title: "Memory",
    dataIndex: "memPercent",
    align: "center",
    width: 50,
    render: (memPercent: number) => {
      return <ColumnAlignCenterWrap>{memPercent}%</ColumnAlignCenterWrap>;
    },
  },
  {
    title: "Disk",
    dataIndex: "diskPercent",
    align: "center",
    width: 50,
    render: (diskPercent: number) => {
      return <ColumnAlignCenterWrap>{diskPercent}%</ColumnAlignCenterWrap>;
    },
  },
  {
    title: "경과 시간",
    dataIndex: "age",
    align: "center",
    width: 120,
    render: (age: any) => {
      // age.days, age.hour, age.minutes를 현재 날짜에서 빼서 과거 날짜 계산
      const now = new Date();
      const pastDate = new Date(now);

      // 일, 시간, 분을 빼서 과거 날짜 계산
      pastDate.setDate(pastDate.getDate() - age.days);
      pastDate.setHours(pastDate.getHours() - age.hour);
      pastDate.setMinutes(pastDate.getMinutes() - age.minutes);

      // ISO 8601 형식으로 변환
      const isoDateStr = pastDate.toISOString();

      return <span>{formatElapsedTime(isoDateStr)}</span>;
    },
  },
  {
    title: "스케줄링",
    dataIndex: "schedulable",
    align: "center",
    width: 80,
    render: (schedulable: boolean, record: NodeListType) => {
      return (
        <ColumnAlignCenterWrap>
          <NodeScheduleSwitch
            nodeName={record.nodeName}
            schedulable={schedulable}
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
    render: (nodeName: string, _, index: number) => {
      let component = null;
      if (index === 0) {
        component = <NodeMpsButton nodeName={nodeName} />;
      } else if (index === 1) {
        component = <NodeMigButton nodeName={nodeName} />;
      } else {
        component = <NodeGpuDivisionButton nodeName={nodeName} />;
      }
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

