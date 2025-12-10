import type { ResponsiveColumnType } from "xiilab-ui";

import { REVOKE_HISTORY_TYPE_LABEL_BY_VALUE } from "@/domain/revoke-history/constants/revoke-history.constant";
import type { RevokeHistoryDetailItemType } from "@/domain/revoke-history/schemas/revoke-history.schema";
import type { RevokeHistoryDetailType } from "@/domain/revoke-history/types/revoke-history.type";
import { getJobTypeLabel } from "@/domain/workload/constants/workload.constant";
import type { WorkloadJobType } from "@/domain/workload/schemas/workload.schema";
import { ROUTES } from "@/shared/constants/routes.constant";
import { formatDateTimeSafely } from "@/shared/utils/date.util";
import { convertBytes, getResourceInfo } from "@/shared/utils/resource.util";
import { ColumnLink } from "@/styles/layers/column-layer.styled";

/**
 * 구분 타입에 따른 라벨 반환
 */
const getTypeLabel = (type: RevokeHistoryDetailType): string => {
  return REVOKE_HISTORY_TYPE_LABEL_BY_VALUE[type] ?? type;
};

/**
 * 리소스 회수 이력 상세 (경고/회수 목록) 테이블 컬럼 생성
 *
 * @returns 컬럼 배열
 */
export function createRevokeHistoryDetailColumn(): ResponsiveColumnType[] {
  return [
    {
      title: "워크로드명",
      dataIndex: "workloadName",
      align: "left",
      render: (workloadName: string, record: RevokeHistoryDetailItemType) => {
        const href = ROUTES.ADMIN_WORKSPACE_WORKLOAD_DETAIL(
          record.workspaceId,
          record.workloadId,
        );

        return (
          <ColumnLink href={href} target="_blank">
            {workloadName}
          </ColumnLink>
        );
      },
    },
    {
      title: "구분",
      dataIndex: "type",
      align: "center",
      render: (type: RevokeHistoryDetailItemType["type"]) => (
        <span>{getTypeLabel(type)}</span>
      ),
    },
    {
      title: "워크스페이스",
      dataIndex: "workspaceName",
      align: "center",
      render: (workspaceName: string) => <span>{workspaceName}</span>,
    },
    {
      title: "잡 타입",
      dataIndex: "jobType",
      align: "center",
      render: (jobType: WorkloadJobType) => (
        <span>{getJobTypeLabel(jobType)}</span>
      ),
    },
    {
      title: "GPU",
      dataIndex: "gpu",
      align: "center",
      render: (gpu: number) => {
        const safeGpu = Number.isFinite(gpu) && gpu > 0 ? gpu : 0;
        const { unit } = getResourceInfo("GPU");

        return <span>{`${safeGpu}${unit}`}</span>;
      },
    },
    {
      title: "CPU",
      dataIndex: "cpu",
      align: "center",
      render: (cpu: number) => {
        const safeCpu = Number.isFinite(cpu) && cpu > 0 ? cpu : 0;
        const { unit } = getResourceInfo("CPU");

        return <span>{`${safeCpu}${unit}`}</span>;
      },
    },
    {
      title: "Memory",
      dataIndex: "memory",
      align: "center",
      render: (memory: number) => {
        const safeMemory = Number.isFinite(memory) && memory > 0 ? memory : 0;
        const { value } = convertBytes(safeMemory, "GB", 1);

        return <span>{`${value}GB`}</span>;
      },
    },
    {
      title: "생성자",
      dataIndex: "creatorName",
      align: "center",
      render: (creatorName: string) => <span>{creatorName}</span>,
    },
    {
      title: "생성 일시",
      dataIndex: "createdAt",
      align: "center",
      render: (createdAt: string) => (
        <span>{formatDateTimeSafely(createdAt) ?? "-"}</span>
      ),
    },
  ];
}
