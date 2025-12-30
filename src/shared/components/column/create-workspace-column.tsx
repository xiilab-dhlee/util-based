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
      dataIndex: "checkbox",
      align: "center",
      width: ICON_COLUMN_WIDTH,
      render: (_, record: WorkspaceListType) => {
        return <WorkspaceItemCheck workspace={record} />;
      },
    },
    {
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
      dataIndex: "gpu",
      title: "GPU",
      align: "center",
      width: 30,
      render: (gpu: number) => {
        return <ColumnAlignCenterWrap>{gpu}%</ColumnAlignCenterWrap>;
      },
    },
    {
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
      dataIndex: "cpu",
      title: "CPU",
      align: "center",
      width: 30,
      render: (cpu: number) => {
        return <ColumnAlignCenterWrap>{cpu}%</ColumnAlignCenterWrap>;
      },
    },
    {
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
      dataIndex: "mem",
      title: "Memory",
      align: "center",
      width: 30,
      render: (mem: number) => {
        return <ColumnAlignCenterWrap>{mem}%</ColumnAlignCenterWrap>;
      },
    },
    {
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
      dataIndex: "creatorName",
      align: "left",
      ellipsis: true,
      render: (creatorName: string) => {
        return <span>{creatorName}</span>;
      },
    },
    {
      title: "생성일",
      dataIndex: "creatorDate",
      align: "left",
      render: (creatorDate: string) => {
        return <span>{formatDateSafely(creatorDate)}</span>;
      },
    },
  ];
};

/**
 * 워크스페이스 목록 컬럼 생성
 *
 * @param showCheckbox 체크박스 표시 여부
 * @param config 컬럼 설정 (배열 형태)
 * @returns 컬럼 배열
 *
 * @example
 * // 1. 모든 컬럼 표시 (체크박스 포함)
 * const columns = createWorkspaceListColumn(true);
 *
 * @example
 * // 2. 배열 형태 - 순서 변경 가능
 * const columns = createWorkspaceListColumn(false, [
 *   { dataIndex: 'workspaceName' },
 *   { dataIndex: 'gpu' },
 *   { dataIndex: 'cpu' },
 *   { dataIndex: 'mem' },
 * ]);
 *
 */
export const createWorkspaceColumn = (
  config?: CoreCreateColumnConfig[],
): ResponsiveColumnType[] => {
  const columnList = createColumnList();

  return applyColumnConfigs(columnList, config);
};
