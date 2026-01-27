import type { ResponsiveColumnType } from "xiilab-ui";

import type { ResourcePresetResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { ROUTES } from "@/shared/constants/routes.constant";
import type { CoreCreateColumnConfig } from "@/shared/types/core.model";
import { applyColumnConfigs } from "@/shared/utils/column.util";
import { formatDateSafely } from "@/shared/utils/date.util";
import { formatNumberWithUnit } from "@/shared/utils/format.util";
import { convertBytes, getResourceInfo } from "@/shared/utils/resource.util";
import { ColumnLink } from "@/styles/layers/column-layer.styled";

const gpuInfo = getResourceInfo("GPU");
const migInfo = getResourceInfo("MIG");
const cpuInfo = getResourceInfo("CPU");
const memInfo = getResourceInfo("MEM");

interface CreateResourcePresetListColumnParams {
  config?: CoreCreateColumnConfig[];
}

/**
 * 리소스 프리셋 목록 테이블 컬럼 정의
 *
 * 선택(체크박스) 컬럼은 Ant Design Table의 rowSelection 기능을 사용하여 처리하고,
 * 이 컬럼 정의에서는 도메인 데이터 컬럼만 관리합니다.
 */
export function createResourcePresetListColumn({
  config,
}: CreateResourcePresetListColumnParams = {}): ResponsiveColumnType<ResourcePresetResponse>[] {
  const columnList: ResponsiveColumnType<ResourcePresetResponse>[] = [
    {
      key: "presetName",
      title: "프리셋 이름",
      dataIndex: "presetName",
      align: "left",
      sorter: true,
      width: "30%",
      ellipsis: true,
      render: (presetName: string, record: ResourcePresetResponse) => {
        const href = ROUTES.ADMIN_RESOURCE_PRESET_DETAIL(
          String(record.resourcePresetId),
        );
        return <ColumnLink href={href}>{presetName}</ColumnLink>;
      },
    },
    {
      key: "workloadJobType",
      title: "Job Type",
      dataIndex: "workloadJobType",
      align: "center",
      width: "20%",
    },
    {
      key: "createdAt",
      title: "생성일",
      dataIndex: "createdAt",
      align: "left",

      sorter: true,
      render: (createdAt: ResourcePresetResponse["createdAt"]) => {
        return formatDateSafely(createdAt);
      },
    },
    {
      key: "nodeType",
      title: "Node Type",
      dataIndex: "nodeType",
      align: "center",
      width: "10%",
    },
    {
      key: "gpu",
      title: gpuInfo.text,

      align: "center",
      width: "6%",
      render: (_: unknown, record: ResourcePresetResponse) => {
        const normalGpu = record.resource.gpu?.detail.normal;
        return normalGpu
          ? formatNumberWithUnit(normalGpu.requestCount, gpuInfo.unit)
          : "-";
      },
    },
    {
      key: "mig",
      title: migInfo.text,
      align: "center",
      width: "9%",
      render: (_: unknown, record: ResourcePresetResponse) => {
        const migGpus = record.resource.gpu?.detail.mig;
        if (!migGpus || migGpus.length === 0) return "-";
        const firstMig = migGpus[0];
        return `${firstMig.profile} ${formatNumberWithUnit(firstMig.requestCount, migInfo.unit)}`;
      },
    },
    {
      key: "cpu",
      title: cpuInfo.text,

      align: "center",
      width: "7%",
      render: (_: unknown, record: ResourcePresetResponse) => {
        return formatNumberWithUnit(
          record.resource.cpu.requestCore,
          cpuInfo.unit,
        );
      },
    },
    {
      key: "mem",
      title: memInfo.text,
      align: "center",
      width: "8%",
      render: (_: unknown, record: ResourcePresetResponse) => {
        const bytes = record.resource.memory.requestByte;
        return convertBytes(bytes, "GB", 0).label;
      },
    },
  ];
  return applyColumnConfigs<ResourcePresetResponse>(columnList, config);
}
