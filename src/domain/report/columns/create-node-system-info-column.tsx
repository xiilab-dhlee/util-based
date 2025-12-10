import type { ResponsiveColumnType } from "xiilab-ui";

import type { NodeSystemInfo } from "@/domain/report/schemas/report.schema";
import { getResourceInfo } from "@/shared/utils/resource.util";

/**
 * 노드 시스템 정보 테이블 컬럼 생성
 */
export const createNodeSystemInfoColumn = <
  T extends NodeSystemInfo & { no: number },
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
      title: "노드명",
      dataIndex: "nodeName",
      key: "nodeName",
      width: 120,
    },
    {
      title: "IP 주소",
      dataIndex: "ipAddress",
      key: "ipAddress",
      width: 140,
    },
    {
      title: "OS 정보",
      dataIndex: "osInfo",
      key: "osInfo",
      width: 150,
    },
    {
      title: "GPU 정보",
      dataIndex: "gpuInfo",
      key: "gpuInfo",
      width: 150,
    },
    {
      title: `${gpuInfo.text} 개수`,
      dataIndex: "gpuCount",
      key: "gpuCount",
      width: 100,
      render: (value: number) => `${value}${gpuInfo.unit}`,
    },
    {
      title: "CPU 정보",
      dataIndex: "cpuInfo",
      key: "cpuInfo",
      width: 200,
    },
    {
      title: cpuInfo.text,
      dataIndex: "cpu",
      key: "cpu",
      width: 100,
      render: (value: number) => `${value}${cpuInfo.unit}`,
    },
    {
      title: memInfo.text,
      dataIndex: "memory",
      key: "memory",
      width: 100,
      render: (value: number) => `${value}${memInfo.unit}`,
    },
    {
      title: diskInfo.text,
      dataIndex: "disk",
      key: "disk",
      width: 100,
      render: (value: number) => `${value}${diskInfo.unit}`,
    },
  ];
};
