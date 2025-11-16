import { format } from "date-fns";
import type { ResponsiveColumnType } from "xiilab-ui";

import { ViewApproveResourceButton } from "@/components/workspace/request-resource/view-approve-resource-button";
import { ViewRejectResourceButton } from "@/components/workspace/request-resource/view-reject-resource-button";
import type {
  WorkspaceRequestResourceListType,
  WorkspaceRequestResourceMigGpuType,
} from "@/schemas/workspace-request-resource.schema";
import type { WorkspaceRequestResourceStatus } from "@/types/workspace/workspace.interface";
import { ColumnAlignCenterWrap } from "../../../styles/layers/column-layer.styled";
import ViewRejectReasonButton from "../button/view-reject-reason-button";
import ViewRequestReasonButton from "../button/view-request-reason-button";
import WorkspaceRequestResourceStatusText from "../text/workspace-request-resource-status-text";
import ColumnMig from "./column-mig";

export const workspaceRequestResourceColumn: ResponsiveColumnType[] = [
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
    render: (migGpu: WorkspaceRequestResourceMigGpuType) => {
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
    title: "신청일시",
    dataIndex: "regDate",
    align: "center",
    render: (regDate: string) => {
      return <span>{format(regDate, "yyyy.MM.dd")}</span>;
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
    width: 50,
    render: (requestReason: string) => {
      return <ViewRequestReasonButton reason={requestReason} />;
    },
  },
  {
    title: "승인여부",
    dataIndex: "status",
    align: "center",
    width: 80,
    render: (status: WorkspaceRequestResourceStatus) => {
      return <WorkspaceRequestResourceStatusText status={status} />;
    },
  },
  {
    title: "반려사유",
    dataIndex: "rejectReason",
    align: "center",
    width: 50,
    render: (rejectReason: string) => {
      return <ViewRejectReasonButton reason={rejectReason} />;
    },
  },
  {
    title: "반려",
    dataIndex: "id",
    align: "center",
    width: 40,
    render: (_: number, record: WorkspaceRequestResourceListType) => {
      return <ViewRejectResourceButton resource={record} />;
    },
  },
  {
    title: "승인",
    dataIndex: "id",
    align: "center",
    width: 40,
    render: (_: number, record: WorkspaceRequestResourceListType) => {
      return <ViewApproveResourceButton resource={record} />;
    },
  },
];
