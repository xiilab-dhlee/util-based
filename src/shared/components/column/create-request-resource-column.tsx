import { format } from "date-fns";
import type { ResponsiveColumnType } from "xiilab-ui";

import { ViewApproveResourceButton } from "@/domain/request-resource/components/view-approve-resource-button";
import { ViewRejectResourceButton } from "@/domain/request-resource/components/view-reject-resource-button";
import type {
  RequestResourceListType,
  RequestResourceMigGpuType,
} from "@/domain/request-resource/schemas/request-resource.schema";
import type { WorkspaceRequestResourceStatus } from "@/domain/workspace/types/workspace.type";
import type { CoreCreateColumnConfig } from "@/shared/types/core.model";
import { applyColumnConfigs } from "@/shared/utils/column.util";
import { ColumnAlignCenterWrap } from "@/styles/layers/column-layer.styled";
import { ViewRejectReasonButton } from "../button/view-reject-reason-button";
import { ViewRequestReasonButton } from "../button/view-request-reason-button";
import { WorkspaceRequestResourceStatusText } from "../text/workspace-request-resource-status-text";
import { ColumnMig } from "./column-mig";

const createColumnList = (): ResponsiveColumnType[] => {
  return [
    {
      title: "워크스페이스 이름",
      dataIndex: "workspaceName",
      align: "left",
    },
    {
      title: "GPU",
      dataIndex: "gpuReq",
      align: "center",
      width: 70,
      render: (gpuReq: number) => {
        return <ColumnAlignCenterWrap>{gpuReq || 0}개</ColumnAlignCenterWrap>;
      },
    },
    {
      title: "MIG",
      dataIndex: "migGpu",
      align: "center",
      width: 150,
      render: (migGpu: RequestResourceMigGpuType) => {
        return <ColumnMig migProfiles={migGpu} />;
      },
    },
    {
      title: "CPU",
      dataIndex: "cpuReq",
      align: "center",
      width: 70,
      render: (cpuReq: number) => {
        return <ColumnAlignCenterWrap>{cpuReq || 0}Core</ColumnAlignCenterWrap>;
      },
    },
    {
      title: "MEM",
      dataIndex: "memReq",
      align: "center",
      width: 70,
      render: (memReq: string) => {
        return <ColumnAlignCenterWrap>{memReq || 0}GB</ColumnAlignCenterWrap>;
      },
    },
    {
      title: "확정일시",
      dataIndex: "modDate",
      align: "center",
      render: (modDate: string) => {
        return <span>{modDate ? format(modDate, "yyyy.MM.dd") : "-"}</span>;
      },
    },
    {
      title: "신청자",
      dataIndex: "requester",
      align: "center",
    },
    {
      title: "신청사유",
      dataIndex: "requestReason",
      align: "center",
      width: 70,
      render: (requestReason: string) => {
        return <ViewRequestReasonButton reason={requestReason} />;
      },
    },
    {
      title: "승인여부",
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
      render: (rejectReason: string) => {
        return <ViewRejectReasonButton reason={rejectReason} />;
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
