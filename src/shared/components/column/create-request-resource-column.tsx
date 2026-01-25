import type { ResponsiveColumnType } from "xiilab-ui";

import type { AdminResourceRequestListResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { ViewApproveResourceButton } from "@/domain/request-resource/components/view-approve-resource-button";
import { ViewRejectResourceButton } from "@/domain/request-resource/components/view-reject-resource-button";
import {
  REQUEST_RESOURCE_STATUS,
  type RequestResourceSortState,
} from "@/domain/request-resource/constants/request-resource.constant";
import type { WorkspaceRequestResourceStatus } from "@/domain/workspace/types/workspace.type";
import { ViewRejectReasonButton } from "@/shared/components/button/view-reject-reason-button";
import { ViewRequestReasonButton } from "@/shared/components/button/view-request-reason-button";
import { WorkspaceRequestResourceStatusText } from "@/shared/components/text/workspace-request-resource-status-text";
import { formatDateTimeSafely } from "@/shared/utils/date.util";
import { formatNumberWithUnit } from "@/shared/utils/format.util";
import { convertBytes, getResourceInfo } from "@/shared/utils/resource.util";
import { getColumnSortOrder } from "@/shared/utils/sort.util";
import { ColumnAlignCenterWrap } from "@/styles/layers/column-layer.styled";
import { ColumnMig } from "./column-mig";

const createColumnList = (
  sort: RequestResourceSortState,
): ResponsiveColumnType<AdminResourceRequestListResponse>[] => {
  const gpuInfo = getResourceInfo("GPU");
  const migInfo = getResourceInfo("MIG");
  const cpuInfo = getResourceInfo("CPU");
  const memInfo = getResourceInfo("MEM");

  return [
    {
      title: "워크스페이스 이름",
      key: "workspaceName",
      dataIndex: "workspaceName",
      align: "left",
      width: "20%",
      ellipsis: true,
      sorter: true,
      sortOrder: getColumnSortOrder(sort, "workspaceName"),
    },

    {
      title: migInfo.text,
      key: "migGpu",
      align: "center",
      width: "12%",
      render: (_: unknown, record: AdminResourceRequestListResponse) => {
        const migProfiles = record.resource.gpu?.detail.mig ?? [];
        return <ColumnMig migProfiles={migProfiles} />;
      },
    },

    {
      title: gpuInfo.text,
      key: "gpuReq",
      align: "center",
      width: "6%",
      render: (_: unknown, record: AdminResourceRequestListResponse) => {
        const gpuCount = record.resource.gpu?.detail.normal?.requestCount ?? 0;

        return (
          <ColumnAlignCenterWrap>
            {formatNumberWithUnit(gpuCount, gpuInfo.unit)}
          </ColumnAlignCenterWrap>
        );
      },
    },
    {
      title: cpuInfo.text,
      key: "cpuReq",
      align: "center",
      width: "6%",
      render: (_: unknown, record: AdminResourceRequestListResponse) => {
        const cpuCore = record.resource.cpu.requestCore;

        return (
          <ColumnAlignCenterWrap>
            {formatNumberWithUnit(cpuCore, cpuInfo.unit)}
          </ColumnAlignCenterWrap>
        );
      },
    },
    {
      title: memInfo.text,
      key: "memReq",
      align: "center",
      width: "10%",
      render: (_: unknown, record: AdminResourceRequestListResponse) => {
        const memoryBytes = record.resource.memory.requestByte;
        const { label } = convertBytes(memoryBytes, "GB");

        return <ColumnAlignCenterWrap>{label}</ColumnAlignCenterWrap>;
      },
    },
    {
      title: "요청일시",
      key: "requestedAt",
      dataIndex: "requestedAt",
      align: "left",
      width: "12%",
      sortOrder: getColumnSortOrder(sort, "requestedAt"),
      sorter: true,
      render: (requestedAt: string | undefined) => {
        return <span>{formatDateTimeSafely(requestedAt)}</span>;
      },
    },
    {
      title: "확정일시",
      key: "approvedAt",
      dataIndex: "approvedAt",
      align: "left",
      width: "12%",
      render: (approvedAt: string | undefined) => {
        return <span>{formatDateTimeSafely(approvedAt)}</span>;
      },
    },
    {
      title: "요청자",
      key: "creatorName",
      dataIndex: "creatorName",
      align: "left",
      width: "10%",
      ellipsis: true,
      render: (creatorName: string) => {
        return <span>{creatorName || "-"}</span>;
      },
    },
    {
      title: "요청사유",
      key: "requestReason",
      dataIndex: "requestReason",
      align: "center",
      width: "8%",
      render: (requestReason: string) => {
        return <ViewRequestReasonButton reason={requestReason} />;
      },
    },
    {
      title: "승인 여부",
      key: "status",
      dataIndex: "approvalStatus",
      align: "center",
      width: "5%",
      render: (status: WorkspaceRequestResourceStatus) => {
        return <WorkspaceRequestResourceStatusText status={status} />;
      },
    },
    {
      title: "반려사유",
      key: "rejectReason",
      dataIndex: "rejectReason",
      align: "center",
      width: "5%",
      render: (
        rejectReason: string,
        record: AdminResourceRequestListResponse,
      ) => {
        const isRejected =
          record.approvalStatus === REQUEST_RESOURCE_STATUS.REJECTED;
        return (
          <ViewRejectReasonButton
            reason={rejectReason}
            disabled={!isRejected}
          />
        );
      },
    },
    {
      title: "승인",
      key: "approve",
      dataIndex: "approve",
      align: "center",
      width: "3%",
      render: (_: number, record: AdminResourceRequestListResponse) => {
        return <ViewApproveResourceButton resource={record} />;
      },
    },
    {
      title: "반려",
      key: "reject",
      dataIndex: "reject",
      align: "center",
      width: "3%",
      render: (_: number, record: AdminResourceRequestListResponse) => {
        return <ViewRejectResourceButton resource={record} />;
      },
    },
  ];
};

/**
 * 자원 요청 관련 테이블 컬럼 생성
 *
 * @param sort 정렬 상태 (field, order)
 * @returns 컬럼 배열
 */
export const createRequestResourceColumn = (
  sort: RequestResourceSortState,
): ResponsiveColumnType<AdminResourceRequestListResponse>[] => {
  return createColumnList(sort);
};
