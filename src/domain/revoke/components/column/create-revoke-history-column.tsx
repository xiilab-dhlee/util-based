import type { ResponsiveColumnType } from "xiilab-ui";

import type { RevokeHistoryItemResponseType } from "@/domain/revoke/schemas/revoke-history.schema";
import { ROUTES } from "@/shared/constants/routes.constant";
import { formatDateTimeSafely } from "@/shared/utils/date.util";
import { convertBytes, getResourceInfo } from "@/shared/utils/resource.util";
import { ColumnLink } from "@/styles/layers/column-layer.styled";

/**
 * 리소스 회수 이력 테이블 컬럼 생성
 *
 * @returns 컬럼 배열
 */
export function createRevokeHistoryColumn(): ResponsiveColumnType[] {
  return [
    {
      title: "회수 일시",
      dataIndex: "revokedAt",
      align: "left",
      render: (revokedAt: string, record: RevokeHistoryItemResponseType) => {
        const href = ROUTES.ADMIN_REVOKE_RESOURCE_HISTORY_DETAIL(record.id);

        return (
          <ColumnLink href={href}>
            {formatDateTimeSafely(revokedAt) ?? "-"}
          </ColumnLink>
        );
      },
    },
    {
      title: "검사 대상 개수",
      dataIndex: "targetCount",
      align: "center",
      render: (targetCount: number) => <span>{targetCount}개</span>,
    },
    {
      title: "경고 워크로드 개수",
      dataIndex: "warningWorkloadCount",
      align: "center",
      render: (count: number) => <span>{count}개</span>,
    },
    {
      title: "회수 워크로드 개수",
      dataIndex: "revokedWorkloadCount",
      align: "center",
      render: (count: number) => <span>{count}개</span>,
    },
    {
      title: "회수된 GPU",
      dataIndex: "revokedGpu",
      align: "center",
      render: (gpu: string) => {
        const gpuCount = Number(gpu);
        const safeGpuCount =
          Number.isFinite(gpuCount) && gpuCount > 0 ? gpuCount : 0;
        const { unit } = getResourceInfo("GPU");

        return (
          <span>
            {safeGpuCount}
            {unit}
          </span>
        );
      },
    },
    {
      title: "회수된 CPU",
      dataIndex: "revokedCpu",
      align: "center",
      render: (cpu: string) => {
        const cpuCount = Number(cpu);
        const safeCpuCount =
          Number.isFinite(cpuCount) && cpuCount > 0 ? cpuCount : 0;
        const { unit } = getResourceInfo("CPU");

        return (
          <span>
            {safeCpuCount}
            {unit}
          </span>
        );
      },
    },
    {
      title: "회수된 Memory",
      dataIndex: "revokedMemory",
      align: "center",
      render: (memory: string) => {
        const bytes = Number(memory);
        const safeBytes = Number.isFinite(bytes) && bytes > 0 ? bytes : 0;
        const { value } = convertBytes(safeBytes, "GB", 1);

        return <span>{value}GB</span>;
      },
    },
  ];
}
