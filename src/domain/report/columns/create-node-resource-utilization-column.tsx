import type { ResponsiveColumnType } from "xiilab-ui";

import type { NodeResourceUtilization } from "@/domain/report/schemas/report.schema";
import { formatDateSafely } from "@/shared/utils/date.util";
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
    const formatted = formatDateSafely(timestamp, "yyyy.MM.dd HH:mm");
    return `${value}${unit} (${formatted})`;
  };

  return [
    {
      title: "NO.",
      dataIndex: "no",
      width: 60,
      key: "no",
    },
    {
      title: "노드 이름",
      dataIndex: "nodeName",
      width: 120,
      key: "nodeName",
    },
    {
      title: `${gpuInfo.text} 개수`,
      dataIndex: "gpuCount",
      width: 100,
      key: "gpuCount",
      render: (value: number) => `${value}${gpuInfo.unit}`,
    },
    {
      title: `${cpuInfo.text} 코어`,
      dataIndex: "cpuCount",
      width: 100,
      key: "cpuCount",
      render: (value: number) => `${value}${cpuInfo.unit}`,
    },
    {
      title: `${memInfo.text} 정보`,
      dataIndex: "memory",
      width: 120,
      key: "memory",
      render: (value: number) => `${value}${memInfo.unit}`,
    },
    {
      title: `${gpuInfo.text} 평균(%)`,
      dataIndex: "gpuAverage",
      width: 120,
      key: "gpuAverage",
      render: (value: number) => `${value}`,
    },
    {
      title: `${gpuInfo.text} 최대(%)`,
      dataIndex: "gpuMax",
      width: 200,
      key: "gpuMax",
      render: (_value: number, record: T) =>
        formatMaxValue(record.gpuMax, record.gpuMaxTimestamp, ""),
    },
    {
      title: `${cpuInfo.text} 평균(%)`,
      dataIndex: "cpuAverage",
      width: 120,
      key: "cpuAverage",
      render: (value: number) => `${value}`,
    },
    {
      title: `${cpuInfo.text} 최대(%)`,
      dataIndex: "cpuMax",
      width: 200,
      key: "cpuMax",
      render: (_value: number, record: T) =>
        formatMaxValue(record.cpuMax, record.cpuMaxTimestamp, ""),
    },
    {
      title: `${memInfo.text} 평균(%)`,
      dataIndex: "memoryAverage",
      width: 120,
      key: "memoryAverage",
      render: (value: number) => `${value}`,
    },
    {
      title: `${memInfo.text} 최대(%)`,
      dataIndex: "memoryMax",
      width: 200,
      key: "memoryMax",
      render: (_value: number, record: T) =>
        formatMaxValue(record.memoryMax, record.memoryMaxTimestamp, ""),
    },
  ];
};
