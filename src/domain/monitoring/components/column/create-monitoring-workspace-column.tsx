"use client";

import type { ResponsiveColumnType } from "xiilab-ui";

import type { AdminWorkspaceSummaryResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import type { CoreCreateColumnConfig } from "@/shared/types/core.model";
import { applyColumnConfigs } from "@/shared/utils/column.util";
import { formatDateSafely } from "@/shared/utils/date.util";
import { formatNumberWithUnit } from "@/shared/utils/format.util";
import {
  ColumnAlignCenterWrap,
  ColumnTextButton,
} from "@/styles/layers/column-layer.styled";

interface CreateMonitoringWorkspaceColumnOptions {
  onNameClick?: (record: AdminWorkspaceSummaryResponse) => void;
}

/**
 * 모니터링 워크스페이스 목록용 컬럼 정의 생성
 */
const createColumnList = (
  options?: CreateMonitoringWorkspaceColumnOptions,
): ResponsiveColumnType[] => {
  return [
    {
      key: "name",
      dataIndex: "workspaceName",
      title: "워크스페이스 이름",
      align: "left",
      ellipsis: true,
      width: "20%",
      render: (
        workspaceName: string,
        record: AdminWorkspaceSummaryResponse,
      ) => {
        return (
          <ColumnTextButton
            type="button"
            onClick={() => options?.onNameClick?.(record)}
          >
            {workspaceName || "-"}
          </ColumnTextButton>
        );
      },
    },
    {
      key: "gpu",
      title: "GPU",
      align: "center",
      width: "8%",
      render: (_, record: AdminWorkspaceSummaryResponse) => {
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
      key: "cpu",
      title: "CPU",
      align: "center",
      width: "8%",
      render: (_, record: AdminWorkspaceSummaryResponse) => {
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
      key: "mem",
      title: "Memory",
      align: "center",
      width: "8%",
      render: (_, record: AdminWorkspaceSummaryResponse) => {
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
      key: "runningWorkloadCount",
      title: "실행중",
      align: "center",
      width: "8%",
      render: (_, record: AdminWorkspaceSummaryResponse) => {
        return (
          <ColumnAlignCenterWrap>
            {record.runningWorkloadCount}
          </ColumnAlignCenterWrap>
        );
      },
    },
    {
      key: "pendingWorkloadCount",
      title: "대기중",
      align: "center",
      width: "8%",
      render: (_, record: AdminWorkspaceSummaryResponse) => {
        return (
          <ColumnAlignCenterWrap>
            {record.pendingWorkloadCount}
          </ColumnAlignCenterWrap>
        );
      },
    },
    {
      key: "errorWorkloadCount",
      title: "에러",
      align: "center",
      width: "8%",
      render: (_, record: AdminWorkspaceSummaryResponse) => {
        return (
          <ColumnAlignCenterWrap>
            {record.errorWorkloadCount}
          </ColumnAlignCenterWrap>
        );
      },
    },
    {
      title: "생성자",
      key: "creatorName",
      dataIndex: "creatorName",
      align: "left",
      ellipsis: true,
      width: "12%",
      render: (creatorName?: string) => {
        return <span>{creatorName || "-"}</span>;
      },
    },
    {
      title: "생성일",
      key: "createdAt",
      dataIndex: "createdAt",
      align: "left",
      width: "12%",
      render: (createdAt?: string) => {
        return <span>{formatDateSafely(createdAt)}</span>;
      },
    },
  ];
};

export const createMonitoringWorkspaceColumn = (
  config?: CoreCreateColumnConfig[],
  options?: CreateMonitoringWorkspaceColumnOptions,
): ResponsiveColumnType[] => {
  const columnList = createColumnList(options);

  return applyColumnConfigs(columnList, config);
};
