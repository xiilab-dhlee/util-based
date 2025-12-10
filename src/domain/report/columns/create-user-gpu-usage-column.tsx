import type { ResponsiveColumnType } from "xiilab-ui";

import type { UserGpuUsage } from "@/domain/report/schemas/report.schema";
import { WORKLOAD_JOB_TYPE_LABEL_MAP } from "@/domain/workload/constants/workload.constant";
import { getResourceInfo } from "@/shared/utils/resource.util";

/**
 * 사용자별 GPU 사용 테이블 컬럼 생성
 */
export const createUserGpuUsageColumn = <
  T extends UserGpuUsage & { no: number },
>(): ResponsiveColumnType<T>[] => {
  const gpuInfo = getResourceInfo("GPU");

  return [
    {
      title: "NO.",
      dataIndex: "no",
      width: 60,
      key: "no",
    },
    {
      title: "사용자 이름(이메일)",
      dataIndex: "userName",
      width: 200,
      key: "userName",
      render: (_, record: T) => {
        const name = record.userName?.trim() || "";
        const email = record.userEmail?.trim() || "";

        if (!name && !email) return "-";
        if (!name) return email;
        if (!email) return name;
        return `${name}(${email})`;
      },
    },
    {
      title: `${WORKLOAD_JOB_TYPE_LABEL_MAP.BATCH} 생성 개수`,
      dataIndex: "batchCount",
      width: 120,
      key: "batchCount",
      render: (value: number) => `${value}개`,
    },
    {
      title: `${WORKLOAD_JOB_TYPE_LABEL_MAP.BATCH} 사용 시간`,
      dataIndex: "batchTime",
      width: 120,
      key: "batchTime",
    },
    {
      title: `${WORKLOAD_JOB_TYPE_LABEL_MAP.INTERACTIVE} 생성 개수`,
      dataIndex: "interactiveCount",
      width: 140,
      key: "interactiveCount",
      render: (value: number) => `${value}개`,
    },
    {
      title: `${WORKLOAD_JOB_TYPE_LABEL_MAP.INTERACTIVE} 사용 시간`,
      dataIndex: "interactiveTime",
      width: 140,
      key: "interactiveTime",
    },
    {
      title: `${WORKLOAD_JOB_TYPE_LABEL_MAP.DISTRIBUTED} 생성 개수`,
      dataIndex: "distributedCount",
      width: 140,
      key: "distributedCount",
      render: (value: number) => `${value}개`,
    },
    {
      title: `${WORKLOAD_JOB_TYPE_LABEL_MAP.DISTRIBUTED} 사용 시간`,
      dataIndex: "distributedTime",
      width: 140,
      key: "distributedTime",
    },
    {
      title: `${gpuInfo.text} 할당량`,
      dataIndex: "gpuAllocation",
      width: 120,
      key: "gpuAllocation",
      render: (value: number) => `${value}${gpuInfo.unit}`,
    },
    {
      title: `${gpuInfo.text} 사용률`,
      dataIndex: "gpuUsagePercentage",
      width: 120,
      key: "gpuUsagePercentage",
      render: (value: number) => `${value}%`,
    },
  ];
};
