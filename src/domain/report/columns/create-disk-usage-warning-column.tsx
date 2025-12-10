import type { ResponsiveColumnType } from "xiilab-ui";

import type { DiskUsageWarning } from "@/domain/report/schemas/report.schema";
import { formatDateSafely } from "@/shared/utils/date.util";

/**
 * Disk 사용률 경고 테이블 컬럼 생성
 */
export const createDiskUsageWarningColumn = <
  T extends DiskUsageWarning & { no: number },
>(): ResponsiveColumnType<T>[] => {
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
      render: (value: string) => formatDateSafely(value, "yyyy.MM.dd HH:mm"),
    },
    {
      title: "Disk(%) 평균",
      dataIndex: "avgUsage",
      key: "avgUsage",
      width: 130,
      render: (value: number) => `${value}%`,
    },
    {
      title: "Disk(%) 최대",
      dataIndex: "maxUsage",
      key: "maxUsage",
      width: 130,
      render: (value: number) => `${value}%`,
    },
  ];
};
