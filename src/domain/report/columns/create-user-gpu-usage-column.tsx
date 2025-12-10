import type { ResponsiveColumnType } from "xiilab-ui";

import type { UserGpuUsage } from "@/domain/report/schemas/report.schema";
import { WORKLOAD_JOB_TYPE_LABEL_MAP } from "@/shared/constants/workload.constant";
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
      key: "no",
      width: 60,
    },
    {
      title: "사용자 이름(이메일)",
      dataIndex: "userName",
      key: "userName",
      width: 200,
      render: (_, record: T) => `${record.userName}(${record.userEmail})`,
    },
    {
      title: `${WORKLOAD_JOB_TYPE_LABEL_MAP.BATCH} 생성 개수`,
      dataIndex: "batchCount",
      key: "batchCount",
      width: 120,
      render: (value: number) => `${value}개`,
    },
    {
      title: `${WORKLOAD_JOB_TYPE_LABEL_MAP.BATCH} 사용 시간`,
      dataIndex: "batchTime",
      key: "batchTime",
      width: 120,
    },
    {
      title: `${WORKLOAD_JOB_TYPE_LABEL_MAP.INTERACTIVE} 생성 개수`,
      dataIndex: "interactiveCount",
      key: "interactiveCount",
      width: 140,
      render: (value: number) => `${value}개`,
    },
    {
      title: `${WORKLOAD_JOB_TYPE_LABEL_MAP.INTERACTIVE} 사용 시간`,
      dataIndex: "interactiveTime",
      key: "interactiveTime",
      width: 140,
    },
    {
      title: `${WORKLOAD_JOB_TYPE_LABEL_MAP.DISTRIBUTED} 생성 개수`,
      dataIndex: "distributedCount",
      key: "distributedCount",
      width: 140,
      render: (value: number) => `${value}개`,
    },
    {
      title: `${WORKLOAD_JOB_TYPE_LABEL_MAP.DISTRIBUTED} 사용 시간`,
      dataIndex: "distributedTime",
      key: "distributedTime",
      width: 140,
    },
    {
      title: `${gpuInfo.text} 할당량`,
      dataIndex: "gpuAllocation",
      key: "gpuAllocation",
      width: 120,
      render: (value: number) => `${value}${gpuInfo.unit}`,
    },
    {
      title: `${gpuInfo.text} 사용률`,
      dataIndex: "gpuUsagePercentage",
      key: "gpuUsagePercentage",
      width: 120,
      render: (value: number) => `${value}%`,
    },
  ];
};
