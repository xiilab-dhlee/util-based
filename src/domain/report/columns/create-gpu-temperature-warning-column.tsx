import type { ResponsiveColumnType } from "xiilab-ui";

import type { GpuTemperatureWarning } from "@/domain/report/schemas/report.schema";
import { formatDateSafely } from "@/shared/utils/date.util";

/**
 * GPU 온도 경고 테이블 컬럼 생성
 */
export const createGpuTemperatureWarningColumn = <
  T extends GpuTemperatureWarning & { no: number },
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
      title: "GPU 평균 온도",
      dataIndex: "avgTemperature",
      key: "avgTemperature",
      width: 130,
      render: (value: number) => `${value}°C`,
    },
    {
      title: "GPU 최대 온도",
      dataIndex: "maxTemperature",
      key: "maxTemperature",
      width: 130,
      render: (value: number) => `${value}°C`,
    },
  ];
};
