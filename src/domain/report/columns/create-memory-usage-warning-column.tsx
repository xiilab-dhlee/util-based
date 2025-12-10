import type { ResponsiveColumnType } from "xiilab-ui";

import type { MemoryUsageWarning } from "@/domain/report/schemas/report.schema";

/**
 * Memory 사용률 경고 테이블 컬럼 생성
 */
export const createMemoryUsageWarningColumn = <
  T extends MemoryUsageWarning & { no: number },
>(): ResponsiveColumnType<T>[] => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}.${month}.${day} ${hours}:${minutes}`;
  };

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
      title: "GPU Index",
      dataIndex: "gpuIndex",
      key: "gpuIndex",
      width: 100,
    },
    {
      title: "날짜",
      dataIndex: "date",
      key: "date",
      width: 160,
      render: (value: string) => formatDate(value),
    },
    {
      title: "Memory(%) 평균",
      dataIndex: "avgUsage",
      key: "avgUsage",
      width: 130,
      render: (value: number) => `${value}%`,
    },
    {
      title: "Memory(%) 최대",
      dataIndex: "maxUsage",
      key: "maxUsage",
      width: 130,
      render: (value: number) => `${value}%`,
    },
  ];
};
