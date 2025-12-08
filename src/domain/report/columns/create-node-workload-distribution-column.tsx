import type { ResponsiveColumnType } from "xiilab-ui";

import type { NodeWorkloadDistribution } from "@/domain/report/schemas/report.schema";
import { getResourceInfo } from "@/shared/utils/resource.util";

/**
 * 노드 워크로드 분배 테이블 컬럼 생성
 */
export const createNodeWorkloadDistributionColumn = <
  T extends NodeWorkloadDistribution & { no: number },
>(): ResponsiveColumnType<T>[] => {
  const gpuInfo = getResourceInfo("GPU");
  const cpuInfo = getResourceInfo("CPU");
  const memInfo = getResourceInfo("MEM");
  const diskInfo = getResourceInfo("DISK");

  return [
    {
      title: "NO.",
      dataIndex: "no",
      key: "no",
      width: 60,
    },
    {
      title: "노드 이름",
      dataIndex: "nodeName",
      key: "nodeName",
      width: 120,
    },
    {
      title: "워크로드 개수",
      dataIndex: "totalWorkloads",
      key: "totalWorkloads",
      width: 100,
      render: (value: number) => `${value}개`,
    },
    {
      title: "실행중 개수",
      dataIndex: "runningCount",
      key: "runningCount",
      width: 100,
      render: (value: number) => `${value}개`,
    },
    {
      title: "대기중 개수",
      dataIndex: "pendingCount",
      key: "pendingCount",
      width: 100,
      render: (value: number) => `${value}개`,
    },
    {
      title: "에러 개수",
      dataIndex: "failedCount",
      key: "failedCount",
      width: 100,
      render: (value: number) => `${value}개`,
    },
    {
      title: "종료 개수",
      dataIndex: "completedCount",
      key: "completedCount",
      width: 100,
      render: (value: number) => `${value}개`,
    },
    {
      title: `${gpuInfo.text} 총 할당량`,
      dataIndex: "gpuAllocation",
      key: "gpuAllocation",
      width: 120,
      render: (value: number) => `${value}${gpuInfo.unit}`,
    },
    {
      title: `${cpuInfo.text} 총 할당량`,
      dataIndex: "cpuAllocation",
      key: "cpuAllocation",
      width: 120,
      render: (value: number) => `${value}${cpuInfo.unit}`,
    },
    {
      title: `${memInfo.text} 총 할당량`,
      dataIndex: "memoryAllocation",
      key: "memoryAllocation",
      width: 140,
      render: (value: number) => `${value}${memInfo.unit}`,
    },
    {
      title: `${diskInfo.text} 총 할당량`,
      dataIndex: "diskAllocation",
      key: "diskAllocation",
      width: 120,
      render: (value: number) => `${value}${diskInfo.unit}`,
    },
  ];
};
