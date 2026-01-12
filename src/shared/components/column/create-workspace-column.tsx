import type { ResponsiveColumnType } from "xiilab-ui";

import { WorkspaceAllCheck } from "@/domain/workspace/components/list/workspace-all-check";
import { WorkspaceItemCheck } from "@/domain/workspace/components/list/workspace-item-check";
import type { WorkspaceListType } from "@/domain/workspace/schemas/workspace.schema";
import { ICON_COLUMN_WIDTH } from "@/shared/constants/core.constant";
import { ROUTES } from "@/shared/constants/routes.constant";
import type { CoreCreateColumnConfig } from "@/shared/types/core.model";
import { applyColumnConfigs } from "@/shared/utils/column.util";
import { formatDateSafely } from "@/shared/utils/date.util";
import { formatNumber } from "@/shared/utils/format.util";
import { getResourceInfo } from "@/shared/utils/resource.util";
import {
  ColumnAlignCenterWrap,
  ColumnLink,
} from "@/styles/layers/column-layer.styled";

const GPU_INFO = getResourceInfo("GPU");
const CPU_INFO = getResourceInfo("CPU");
const MEM_INFO = getResourceInfo("MEM");

/**
 * 컬럼 정의 배열 생성 (dataIndex 한 번만 정의)
 */
const createColumnList = (): ResponsiveColumnType[] => {
  return [
    {
      title: <WorkspaceAllCheck />,
      key: "checkbox",
      dataIndex: "checkbox",
      align: "center",
      width: ICON_COLUMN_WIDTH,
      render: (_, record: WorkspaceListType) => {
        return <WorkspaceItemCheck workspace={record} />;
      },
    },
    {
      key: "name",
      dataIndex: "name",
      title: "워크스페이스 이름",
      align: "left",
      render: (workspaceName: string, record: WorkspaceListType) => {
        return (
          <ColumnLink href={ROUTES.ADMIN_WORKSPACE_DETAIL(record.id)}>
            {workspaceName}
          </ColumnLink>
        );
      },
    },
    {
      key: "gpu",
      dataIndex: "gpu",
      title: "GPU",
      align: "center",
      width: 30,
      render: (gpu: number) => {
        return <ColumnAlignCenterWrap>{gpu}%</ColumnAlignCenterWrap>;
      },
    },
    {
      key: "gpuUsage",
      dataIndex: "gpuUsage",
      title: "사용량",
      align: "center",
      width: 70,
      render: (gpuUsage: number) => {
        return (
          <ColumnAlignCenterWrap>
            {gpuUsage}
            {GPU_INFO.unit}
          </ColumnAlignCenterWrap>
        );
      },
    },
    {
      key: "gpuQuota",
      dataIndex: "gpuQuota",
      title: "할당량",
      align: "center",
      width: 100,
      render: (gpuQuota: number) => {
        return (
          <ColumnAlignCenterWrap>
            {gpuQuota}
            {GPU_INFO.unit}
          </ColumnAlignCenterWrap>
        );
      },
    },
    {
      key: "cpu",
      dataIndex: "cpu",
      title: "CPU",
      align: "center",
      width: 30,
      render: (cpu: number) => {
        return <ColumnAlignCenterWrap>{cpu}%</ColumnAlignCenterWrap>;
      },
    },
    {
      key: "cpuUsage",
      dataIndex: "cpuUsage",
      title: "사용량",
      align: "center",
      width: 70,
      render: (cpuUsage: number) => {
        return (
          <ColumnAlignCenterWrap>
            {cpuUsage}
            {CPU_INFO.unit}
          </ColumnAlignCenterWrap>
        );
      },
    },
    {
      key: "cpuQuota",
      dataIndex: "cpuQuota",
      title: "할당량",
      align: "center",
      width: 100,
      render: (cpuQuota: number) => {
        return (
          <ColumnAlignCenterWrap>
            {cpuQuota}
            {CPU_INFO.unit}
          </ColumnAlignCenterWrap>
        );
      },
    },
    {
      key: "mem",
      dataIndex: "mem",
      title: "Memory",
      align: "center",
      width: 30,
      render: (mem: number) => {
        return <ColumnAlignCenterWrap>{mem}%</ColumnAlignCenterWrap>;
      },
    },
    {
      key: "memUsage",
      dataIndex: "memUsage",
      title: "사용량",
      align: "center",
      width: 70,
      render: (memUsage: number) => {
        return (
          <ColumnAlignCenterWrap>
            {memUsage}
            {MEM_INFO.unit}
          </ColumnAlignCenterWrap>
        );
      },
    },
    {
      key: "memQuota",
      dataIndex: "memQuota",
      title: "할당량",
      align: "center",
      width: 50,
      render: (memQuota: number) => {
        return (
          <ColumnAlignCenterWrap>
            {memQuota}
            {MEM_INFO.unit}
          </ColumnAlignCenterWrap>
        );
      },
    },
    {
      title: "실행중",
      key: "running",
      dataIndex: "running",
      align: "center",
      render: (running: number) => {
        return (
          <ColumnAlignCenterWrap>{formatNumber(running)}</ColumnAlignCenterWrap>
        );
      },
    },
    {
      title: "대기중",
      key: "pending",
      dataIndex: "pending",
      align: "center",
      render: (pending: number) => {
        return (
          <ColumnAlignCenterWrap>{formatNumber(pending)}</ColumnAlignCenterWrap>
        );
      },
    },
    {
      title: "에러",
      key: "error",
      dataIndex: "error",
      align: "center",
      render: (error: number) => {
        return (
          <ColumnAlignCenterWrap>{formatNumber(error)}</ColumnAlignCenterWrap>
        );
      },
    },
    {
      title: "생성자",
      key: "creatorName",
      dataIndex: "creatorName",
      align: "left",
      ellipsis: true,
      render: (creatorName: string) => {
        return <span>{creatorName}</span>;
      },
    },
    {
      title: "생성일",
      key: "creatorDate",
      dataIndex: "creatorDate",
      align: "left",
      render: (creatorDate: string) => {
        return <span>{formatDateSafely(creatorDate)}</span>;
      },
    },
  ];
};

export const createWorkspaceColumn = (
  config?: CoreCreateColumnConfig[],
): ResponsiveColumnType[] => {
  const columnList = createColumnList();

  return applyColumnConfigs(columnList, config);
};
