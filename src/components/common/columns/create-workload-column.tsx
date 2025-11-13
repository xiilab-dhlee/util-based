import classNames from "classnames";
import type { ResponsiveColumnType } from "xiilab-ui";

import { MyIcon } from "@/components/common/icons";
import { WorkloadStatusText } from "@/components/common/text/workload-status-text";
import { WorkloadLogButton } from "@/components/workload/list/workload-log-button";
import { WorkloadMonitoringButton } from "@/components/workload/list/workload-monitoring-button";
import { WorkloadNameLink } from "@/components/workload/list/workload-name-link";
import { WorkloadTerminalButton } from "@/components/workload/list/workload-terminal-button";
import { Core } from "@/models/core.model";
import type {
  WorkloadJobType,
  WorkloadListType,
  WorkloadStatusType,
} from "@/schemas/workload.schema";
import {
  ColumnAlignCenterWrap,
  ColumnIconWrap,
} from "@/styles/layers/column-layer.styled";
import type { CoreCreateColumnConfig } from "@/types/common/core.model";
import { applyColumnConfigs } from "@/utils/common/column.util";
import { formatElapsedTime } from "@/utils/common/date.util";

/**
 * 워크로드 컬럼 정의
 * dataIndex는 workloadListSchema의 필드명과 일치
 * 순서는 여기서 정의한 순서대로 표시됨
 *
 * @param isAdmin 관리자 모드 여부
 * @returns 컬럼 배열
 */
const createColumnList = (): ResponsiveColumnType[] => {
  return [
    {
      dataIndex: "isPinned",
      title: "고정",
      align: "center",
      width: Core.ICON_COLUMN_WIDTH,
      render: (isPinned: boolean) => {
        return (
          <ColumnAlignCenterWrap>
            <ColumnIconWrap
              onClick={() => alert("준비 중입니다.")}
              className={classNames({
                active: isPinned,
              })}
            >
              <MyIcon name="PinFilled" color="var(--icon-fill)" />
            </ColumnIconWrap>
          </ColumnAlignCenterWrap>
        );
      },
    },
    {
      dataIndex: "workloadName",
      title: "워크로드 이름",
      align: "left",
      render: (workloadName: string, { workspaceId, id }: WorkloadListType) => {
        return (
          <WorkloadNameLink
            workspaceId={workspaceId}
            workloadId={id}
            workloadName={workloadName}
          />
        );
      },
    },
    {
      dataIndex: "jobType",
      title: "잡 타입",
      align: "center",
      width: 70,
      render: (jobType: WorkloadJobType) => {
        return (
          <ColumnAlignCenterWrap>
            <span style={{ textTransform: "capitalize" }}>
              {jobType.toLowerCase()}
            </span>
          </ColumnAlignCenterWrap>
        );
      },
    },
    {
      dataIndex: "elapsedTime",
      title: "경과 시간",
      align: "center",
      width: 140,
      render: (elapsedTime: string) => {
        return <span>{formatElapsedTime(elapsedTime)}</span>;
      },
    },
    {
      dataIndex: "status",
      title: "상태",
      align: "center",
      render: (status: WorkloadStatusType) => {
        return (
          <ColumnAlignCenterWrap>
            <WorkloadStatusText status={status} />
          </ColumnAlignCenterWrap>
        );
      },
    },
    // 액션 컬럼들
    {
      dataIndex: "log",
      title: "로그",
      align: "center",
      width: Core.ICON_COLUMN_WIDTH,
      render: (_, { workspaceId, id, status }: WorkloadListType) => {
        return (
          <WorkloadLogButton
            workspaceId={workspaceId}
            workloadId={id}
            disabled={status !== "RUNNING"}
          />
        );
      },
    },
    {
      dataIndex: "terminal",
      title: "웹터미널",
      align: "center",
      width: Core.ICON_COLUMN_WIDTH,
      render: (_, { workspaceId, id, status }: WorkloadListType) => {
        return (
          <WorkloadTerminalButton
            workspaceId={workspaceId}
            workloadId={id}
            disabled={status !== "RUNNING"}
          />
        );
      },
    },
    {
      dataIndex: "port",
      title: "포트",
      align: "center",
      width: Core.ICON_COLUMN_WIDTH,
      render: (_, record: WorkloadListType) => {
        return (
          <ColumnAlignCenterWrap>
            <ColumnIconWrap
              onClick={() => alert("준비 중입니다.")}
              disabled={record.status === "RUNNING"}
            >
              <MyIcon name="Port" color="var(--icon-fill)" size={20} />
            </ColumnIconWrap>
          </ColumnAlignCenterWrap>
        );
      },
    },
    {
      dataIndex: "monitoring",
      title: "모니터링",
      align: "center",
      width: Core.ICON_COLUMN_WIDTH,
      render: (_, { workspaceId, id, status }: WorkloadListType) => {
        return (
          <WorkloadMonitoringButton
            workspaceId={workspaceId}
            workloadId={id}
            disabled={status !== "RUNNING"}
          />
        );
      },
    },
    {
      dataIndex: "power",
      title: "종료",
      align: "center",
      width: Core.ICON_COLUMN_WIDTH,
      render: (_, record: WorkloadListType) => {
        return (
          <ColumnAlignCenterWrap>
            <ColumnIconWrap
              onClick={() => alert("준비 중입니다.")}
              disabled={record.status === "RUNNING"}
            >
              <MyIcon name="PowerBold" color="var(--icon-fill)" size={20} />
            </ColumnIconWrap>
          </ColumnAlignCenterWrap>
        );
      },
    },
    {
      dataIndex: "delete",
      title: "삭제",
      align: "center",
      width: Core.ICON_COLUMN_WIDTH,
      render: (_, record: WorkloadListType) => {
        return (
          <ColumnAlignCenterWrap>
            <ColumnIconWrap
              onClick={() => alert("준비 중입니다.")}
              disabled={record.status === "COMPLETED"}
            >
              <MyIcon name="Delete" color="var(--icon-fill)" size={20} />
            </ColumnIconWrap>
          </ColumnAlignCenterWrap>
        );
      },
    },
  ];
};

/**
 * 워크로드 목록 컬럼 생성
 *
 * @param isAdmin 관리자 모드 여부
 * @param config 컬럼 설정 (배열 형태)
 * @returns 컬럼 배열
 *
 * @example
 * // 1. 모든 컬럼 표시 (기본)
 * const columns = createWorkloadListColumn(false);
 *
 * @example
 * // 2. 배열 형태 - 순서 변경 가능
 * const columns = createWorkloadListColumn(false, [
 *   { dataIndex: 'status' },
 *   { dataIndex: 'workloadName', title: '이름' },
 *   { dataIndex: 'jobType', width: 100 },
 * ]);
 */
export const createWorkloadColumn = (
  config?: CoreCreateColumnConfig[],
): ResponsiveColumnType[] => {
  const columnList = createColumnList();

  return applyColumnConfigs(columnList, config);
};
