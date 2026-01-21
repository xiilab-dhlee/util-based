import type { ResponsiveColumnType } from "xiilab-ui";

import type { AdminWorkloadResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { AddToUrgentQueueButton } from "@/domain/scheduling-queue/components/list/add-to-urgent-queue-button";
import type { CoreCreateColumnConfig } from "@/shared/types/core.model";
import { applyColumnConfigs } from "@/shared/utils/column.util";
import { formatElapsedTime } from "@/shared/utils/date.util";
import { ColumnAlignCenterWrap } from "@/styles/layers/column-layer.styled";

interface CreatePendingWorkloadColumnOptions {
  onAddToUrgentQueue: (workload: AdminWorkloadResponse) => void;
  isAddingToQueue?: boolean;
  /** 긴급 대기열이 가득 찼는지 여부 (최대 5개) */
  isQueueFull?: boolean;
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
  config,
}: CreatePendingWorkloadColumnParams): ResponsiveColumnType<AdminWorkloadResponse>[] {
  const columnList: ResponsiveColumnType<AdminWorkloadResponse>[] = [
    {
      key: "workloadName",
      title: "워크로드 이름",
      dataIndex: "workloadName",
      align: "left",
      width: "15%",
      ellipsis: true,
    },
    {
      key: "workspaceName",
      title: "워크스페이스 이름",
      dataIndex: "workspaceName",
      align: "left",
      width: "15%",
      ellipsis: true,
    },
    {
      key: "jobType",
      title: "Job Type",
      dataIndex: "jobType",
      align: "left",
      width: "12%",
    },
    {
      key: "resourcePreset",
      title: "리소스 프리셋",
      dataIndex: "resource",
      align: "left",
      width: "12%",
      render: () => {
        return `미정`;
      },
    },
    {
      key: "waitingTime",
      title: "대기 시간",
      dataIndex: "createdAt",
      align: "left",
      width: "12%",
      render: (createdAt: AdminWorkloadResponse["createdAt"]) => {
        return formatElapsedTime(createdAt ?? "-");
      },
    },
    {
      key: "creatorName",
      title: "생성자",
      dataIndex: "creatorName",
      align: "left",
      width: "12%",
      ellipsis: true,
    },
    {
      key: "action",
      title: "긴급 대기열 등록",
      align: "center",
      width: "12%",
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
