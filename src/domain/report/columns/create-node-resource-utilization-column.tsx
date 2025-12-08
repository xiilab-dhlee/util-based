import type { ResponsiveColumnType } from "xiilab-ui";

import type { NodeResourceUtilization } from "@/domain/report/schemas/report.schema";
import { getResourceInfo } from "@/shared/utils/resource.util";

/**
 * 노드 리소스 활용 테이블 컬럼 생성
 */
export const createNodeResourceUtilizationColumn = <
  T extends NodeResourceUtilization & { no: number },
>(): ResponsiveColumnType<T>[] => {
  const gpuInfo = getResourceInfo("GPU");
  const cpuInfo = getResourceInfo("CPU");
  const memInfo = getResourceInfo("MEM");

  const formatMaxValue = (value: number, timestamp: string, unit: string) => {
    const date = new Date(timestamp);
    const formatted = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
    return `${value}${unit} (${formatted})`;
  };

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
      title: `${gpuInfo.text} 개수`,
      dataIndex: "gpuCount",
      key: "gpuCount",
      width: 100,
      render: (value: number) => `${value}${gpuInfo.unit}`,
    },
    {
      title: `${cpuInfo.text} 코어`,
      dataIndex: "cpuCount",
      key: "cpuCount",
      width: 100,
      render: (value: number) => `${value}${cpuInfo.unit}`,
    },
    {
      title: `${memInfo.text} 정보`,
      dataIndex: "memory",
      key: "memory",
      width: 120,
      render: (value: number) => `${value}${memInfo.unit}`,
    },
    {
      title: `${gpuInfo.text} 평균(%)`,
      dataIndex: "gpuAverage",
      key: "gpuAverage",
      width: 120,
      render: (value: number) => `${value}`,
    },
    {
      title: `${gpuInfo.text} 최대(%)`,
      dataIndex: "gpuMax",
      key: "gpuMax",
      width: 200,
      render: (_value: number, record: T) =>
        formatMaxValue(record.gpuMax, record.gpuMaxTimestamp, ""),
    },
    {
      title: `${cpuInfo.text} 평균(%)`,
      dataIndex: "cpuAverage",
      key: "cpuAverage",
      width: 120,
      render: (value: number) => `${value}`,
    },
    {
      title: `${cpuInfo.text} 최대(%)`,
      dataIndex: "cpuMax",
      key: "cpuMax",
      width: 200,
      render: (_value: number, record: T) =>
        formatMaxValue(record.cpuMax, record.cpuMaxTimestamp, ""),
    },
    {
      title: `${memInfo.text} 평균(%)`,
      dataIndex: "memoryAverage",
      key: "memoryAverage",
      width: 120,
      render: (value: number) => `${value}`,
    },
    {
      title: `${memInfo.text} 최대(%)`,
      dataIndex: "memoryMax",
      key: "memoryMax",
      width: 200,
      render: (_value: number, record: T) =>
        formatMaxValue(record.memoryMax, record.memoryMaxTimestamp, ""),
    },
  ];
};
