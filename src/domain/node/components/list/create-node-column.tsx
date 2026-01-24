import type { ResponsiveColumnType } from "xiilab-ui";

import type { ClusterNodeListResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { NodeListIp } from "@/domain/node/components/list/node-list-ip";
import { NodeLogButton } from "@/domain/node/components/list/node-log-button";
import { NodeMigButton } from "@/domain/node/components/list/node-mig-button";
import { NodeScheduleSwitch } from "@/domain/node/components/list/node-schedule-switch";
import { NodeStatusText } from "@/shared/components/text/node-status-text";
import type { CoreCreateColumnConfig } from "@/shared/types/core.model";
import { applyColumnConfigs } from "@/shared/utils/column.util";
import { formatElapsedTime } from "@/shared/utils/date.util";
import {
  ColumnAlignCenterWrap,
  ColumnAlignLeftWrap,
  ColumnLink,
} from "@/styles/layers/column-layer.styled";

const createColumnList = (): ResponsiveColumnType[] => {
  return [
    {
      key: "index",
      dataIndex: "index",
      title: "NO.",
      align: "center",
      render: (_: unknown, __: unknown, index: number) => {
        return <span>{index + 1}</span>;
      },
    },
    {
      key: "nodeName",
      dataIndex: "nodeName",
      title: "노드 이름",
      align: "left",
      render: (nodeName: string, record: ClusterNodeListResponse) => {
        // isScheduling이 true이면 노드가 정상 동작 중
        const status = record.isScheduling ?? true;
        return (
          <ColumnLink href={`/admin/node/${nodeName}`}>
            <NodeStatusText status={status} text={nodeName} />
          </ColumnLink>
        );
      },
    },
    {
      key: "nodeIp",
      dataIndex: "nodeIp",
      title: "IP 주소",
      align: "left",
      render: (nodeIp: string, record: ClusterNodeListResponse) => {
        // MIG 활성화 여부에 따라 타입 결정
        let type = "NONE";
        if (record.migConfigState === "READY") {
          type = "MIG";
        }
        // TODO: MPS 상태 확인 로직 추가 필요
        return (
          <ColumnAlignLeftWrap>
            <NodeListIp ip={nodeIp} type={type} />
          </ColumnAlignLeftWrap>
        );
      },
    },
    {
      key: "gpuType",
      dataIndex: "gpuType",
      title: "GPU 타입",
      align: "left",
      render: (gpuType: string | undefined) => {
        return <span>{gpuType || "-"}</span>;
      },
    },
    {
      key: "gpuCount",
      dataIndex: "gpuCount",
      title: "GPU",
      align: "center",
    },
    {
      key: "gpuUtilizationPercent",
      dataIndex: "gpuUtilizationPercent",
      title: "GPU 사용량",
      align: "center",
      render: (gpuUtilizationPercent: number | undefined) => {
        return (
          <ColumnAlignCenterWrap>
            {gpuUtilizationPercent != null ? `${gpuUtilizationPercent}%` : "-"}
          </ColumnAlignCenterWrap>
        );
      },
    },
    {
      key: "cpuUtilizationPercent",
      dataIndex: "cpuUtilizationPercent",
      title: "CPU",
      align: "center",
      render: (cpuUtilizationPercent: number | undefined) => {
        return (
          <ColumnAlignCenterWrap>
            {cpuUtilizationPercent != null ? `${cpuUtilizationPercent}%` : "-"}
          </ColumnAlignCenterWrap>
        );
      },
    },
    {
      key: "memoryUtilizationPercent",
      dataIndex: "memoryUtilizationPercent",
      title: "Memory",
      align: "center",
      render: (memoryUtilizationPercent: number | undefined) => {
        return (
          <ColumnAlignCenterWrap>
            {memoryUtilizationPercent != null
              ? `${memoryUtilizationPercent}%`
              : "-"}
          </ColumnAlignCenterWrap>
        );
      },
    },
    {
      key: "diskUtilizationPercent",
      dataIndex: "diskUtilizationPercent",
      title: "Disk",
      align: "center",
      render: (diskUtilizationPercent: number | undefined) => {
        return (
          <ColumnAlignCenterWrap>
            {diskUtilizationPercent != null
              ? `${diskUtilizationPercent}%`
              : "-"}
          </ColumnAlignCenterWrap>
        );
      },
    },
    {
      key: "createdAt",
      dataIndex: "createdAt",
      title: "경과 시간",
      align: "left",
      render: (createdAt: string | undefined) => {
        if (!createdAt) {
          return <span>-</span>;
        }
        return <span>{formatElapsedTime(createdAt)}</span>;
      },
    },
    {
      key: "isScheduling",
      dataIndex: "isScheduling",
      title: "스케줄링",
      align: "center",
      render: (isScheduling: boolean, record: ClusterNodeListResponse) => {
        return (
          <ColumnAlignCenterWrap>
            <NodeScheduleSwitch
              nodeName={record.nodeName}
              schedulable={isScheduling}
            />
          </ColumnAlignCenterWrap>
        );
      },
    },
    {
      key: "gpuDivision",
      dataIndex: "nodeName",
      title: "GPU 분할",
      align: "center",
      render: (nodeName: string, record: ClusterNodeListResponse) => {
        // GPU가 있는 경우에만 MIG 버튼 표시
        // migConfigState가 PENDING인 경우 버튼 비활성화
        const component =
          record.gpuCount > 0 ? (
            <NodeMigButton
              nodeName={nodeName}
              disabled={
                record.migConfigState === "PENDING" ||
                record.migConfigState === "NOT_SUPPORTED"
              }
            />
          ) : (
            <span>-</span>
          );
        return <ColumnAlignCenterWrap>{component}</ColumnAlignCenterWrap>;
      },
    },
    {
      key: "activity",
      dataIndex: "nodeName",
      title: "Activity",
      align: "center",
      render: (nodeName: string) => {
        return (
          <ColumnAlignCenterWrap>
            <NodeLogButton nodeName={nodeName} />
          </ColumnAlignCenterWrap>
        );
      },
    },
  ];
};

/**
 * 노드 목록 테이블 컬럼 생성
 *
 * @param config 컬럼 설정 (배열 형태)
 * @returns 컬럼 배열
 *
 * @example
 * // 1. 모든 컬럼 표시 (기본)
 * const columns = createNodeColumn();
 *
 * @example
 * // 2. 배열 형태 - 순서 변경 및 커스텀 설정
 * const columns = createNodeColumn([
 *   { key: 'nodeName' },
 *   { key: 'nodeIp', width: 160 },
 *   { key: 'gpuCount', title: 'GPU 개수' },
 * ]);
 */
export const createNodeColumn = (
  config?: CoreCreateColumnConfig[],
): ResponsiveColumnType[] => {
  const columnList = createColumnList();

  return applyColumnConfigs(columnList, config);
};
