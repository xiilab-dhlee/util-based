import classNames from "classnames";
import type { ResponsiveColumnType } from "xiilab-ui";

import { WorkspaceAllCheck } from "@/components/workspace/list/workspace-all-check";
import { WorkspaceItemCheck } from "@/components/workspace/list/workspace-item-check";
import { ICON_COLUMN_WIDTH } from "@/constants/common/core.constant";
import type { WorkspaceListType } from "@/schemas/workspace.schema";
import {
  ColumnAlignCenterWrap,
  ColumnHighlightText,
  ColumnLink,
} from "@/styles/layers/column-layer.styled";
import type { CoreCreateColumnConfig } from "@/types/common/core.model";
import { applyColumnConfigs } from "@/utils/common/column.util";
import {
  getAllStatusClassName,
  getStatusClassName,
} from "@/utils/common/resource.util";

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
        const status = getAllStatusClassName(
          record.gpu,
          record.cpu,
          record.mem,
        );
        return (
          <ColumnLink href={`/admin/workspace/${record.id}`}>
            <ColumnHighlightText className={classNames({ [status]: status })}>
              {workspaceName}
            </ColumnHighlightText>
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
        const status = getStatusClassName(gpu);
        return (
          <ColumnAlignCenterWrap>
            <ColumnHighlightText className={classNames({ [status]: status })}>
              {gpu}%
            </ColumnHighlightText>
          </ColumnAlignCenterWrap>
        );
      },
    },
    {
      dataIndex: "gpuUsage",
      title: "사용량",
      align: "center",
      width: 70,
      render: (gpuUsage: number) => {
        return <ColumnAlignCenterWrap>{gpuUsage}개</ColumnAlignCenterWrap>;
      },
    },
    {
      dataIndex: "gpuQuota",
      title: "할당량",
      align: "left",
      width: 100,
      render: (gpuQuota: number) => {
        return <span>{gpuQuota}개</span>;
      },
    },
    {
      dataIndex: "cpu",
      title: "CPU",
      align: "center",
      width: 30,
      render: (cpu: number) => {
        const status = getStatusClassName(cpu);
        return (
          <ColumnAlignCenterWrap>
            <ColumnHighlightText className={classNames({ [status]: status })}>
              {cpu}%
            </ColumnHighlightText>
          </ColumnAlignCenterWrap>
        );
      },
    },
    {
      dataIndex: "cpuUsage",
      title: "사용량",
      align: "center",
      width: 70,
      render: (cpuUsage: number) => {
        return <ColumnAlignCenterWrap>{cpuUsage}개</ColumnAlignCenterWrap>;
      },
    },
    {
      dataIndex: "cpuQuota",
      title: "할당량",
      align: "left",
      width: 100,
      render: (cpuQuota: number) => {
        return <span>{cpuQuota}개</span>;
      },
    },
    {
      dataIndex: "mem",
      title: "MEM",
      align: "center",
      width: 30,
      render: (mem: number) => {
        const status = getStatusClassName(mem);
        return (
          <ColumnAlignCenterWrap>
            <ColumnHighlightText className={classNames({ [status]: status })}>
              {mem}%
            </ColumnHighlightText>
          </ColumnAlignCenterWrap>
        );
      },
    },
    {
      dataIndex: "memUsage",
      title: "사용량",
      align: "center",
      width: 70,
      render: (memUsage: number) => {
        return <ColumnAlignCenterWrap>{memUsage}개</ColumnAlignCenterWrap>;
      },
    },
    {
      dataIndex: "memQuota",
      title: "할당량",
      align: "left",
      width: 50,
      render: (memQuota: number) => {
        return <span>{memQuota}개</span>;
      },
    },
    {
      title: "실행중",
      dataIndex: "running",
      align: "center",
      render: () => {
        return <span>7,777</span>;
      },
    },
    {
      title: "대기중",
      dataIndex: "pending",
      align: "center",
      render: () => {
        return <span>7,777</span>;
      },
    },
    {
      title: "에러",
      dataIndex: "error",
      align: "center",
      render: () => {
        return <span>7,777</span>;
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
