import type { ResponsiveColumnType } from "xiilab-ui";
import { Icon } from "xiilab-ui";

import { SelectWorkloadRadio } from "@/domain/workload/components/create/select-workload-radio";
import { DeleteWorkloadButton } from "@/domain/workload/components/list/delete-workload-button";
import { RestartWorkloadButton } from "@/domain/workload/components/list/restart-workload-button";
import { StopWorkloadButton } from "@/domain/workload/components/list/stop-workload-button";
import { WorkloadLogButton } from "@/domain/workload/components/list/workload-log-button";
import { WorkloadMonitoringButton } from "@/domain/workload/components/list/workload-monitoring-button";
import { WorkloadNameLink } from "@/domain/workload/components/list/workload-name-link";
import { WorkloadTerminalButton } from "@/domain/workload/components/list/workload-terminal-button";
import type {
  WorkloadJobType,
  WorkloadListType,
  WorkloadStatusType,
} from "@/domain/workload/schemas/workload.schema";
import { WorkloadStatusText } from "@/shared/components/text/workload-status-text";
import { ICON_COLUMN_WIDTH } from "@/shared/constants/core.constant";
import { WORKLOAD_SELECTOR } from "@/shared/constants/selector.constant";
import type { CoreCreateColumnConfig } from "@/shared/types/core.model";
import { applyColumnConfigs } from "@/shared/utils/column.util";
import { formatElapsedTime } from "@/shared/utils/date.util";
import {
  ColumnAlignCenterWrap,
  ColumnIconWrap,
} from "@/styles/layers/column-layer.styled";

const createColumnList = (): ResponsiveColumnType[] => {
  return [
    {
      dataIndex: "select",
      title: "선택",
      align: "center",
      width: ICON_COLUMN_WIDTH,
      render: (_, record: WorkloadListType) => {
        return <SelectWorkloadRadio workloadId={record.id} />;
      },
    },
    {
      dataIndex: "workloadName",
      title: "워크로드 이름",
      align: "left",
      render: (
        workloadName: string,
        { workspaceId, id, revokeWarningCount, isRevoked }: WorkloadListType,
      ) => {
        return (
          <WorkloadNameLink
            workspaceId={workspaceId}
            workloadId={id}
            workloadName={workloadName}
            revokeWarningCount={revokeWarningCount}
            isRevoked={isRevoked}
          />
        );
      },
    },
    {
      dataIndex: "nodeName",
      title: "노드 이름",
      align: "left",
      render: (nodeName: string | null) => {
        return <span>{nodeName ?? "-"}</span>;
      },
    },
    {
      dataIndex: "jobType",
      title: "Job Type",
      align: "center",
      width: 100,
      render: (jobType: WorkloadJobType) => {
        return (
          <ColumnAlignCenterWrap>
            <span
              style={{ textTransform: "capitalize" }}
              data-testid={WORKLOAD_SELECTOR.JOB_TYPE}
            >
              {jobType.toLowerCase()}
            </span>
          </ColumnAlignCenterWrap>
        );
      },
    },
    {
      dataIndex: "creatorName",
      title: "생성자",
      align: "center",
      width: 100,
      render: (creatorName: string) => {
        return (
          <ColumnAlignCenterWrap>
            <span data-testid={WORKLOAD_SELECTOR.CREATOR_NAME}>
              {creatorName}
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
        return (
          <span data-testid={WORKLOAD_SELECTOR.ELAPSED_TIME}>
            {formatElapsedTime(elapsedTime)}
          </span>
        );
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
    {
      dataIndex: "log",
      title: "로그",
      align: "center",
      width: ICON_COLUMN_WIDTH,
      render: (_, { workspaceId, id, status }: WorkloadListType) => {
        // 로그는 실행 중 혹은 종료 상태에서만 접근 가능
        const isActive = status === "RUNNING" || status === "COMPLETED";
        return (
          <WorkloadLogButton
            workspaceId={workspaceId}
            workloadId={id}
            disabled={!isActive}
          />
        );
      },
    },
    {
      dataIndex: "terminal",
      title: "웹터미널",
      align: "center",
      width: ICON_COLUMN_WIDTH,
      render: (_, { workspaceId, id, status }: WorkloadListType) => {
        // 웹터미널은 실행 중 상태에서만 접근 가능
        const isActive = status === "RUNNING";
        return (
          <WorkloadTerminalButton
            workspaceId={workspaceId}
            workloadId={id}
            disabled={!isActive}
          />
        );
      },
    },
    {
      dataIndex: "port",
      title: "포트",
      align: "center",
      width: ICON_COLUMN_WIDTH,
      render: (_, record: WorkloadListType) => {
        // 포트는 실행 중이면서 허브가 아니고 포트가 설정된 경우 활성화
        const isActive =
          record.status === "RUNNING" &&
          record.ports.length > 0 &&
          record.image.type !== "HUB";
        return (
          <ColumnAlignCenterWrap>
            <ColumnIconWrap
              onClick={() => alert("준비 중입니다.")}
              disabled={!isActive}
            >
              <Icon name="Port" color="var(--icon-fill)" size={20} />
            </ColumnIconWrap>
          </ColumnAlignCenterWrap>
        );
      },
    },
    {
      dataIndex: "monitoring",
      title: "모니터링",
      align: "center",
      width: ICON_COLUMN_WIDTH,
      render: (_, { workspaceId, id, status }: WorkloadListType) => {
        // 모니터링은 실행 중 및 종료 상태에서만 접근 가능
        const isActive = status === "RUNNING" || status === "COMPLETED";
        return (
          <WorkloadMonitoringButton
            workspaceId={workspaceId}
            workloadId={id}
            disabled={!isActive}
          />
        );
      },
    },
    {
      dataIndex: "power",
      title: "종료",
      align: "center",
      width: ICON_COLUMN_WIDTH,
      render: (_, record: WorkloadListType) => {
        // 종료 버튼은 종료 상태가 아닐 때에만 활성화
        const isActive = record.status !== "COMPLETED";
        return (
          <StopWorkloadButton workloadId={record.id} disabled={!isActive} />
        );
      },
    },
    {
      dataIndex: "restart",
      title: "재시작",
      align: "center",
      width: ICON_COLUMN_WIDTH,
      render: (_, record: WorkloadListType) => {
        // 재시작 버튼은 종료 상태에만 활성화
        const isActive = record.status === "COMPLETED";
        return (
          <RestartWorkloadButton workloadId={record.id} disabled={!isActive} />
        );
      },
    },
    {
      dataIndex: "delete",
      title: "삭제",
      align: "center",
      width: ICON_COLUMN_WIDTH,
      render: (_, record: WorkloadListType) => {
        // 삭제 버튼은 종료 상태에만 활성화
        const isActive = record.status === "COMPLETED";
        return (
          <DeleteWorkloadButton workloadId={record.id} disabled={!isActive} />
        );
      },
    },
  ];
};

/**
 * 워크로드 관련 테이블 컬럼 생성
 *
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
