import type { ResponsiveColumnType } from "xiilab-ui";

import type { AdminWorkspaceListResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import type { WorkspaceSortField } from "@/domain/workspace/constants/workspace.constant";
import { ROUTES } from "@/shared/constants/routes.constant";
import type {
  AntdTableSortState,
  CoreCreateColumnConfig,
} from "@/shared/types/core.model";
import { applyColumnConfigs } from "@/shared/utils/column.util";
import { formatDateSafely } from "@/shared/utils/date.util";
import { formatNumberWithUnit } from "@/shared/utils/format.util";
import { convertBytes, getResourceInfo } from "@/shared/utils/resource.util";
import { getColumnSortOrder } from "@/shared/utils/sort.util";
import {
  ColumnAlignCenterWrap,
  ColumnLink,
} from "@/styles/layers/column-layer.styled";

const GPU_INFO = getResourceInfo("GPU");
const CPU_INFO = getResourceInfo("CPU");
const MEM_INFO = getResourceInfo("MEM");

/**
 * 컬럼 정의 배열 생성
 */
const createColumnList = (
  sort: AntdTableSortState<WorkspaceSortField>,
): ResponsiveColumnType[] => {
  return [
    {
      key: "name",
      dataIndex: "workspaceName",
      title: "워크스페이스 이름",
      align: "left",
      ellipsis: true,
      width: "28%",
      sorter: true,
      sortOrder: getColumnSortOrder(sort, "workspaceName"),
      render: (workspaceName: string, record: AdminWorkspaceListResponse) => {
        return (
          <ColumnLink
            href={ROUTES.ADMIN_WORKSPACE_DETAIL(String(record.workspaceId))}
          >
            {workspaceName || "-"}
          </ColumnLink>
        );
      },
    },
    {
      title: "생성자",
      key: "creatorName",
      dataIndex: "creatorName",
      align: "left",
      ellipsis: true,
      width: "11%",
      sorter: true,
      sortOrder: getColumnSortOrder(sort, "creatorName"),
      render: (creatorName?: string) => {
        return <span>{creatorName || "-"}</span>;
      },
    },
    {
      title: "생성일",
      key: "createdAt",
      dataIndex: "createdAt",
      align: "left",
      width: "13%",
      sorter: true,
      sortOrder: getColumnSortOrder(sort, "createdAt"),
      render: (createdAt?: string) => {
        return <span>{formatDateSafely(createdAt)}</span>;
      },
    },
    {
      key: "gpu",
      title: "GPU",
      align: "center",
      width: "4%",
      render: (_, record: AdminWorkspaceListResponse) => {
        return (
          <ColumnAlignCenterWrap>
            {formatNumberWithUnit(
              record.resource.utilization.gpu.currentPercent,
              "%",
            )}
          </ColumnAlignCenterWrap>
        );
      },
    },
    {
      key: "gpuUsage",
      title: "사용량",
      align: "center",
      width: "5%",
      render: (_, record: AdminWorkspaceListResponse) => {
        const usedCount = record.resource.gpu?.usedCount;
        return (
          <ColumnAlignCenterWrap>
            {formatNumberWithUnit(usedCount, GPU_INFO.unit)}
          </ColumnAlignCenterWrap>
        );
      },
    },
    {
      key: "gpuQuota",
      title: "할당량",
      align: "center",
      width: "5%",
      render: (_, record: AdminWorkspaceListResponse) => {
        const quotaCount = record.resource.gpu?.quotaCount;
        return (
          <ColumnAlignCenterWrap>
            {formatNumberWithUnit(quotaCount, GPU_INFO.unit)}
          </ColumnAlignCenterWrap>
        );
      },
    },
    {
      key: "cpu",
      title: "CPU",
      align: "center",
      width: "4%",
      render: (_, record: AdminWorkspaceListResponse) => {
        return (
          <ColumnAlignCenterWrap>
            {formatNumberWithUnit(
              record.resource.utilization.cpu.currentPercent,
              "%",
            )}
          </ColumnAlignCenterWrap>
        );
      },
    },
    {
      key: "cpuUsage",
      title: "사용량",
      align: "center",
      width: "6%",
      render: (_, record: AdminWorkspaceListResponse) => {
        return (
          <ColumnAlignCenterWrap>
            {formatNumberWithUnit(record.resource.cpu.usedCore, CPU_INFO.unit)}
          </ColumnAlignCenterWrap>
        );
      },
    },
    {
      key: "cpuQuota",
      title: "할당량",
      align: "center",
      width: "6%",
      render: (_, record: AdminWorkspaceListResponse) => {
        return (
          <ColumnAlignCenterWrap>
            {formatNumberWithUnit(record.resource.cpu.quotaCore, CPU_INFO.unit)}
          </ColumnAlignCenterWrap>
        );
      },
    },
    {
      key: "mem",
      title: "Memory",
      align: "center",
      width: "4%",
      render: (_, record: AdminWorkspaceListResponse) => {
        return (
          <ColumnAlignCenterWrap>
            {formatNumberWithUnit(
              record.resource.utilization.memory.currentPercent,
              "%",
            )}
          </ColumnAlignCenterWrap>
        );
      },
    },
    {
      key: "memUsage",
      title: "사용량",
      align: "center",
      width: "7%",
      render: (_, record: AdminWorkspaceListResponse) => {
        const memUsage = convertBytes(record.resource.memory.usedByte, "GB", 2);
        return (
          <ColumnAlignCenterWrap>
            {formatNumberWithUnit(memUsage.value, MEM_INFO.unit)}
          </ColumnAlignCenterWrap>
        );
      },
    },
    {
      key: "memQuota",
      title: "할당량",
      align: "center",
      width: "7%",
      render: (_, record: AdminWorkspaceListResponse) => {
        const memQuota = convertBytes(
          record.resource.memory.quotaByte,
          "GB",
          2,
        );
        return (
          <ColumnAlignCenterWrap>
            {formatNumberWithUnit(memQuota.value, MEM_INFO.unit)}
          </ColumnAlignCenterWrap>
        );
      },
    },
  ];
};

export const createWorkspaceColumn = (
  sort: AntdTableSortState<WorkspaceSortField>,
  config?: CoreCreateColumnConfig[],
): ResponsiveColumnType[] => {
  const columnList = createColumnList(sort);

  return applyColumnConfigs(columnList, config);
};
