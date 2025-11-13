import { format } from "date-fns";
import type { ResponsiveColumnType } from "xiilab-ui";

import type { RequestImageListType } from "@/schemas/request-image.schema";
import type { WorkspaceRequestResourceStatus } from "@/types/workspace/workspace.interface";
import { ColumnAlignCenterWrap } from "../../styles/layers/column-layer.styled";
import ViewRejectReasonButton from "../common/buttons/view-reject-reason-button";
import ViewRequestReasonButton from "../common/buttons/view-request-reason-button";
import WorkspaceRequestResourceStatusText from "../common/text/workspace-request-resource-status-text";
import SecurityTooltip from "../common/tooltip/security-tooltip";
import ViewApproveRequestImageButton from "./view-approve-request-image-button";
import ViewRejectRequestImageButton from "./view-reject-request-image-button";

const ICON_COLUMN_WIDTH = 40;

/**
 * 이미지 요청 목록 컬럼 정의
 * @param visibleDataIndexes 표시할 dataIndex 목록 (선택적). 지정하지 않으면 모든 컬럼 표시
 * @returns 필터링된 컬럼 배열
 *
 * @example
 * // 모든 컬럼 표시
 * createRequestImageListColumn()
 *
 * @example
 * // 특정 컬럼만 표시
 * createRequestImageListColumn(['imageName', 'imageTag', 'status'])
 */
export const createRequestImageListColumn = (
  visibleDataIndexes?: string[],
): ResponsiveColumnType[] => {
  const allColumns: ResponsiveColumnType[] = [
    {
      title: "이미지 이름",
      dataIndex: "imageName",
      align: "left",
    },
    {
      title: "워크스페이스",
      dataIndex: "workspaceName",
      align: "left",
      width: 180,
    },
    {
      title: "태그",
      dataIndex: "imageTag",
      align: "center",
      width: 100,
    },
    {
      title: "보안 검사 결과",
      dataIndex: "security",
      align: "center",
      width: 100,
      render: (_: unknown, record: RequestImageListType) => {
        return (
          <ColumnAlignCenterWrap>
            <SecurityTooltip
              critical={record.critical}
              high={record.high}
              medium={record.medium}
              low={record.low}
            />
          </ColumnAlignCenterWrap>
        );
      },
    },
    {
      title: "요청 사유",
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
      title: "승인/반려 사유",
      dataIndex: "rejectReason",
      align: "center",
      width: 100,
      render: (rejectReason: string) => {
        return <ViewRejectReasonButton reason={rejectReason} />;
      },
    },
    {
      title: "요청자명",
      dataIndex: "creatorName",
      align: "center",
      width: 70,
    },
    {
      title: "요청날짜",
      dataIndex: "creatorDate",
      align: "center",
      width: 140,
      render: (creatorDate: string) => {
        return (
          <ColumnAlignCenterWrap>
            {format(creatorDate, "yyyy-MM-dd HH:mm:ss")}
          </ColumnAlignCenterWrap>
        );
      },
    },
    {
      title: "반려",
      dataIndex: "reject",
      align: "center",
      width: ICON_COLUMN_WIDTH,
      render: (_: unknown, record: RequestImageListType) => {
        return <ViewRejectRequestImageButton requestImage={record} />;
      },
    },
    {
      title: "승인",
      dataIndex: "approve",
      align: "center",
      width: ICON_COLUMN_WIDTH,
      render: (_: unknown, record: RequestImageListType) => {
        return <ViewApproveRequestImageButton requestImage={record} />;
      },
    },
  ];

  // visibleDataIndexes가 제공되지 않으면 모든 컬럼 반환
  if (!visibleDataIndexes || visibleDataIndexes.length === 0) {
    return allColumns;
  }

  // visibleDataIndexes에 포함된 dataIndex를 가진 컬럼만 필터링
  return allColumns.filter((column) => {
    if (!column.dataIndex) return false;
    return visibleDataIndexes.includes(column.dataIndex as string);
  });
};

