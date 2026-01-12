import type { ResponsiveColumnType } from "xiilab-ui";

import type { MigProfileResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { ViewApproveResourceButton } from "@/domain/request-resource/components/view-approve-resource-button";
import { ViewRejectResourceButton } from "@/domain/request-resource/components/view-reject-resource-button";
import { REQUEST_RESOURCE_STATUS } from "@/domain/request-resource/constants/request-resource.constant";
import type { RequestResourceListType } from "@/domain/request-resource/schemas/request-resource.schema";
import type { WorkspaceRequestResourceStatus } from "@/domain/workspace/types/workspace.type";
import { ViewRejectReasonButton } from "@/shared/components/button/view-reject-reason-button";
import { ViewRequestReasonButton } from "@/shared/components/button/view-request-reason-button";
import { WorkspaceRequestResourceStatusText } from "@/shared/components/text/workspace-request-resource-status-text";
import type { CoreCreateColumnConfig } from "@/shared/types/core.model";
import { applyColumnConfigs } from "@/shared/utils/column.util";
import { formatDateTimeSafely } from "@/shared/utils/date.util";
import { getResourceInfo } from "@/shared/utils/resource.util";
import { ColumnAlignCenterWrap } from "@/styles/layers/column-layer.styled";
import { ColumnMig } from "./column-mig";

const createColumnList = (): ResponsiveColumnType[] => {
  const gpuInfo = getResourceInfo("GPU");
  const migInfo = getResourceInfo("MIG");
  const mpsInfo = getResourceInfo("MPS");
  const cpuInfo = getResourceInfo("CPU");
  const memInfo = getResourceInfo("MEM");

  return [
    {
      title: "워크스페이스 이름",
      dataIndex: "workspaceName",
      align: "left",
    },
    {
      title: gpuInfo.text,
      dataIndex: "gpuReq",
      align: "center",
      width: 70,
      render: (gpuReq: number | null | undefined) => {
        const safeGpuReq = gpuReq ?? 0;

        return (
          <ColumnAlignCenterWrap>
            {safeGpuReq}
            {gpuInfo.unit}
          </ColumnAlignCenterWrap>
        );
      },
    },
    {
      title: migInfo.text,
      dataIndex: "migGpu",
      align: "center",
      width: 150,
      render: (migGpu: MigProfileResponse[]) => {
        return <ColumnMig migProfiles={migGpu} />;
      },
    },
    {
      title: mpsInfo.text,
      dataIndex: "mpsReq",
      align: "center",
      width: 70,
      render: (mpsReq: number | null | undefined) => {
        const safeMpsReq = mpsReq ?? 0;

        return (
          <ColumnAlignCenterWrap>
            {safeMpsReq}
            {mpsInfo.unit}
          </ColumnAlignCenterWrap>
        );
      },
    },
    {
      title: cpuInfo.text,
      dataIndex: "cpuReq",
      align: "center",
      width: 70,
      render: (cpuReq: number | null | undefined) => {
        const safeCpuReq = cpuReq ?? 0;

        return (
          <ColumnAlignCenterWrap>
            {safeCpuReq}
            {cpuInfo.unit}
          </ColumnAlignCenterWrap>
        );
      },
    },
    {
      title: memInfo.text,
      dataIndex: "memReq",
      align: "center",
      width: 70,
      render: (memReq: number | null | undefined) => {
        const safeMemReq = memReq ?? 0;

        return (
          <ColumnAlignCenterWrap>
            {safeMemReq}
            {memInfo.unit}
          </ColumnAlignCenterWrap>
        );
      },
    },
    {
      title: "확정일시",
      dataIndex: "modDate",
      align: "center",
      render: (modDate: string) => {
        return <span>{formatDateTimeSafely(modDate) ?? "-"}</span>;
      },
    },
    {
      title: "요청자",
      dataIndex: "requester",
      align: "center",
    },
    {
      title: "요청사유",
      dataIndex: "requestReason",
      align: "center",
      width: 70,
      render: (requestReason: string) => {
        return <ViewRequestReasonButton reason={requestReason} />;
      },
    },
    {
      title: "승인 여부",
      dataIndex: "status",
      align: "center",
      width: 70,
      render: (status: WorkspaceRequestResourceStatus) => {
        return <WorkspaceRequestResourceStatusText status={status} />;
      },
    },
    {
      title: "반려사유",
      dataIndex: "rejectReason",
      align: "center",
      width: 70,
      render: (rejectReason: string, record: RequestResourceListType) => {
        const isRejected = record.status === REQUEST_RESOURCE_STATUS.REJECT;
        return (
          <ViewRejectReasonButton
            reason={rejectReason}
            disabled={!isRejected}
          />
        );
      },
    },
    {
      title: "반려",
      dataIndex: "reject",
      align: "center",
      width: 50,
      render: (_: number, record: RequestResourceListType) => {
        return <ViewRejectResourceButton resource={record} />;
      },
    },
    {
      title: "승인",
      dataIndex: "approve",
      align: "center",
      width: 50,
      render: (_: number, record: RequestResourceListType) => {
        return <ViewApproveResourceButton resource={record} />;
      },
    },
  ];
};

/**
 * 자원 요청 관련 테이블 컬럼 생성
 *
 * @param config 컬럼 설정 (배열 형태)
 * @returns 컬럼 배열
 */
export const createRequestResourceColumn = (
  config?: CoreCreateColumnConfig[],
): ResponsiveColumnType[] => {
  const columnList = createColumnList();

  return applyColumnConfigs(columnList, config);
};
