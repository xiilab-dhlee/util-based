import { isNil } from "es-toolkit";
import type { ResponsiveColumnType } from "xiilab-ui";

import type { AdminWorkloadResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { AddToUrgentQueueButton } from "@/domain/scheduling-queue/components/list/add-to-urgent-queue-button";
import type { PendingWorkloadSortState } from "@/domain/scheduling-queue/constants/scheduling-queue.constant";
import type { CoreCreateColumnConfig } from "@/shared/types/core.model";
import { applyColumnConfigs } from "@/shared/utils/column.util";
import { formatElapsedTime } from "@/shared/utils/date.util";
import { formatNumberWithUnit } from "@/shared/utils/format.util";
import { convertBytes } from "@/shared/utils/resource.util";
import { getColumnSortOrder } from "@/shared/utils/sort.util";
import { ColumnAlignCenterWrap } from "@/styles/layers/column-layer.styled";

interface CreatePendingWorkloadColumnOptions {
  onAddToUrgentQueue: (workload: AdminWorkloadResponse) => void;
  isAddingToQueue?: boolean;
  /** 긴급 대기열이 가득 찼는지 여부 (최대 5개) */
  isQueueFull?: boolean;
  /** 정렬 상태 */
  sort?: PendingWorkloadSortState;
}

type CreatePendingWorkloadColumnParams = CreatePendingWorkloadColumnOptions & {
  config?: CoreCreateColumnConfig[];
};

/**
 * 대기중인 워크로드 테이블 컬럼 정의 생성 함수
 */
export function createPendingWorkloadColumn({
  onAddToUrgentQueue,
  isAddingToQueue,
  isQueueFull,
  sort,
  config,
}: CreatePendingWorkloadColumnParams): ResponsiveColumnType<AdminWorkloadResponse>[] {
  const columnList: ResponsiveColumnType<AdminWorkloadResponse>[] = [
    {
      key: "workloadName",
      title: "워크로드 이름",
      dataIndex: "workloadName",
      align: "left",
      width: "12%",
      ellipsis: true,
    },
    {
      key: "workspaceName",
      title: "워크스페이스 이름",
      dataIndex: "workspaceName",
      align: "left",
      width: "12%",
      ellipsis: true,
    },
    // Job Type 드롭다운/컬럼은 임시 비활성화
    // {
    //   key: "jobType",
    //   title: "Job Type",
    //   dataIndex: "jobType",
    //   align: "left",
    //   width: "10%",
    // },
    {
      key: "gpu",
      title: "GPU",
      align: "left",
      width: "10%",
      render: (_, record: AdminWorkloadResponse) => {
        const quotaCount = record.resource?.gpu?.detail?.normal?.quotaCount;
        return isNil(quotaCount) ? "-" : formatNumberWithUnit(quotaCount, "개");
      },
    },
    {
      key: "mig",
      title: "MIG",
      align: "left",
      width: "10%",
      render: (_, record: AdminWorkloadResponse) => {
        const detail = record.resource?.gpu?.detail;
        // MIG은 배열이므로 첫 번째 요소 확인
        if (detail?.mig && detail.mig.length > 0) {
          const firstMig = detail.mig[0];
          const count = formatNumberWithUnit(firstMig.quotaCount, "개");
          return `${firstMig.profile} ${count}`;
        }
        return "-";
      },
    },
    {
      key: "cpu",
      title: "CPU",
      align: "left",
      width: "8%",
      render: (_, record: AdminWorkloadResponse) => {
        return formatNumberWithUnit(record.resource?.cpu?.quotaCore, "Core");
      },
    },
    {
      key: "memory",
      title: "Memory",
      align: "left",
      width: "8%",
      render: (_, record: AdminWorkloadResponse) => {
        const memoryGB = convertBytes(
          record.resource?.memory?.quotaByte,
          "GB",
          0,
        ).value;
        return formatNumberWithUnit(memoryGB, "GB");
      },
    },
    {
      key: "waitingTime",
      title: "대기 시간",
      dataIndex: "createdAt",
      align: "left",
      width: "10%",
      sorter: true,
      sortOrder: sort ? getColumnSortOrder(sort, "createdAt") : undefined,
      render: (createdAt: AdminWorkloadResponse["createdAt"]) => {
        return formatElapsedTime(createdAt ?? "-");
      },
    },
    {
      key: "creatorName",
      title: "생성자",
      dataIndex: "creatorName",
      align: "left",
      width: "10%",
      ellipsis: true,
    },
    {
      key: "action",
      title: "긴급 대기열 등록",
      align: "center",
      width: "10%",
      render: (_: unknown, record: AdminWorkloadResponse) => {
        return (
          <ColumnAlignCenterWrap>
            <AddToUrgentQueueButton
              workload={record}
              onAddToUrgentQueue={onAddToUrgentQueue}
              isAddingToQueue={isAddingToQueue}
              isQueueFull={isQueueFull}
            />
          </ColumnAlignCenterWrap>
        );
      },
    },
  ];

  return applyColumnConfigs<AdminWorkloadResponse>(columnList, config);
}
