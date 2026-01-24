import type { ResponsiveColumnType } from "xiilab-ui";

import type { WorkloadReclaimScanHistoryResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { ROUTES } from "@/shared/constants/routes.constant";
import { formatDateTimeSafely } from "@/shared/utils/date.util";
import { formatNumberWithUnit } from "@/shared/utils/format.util";
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
      dataIndex: "createdAt",
      align: "left",
      render: (
        createdAt: string,
        record: WorkloadReclaimScanHistoryResponse,
      ) => {
        const href = ROUTES.ADMIN_REVOKE_RESOURCE_HISTORY_DETAIL(
          String(record.scanHistoryId),
        );

        return (
          <ColumnLink href={href}>{formatDateTimeSafely(createdAt)}</ColumnLink>
        );
      },
    },
    {
      title: "검사 대상 개수",
      dataIndex: "reclaimScanWorkloadCount",
      align: "center",
      render: (count: number) => (
        <span>{formatNumberWithUnit(count, "개")}</span>
      ),
    },
    {
      title: "경고 워크로드 개수",
      dataIndex: "reclaimWarningWorkloadCount",
      align: "center",
      render: (count: number) => (
        <span>{formatNumberWithUnit(count, "개")}</span>
      ),
    },
    {
      title: "회수 워크로드 개수",
      dataIndex: "reclaimedWorkloadCount",
      align: "center",
      render: (count: number) => (
        <span>{formatNumberWithUnit(count, "개")}</span>
      ),
    },
    {
      title: "회수된 GPU",
      dataIndex: "reclaimedGpuCount",
      align: "center",
      render: (gpu: number) => {
        const { unit } = getResourceInfo("GPU");
        return <span>{formatNumberWithUnit(gpu, unit)}</span>;
      },
    },
    {
      title: "회수된 CPU",
      dataIndex: "reclaimedCpuCore",
      align: "center",
      render: (cpu: number) => {
        const { unit } = getResourceInfo("CPU");
        return <span>{formatNumberWithUnit(cpu, unit)}</span>;
      },
    },
    {
      title: "회수된 Memory",
      dataIndex: "reclaimedMemoryByte",
      align: "center",
      render: (memory: number) => {
        const { value } = convertBytes(memory, "GB", 1);
        const { unit } = getResourceInfo("MEM");
        return <span>{formatNumberWithUnit(value, unit)}</span>;
      },
    },
  ];
}
