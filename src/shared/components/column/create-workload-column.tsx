import type { ResponsiveColumnType } from "xiilab-ui";
import { Icon } from "xiilab-ui";

import {
  type ActiveWorkloadItem,
  type ActiveWorkloadItemWorkloadJobType,
  type ActiveWorkloadItemWorkloadStatus,
  type TerminatedWorkloadItem,
  WorkloadStatusResponseWorkloadStatus,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { SelectWorkloadRadio } from "@/domain/workload/components/create/select-workload-radio";
import { DeleteWorkloadButton } from "@/domain/workload/components/list/delete-workload-button";
import { RestartWorkloadButton } from "@/domain/workload/components/list/restart-workload-button";
import { StopWorkloadButton } from "@/domain/workload/components/list/stop-workload-button";
import { WorkloadLogButton } from "@/domain/workload/components/list/workload-log-button";
import { WorkloadMonitoringButton } from "@/domain/workload/components/list/workload-monitoring-button";
import { WorkloadNameLink } from "@/domain/workload/components/list/workload-name-link";
import { WorkloadTerminalButton } from "@/domain/workload/components/list/workload-terminal-button";
import {
  type ActiveWorkloadSortState,
  type DisabledWorkloadSortState,
  getJobTypeLabel,
} from "@/domain/workload/constants/workload.constant";
import {
  getWorkloadActionStates,
  type WorkloadActionStates,
} from "@/domain/workload/utils/workload.util";
import { WorkloadStatusText } from "@/shared/components/text/workload-status-text";
import { WORKLOAD_SELECTOR } from "@/shared/constants/selector.constant";
import type { CoreCreateColumnConfig } from "@/shared/types/core.model";
import { applyColumnConfigs } from "@/shared/utils/column.util";
import {
  formatDateTimeSafely,
  formatElapsedTimeFromSeconds,
} from "@/shared/utils/date.util";
import { getColumnSortOrder } from "@/shared/utils/sort.util";
import {
  ColumnAlignCenterWrap,
  ColumnIconWrap,
} from "@/styles/layers/column-layer.styled";

// ============================================================================
// Shared Column Factory Functions
// ============================================================================

type WorkloadItemBase = ActiveWorkloadItem | TerminatedWorkloadItem;
type WorkloadJobType = WorkloadItemBase["workloadJobType"];

/**
 * 공통 컬럼 생성 팩토리 함수
 * 활성화/비활성화 워크로드 리스트에서 공통으로 사용되는 컬럼들을 생성
 */
const createSharedColumns = <
  T extends WorkloadItemBase,
  TSortState extends ActiveWorkloadSortState | DisabledWorkloadSortState,
>(
  workspaceId: number | undefined,
  getActionStates: (record?: T) => WorkloadActionStates,
  sort?: TSortState,
) => ({
  workloadName: (): ResponsiveColumnType => ({
    key: "workloadName",
    dataIndex: "workloadName",
    title: "워크로드 이름",
    align: "left",
    width: "24%",
    sorter: true,
    sortOrder: sort ? getColumnSortOrder(sort, "workloadName") : undefined,
    render: (workloadName: string, record: T) => {
      if (!workspaceId) return <span>{workloadName || "-"}</span>;

      return (
        <WorkloadNameLink
          workspaceId={workspaceId}
          workloadId={record.workloadResourceName}
          workloadName={workloadName}
          reclaimWarningCount={record.reclaimWarningCount}
          reclaimStatus={record.reclaimStatus}
        />
      );
    },
  }),

  jobType: (): ResponsiveColumnType => ({
    key: "jobType",
    dataIndex: "workloadJobType",
    title: "Job Type",
    align: "center",
    width: "8%",
    render: (jobType: WorkloadJobType) => (
      <ColumnAlignCenterWrap>
        <span data-testid={WORKLOAD_SELECTOR.JOB_TYPE}>
          {getJobTypeLabel(jobType)}
        </span>
      </ColumnAlignCenterWrap>
    ),
  }),

  creator: (): ResponsiveColumnType => ({
    key: "creatorName",
    dataIndex: "creatorName",
    title: "생성자",
    align: "center",
    width: "10%",
    render: (creatorName: string) => (
      <ColumnAlignCenterWrap>
        <span data-testid={WORKLOAD_SELECTOR.CREATOR_NAME}>{creatorName}</span>
      </ColumnAlignCenterWrap>
    ),
  }),

  log: (): ResponsiveColumnType => ({
    key: "log",
    title: "로그",
    align: "center",
    width: "5%",
    render: (_, record: T) => {
      if (!workspaceId) return null;

      const { canAccessLog } = getActionStates(record);
      return (
        <WorkloadLogButton
          workspaceId={workspaceId}
          workloadId={record.workloadResourceName}
          disabled={!canAccessLog}
        />
      );
    },
  }),

  monitoring: (): ResponsiveColumnType => ({
    key: "monitoring",
    title: "모니터링",
    align: "center",
    width: "5%",
    render: (_, record: T) => {
      if (!workspaceId) return null;

      const { canAccessMonitoring } = getActionStates(record);

      return (
        <WorkloadMonitoringButton
          workspaceId={workspaceId}
          workloadId={record.workloadResourceName}
          disabled={!canAccessMonitoring}
        />
      );
    },
  }),

  restart: (): ResponsiveColumnType => ({
    key: "restart",
    title: "재시작",
    align: "center",
    width: "5%",
    render: (_, record: T) => {
      const { canRestart } = getActionStates(record);

      return (
        <RestartWorkloadButton
          workloadId={record.workloadResourceName}
          disabled={!canRestart}
        />
      );
    },
  }),

  delete: (): ResponsiveColumnType => ({
    key: "delete",
    title: "삭제",
    align: "center",
    width: "5%",
    render: (_, record: T) => {
      const { canDelete } = getActionStates(record);

      return (
        <DeleteWorkloadButton
          workloadId={record.workloadResourceName}
          disabled={!canDelete}
        />
      );
    },
  }),
});

const createColumnList = (
  workspaceId?: number,
  sort?: ActiveWorkloadSortState,
): ResponsiveColumnType[] => {
  const getActionStates = (record: ActiveWorkloadItem) =>
    getWorkloadActionStates(record.workloadStatus);

  return [
    {
      key: "select",
      title: "선택",
      align: "center",
      width: "5%",
      render: (_, record: ActiveWorkloadItem) => {
        return <SelectWorkloadRadio workloadId={record.workloadResourceName} />;
      },
    },
    {
      key: "workloadName",
      dataIndex: "workloadName",
      title: "워크로드 이름",
      align: "left",
      width: "24%",
      sorter: true,
      sortOrder: sort ? getColumnSortOrder(sort, "workloadName") : undefined,
      render: (workloadName: string, record: ActiveWorkloadItem) => {
        if (!workspaceId) return <span>{workloadName || "-"}</span>;

        return (
          <WorkloadNameLink
            workspaceId={workspaceId}
            workloadId={record.workloadResourceName}
            workloadName={workloadName}
            reclaimWarningCount={record.reclaimWarningCount}
            reclaimStatus={record.reclaimStatus}
          />
        );
      },
    },
    {
      key: "jobType",
      dataIndex: "workloadJobType",
      title: "Job Type",
      align: "center",
      width: "8%",
      render: (jobType: ActiveWorkloadItemWorkloadJobType) => {
        return (
          <ColumnAlignCenterWrap>
            <span data-testid={WORKLOAD_SELECTOR.JOB_TYPE}>
              {getJobTypeLabel(jobType)}
            </span>
          </ColumnAlignCenterWrap>
        );
      },
    },
    {
      key: "creatorName",
      dataIndex: "creatorName",
      title: "생성자",
      align: "center",
      width: "10%",
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
      key: "ageSeconds",
      dataIndex: "ageSeconds",
      title: "경과 시간",
      align: "center",
      width: "12%",
      sorter: true,
      sortOrder: sort ? getColumnSortOrder(sort, "ageSeconds") : undefined,
      render: (ageSeconds: number) => {
        return (
          <span data-testid={WORKLOAD_SELECTOR.ELAPSED_TIME}>
            {formatElapsedTimeFromSeconds(ageSeconds)}
          </span>
        );
      },
    },
    {
      key: "status",
      dataIndex: "workloadStatus",
      title: "상태",
      align: "center",
      width: "6%",
      render: (status: ActiveWorkloadItemWorkloadStatus) => {
        return (
          <ColumnAlignCenterWrap>
            <WorkloadStatusText status={status} />
          </ColumnAlignCenterWrap>
        );
      },
    },
    {
      key: "log",
      title: "로그",
      align: "center",
      width: "5%",
      render: (_, record: ActiveWorkloadItem) => {
        if (!workspaceId) return null;

        const { canAccessLog } = getActionStates(record);
        return (
          <WorkloadLogButton
            workspaceId={workspaceId}
            workloadId={record.workloadResourceName}
            disabled={!canAccessLog}
          />
        );
      },
    },
    {
      key: "terminal",
      title: "웹터미널",
      align: "center",
      width: "5%",
      render: (_, record: ActiveWorkloadItem) => {
        if (!workspaceId) return null;

        const { canAccessTerminal } = getActionStates(record);

        return (
          <WorkloadTerminalButton
            workspaceId={workspaceId}
            workloadId={record.workloadResourceName}
            disabled={!canAccessTerminal}
          />
        );
      },
    },
    {
      key: "port",
      title: "연결",
      align: "center",
      width: "5%",
      render: (_, record: ActiveWorkloadItem) => {
        const { canAccessPort } = getActionStates(record);
        const canUsePort = canAccessPort && record.connection.length > 0;

        return (
          <ColumnAlignCenterWrap>
            <ColumnIconWrap
              onClick={() => alert("준비 중입니다.")}
              disabled={!canUsePort}
            >
              <Icon name="Port" color="var(--icon-fill)" size={20} />
            </ColumnIconWrap>
          </ColumnAlignCenterWrap>
        );
      },
    },
    {
      key: "monitoring",
      title: "모니터링",
      align: "center",
      width: "5%",
      render: (_, record: ActiveWorkloadItem) => {
        if (!workspaceId) return null;

        const { canAccessMonitoring } = getActionStates(record);

        return (
          <WorkloadMonitoringButton
            workspaceId={workspaceId}
            workloadId={record.workloadResourceName}
            disabled={!canAccessMonitoring}
          />
        );
      },
    },
    {
      key: "power",
      title: "종료",
      align: "center",
      width: "5%",
      render: (_, record: ActiveWorkloadItem) => {
        const { canStop } = getActionStates(record);

        return (
          <StopWorkloadButton
            workloadId={record.workloadResourceName}
            disabled={!canStop}
          />
        );
      },
    },
  ];
};

export const createWorkloadColumn = (
  config?: CoreCreateColumnConfig[],
  workspaceId?: number,
  sort?: ActiveWorkloadSortState,
): ResponsiveColumnType[] => {
  const columnList = createColumnList(workspaceId, sort);

  return applyColumnConfigs(columnList, config);
};

const createDisabledColumnList = (
  workspaceId?: number,
  sort?: DisabledWorkloadSortState,
): ResponsiveColumnType[] => {
  // 종료된 워크로드 목록은 항상 TERMINATED 상태
  // API endpoint: GET /workloads/terminated (종료 완료된 워크로드만 반환)
  const getActionStates = (record?: TerminatedWorkloadItem) => {
    return getWorkloadActionStates(
      WorkloadStatusResponseWorkloadStatus.TERMINATED,
    );
  };

  // 공용 컬럼 생성
  const shared = createSharedColumns<
    TerminatedWorkloadItem,
    DisabledWorkloadSortState
  >(workspaceId, getActionStates, sort);

  return [
    // 공용 컬럼 (Active & Disabled 공통)
    shared.workloadName(),
    shared.jobType(),
    shared.creator(),

    // Disabled 전용 컬럼
    {
      key: "terminatedAt",
      dataIndex: "terminatedAt",
      title: "종료 일시",
      align: "center",
      width: "12%",
      sorter: true,
      sortOrder: sort ? getColumnSortOrder(sort, "terminatedAt") : undefined,
      render: (terminatedAt?: string) => (
        <ColumnAlignCenterWrap>
          <span>{formatDateTimeSafely(terminatedAt)}</span>
        </ColumnAlignCenterWrap>
      ),
    },

    // 공용 컬럼 (Active & Disabled 공통)
    shared.log(),
    shared.monitoring(),
    shared.restart(),
    shared.delete(),
  ];
};

export const createDisabledWorkloadColumn = (
  config?: CoreCreateColumnConfig[],
  workspaceId?: number,
  sort?: DisabledWorkloadSortState,
): ResponsiveColumnType[] => {
  const columnList = createDisabledColumnList(workspaceId, sort);
  return applyColumnConfigs(columnList, config);
};
