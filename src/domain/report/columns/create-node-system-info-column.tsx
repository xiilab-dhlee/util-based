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
      width: 60,
      key: "no",
    },
    {
      title: "노드명",
      dataIndex: "nodeName",
      width: 120,
      key: "nodeName",
    },
    {
      title: "IP 주소",
      dataIndex: "ipAddress",
      width: 140,
      key: "ipAddress",
    },
    {
      title: "OS 정보",
      dataIndex: "osInfo",
      width: 150,
      key: "osInfo",
    },
    {
      title: "GPU 정보",
      dataIndex: "gpuInfo",
      width: 150,
      key: "gpuInfo",
    },
    {
      title: `${gpuInfo.text} 개수`,
      dataIndex: "gpuCount",
      width: 100,
      key: "gpuCount",
      render: (value: number) => `${value}${gpuInfo.unit}`,
    },
    {
      title: "CPU 정보",
      dataIndex: "cpuInfo",
      width: 200,
      key: "cpuInfo",
    },
    {
      title: cpuInfo.text,
      dataIndex: "cpu",
      width: 100,
      key: "cpu",
      render: (value: number) => `${value}${cpuInfo.unit}`,
    },
    {
      title: memInfo.text,
      dataIndex: "memory",
      width: 100,
      key: "memory",
      render: (value: number) => `${value}${memInfo.unit}`,
    },
    {
      title: diskInfo.text,
      dataIndex: "disk",
      width: 100,
      key: "disk",
      render: (value: number) => `${value}${diskInfo.unit}`,
    },
  ];
};
