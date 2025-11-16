import { format } from "date-fns";
import type { ResponsiveColumnType } from "xiilab-ui";

import { ICON_COLUMN_WIDTH } from "@/constants/common/core.constant";
import type { RequestImageListType } from "@/schemas/request-image.schema";
import type { CoreCreateColumnConfig } from "@/types/common/core.model";
import type { WorkspaceRequestResourceStatus } from "@/types/workspace/workspace.interface";
import { applyColumnConfigs } from "@/utils/common/column.util";
import { ColumnAlignCenterWrap } from "../../../styles/layers/column-layer.styled";
import { ViewApproveRequestImageButton } from "../../request-image/view-approve-request-image-button";
import { ViewRejectRequestImageButton } from "../../request-image/view-reject-request-image-button";
import { ViewRejectReasonButton } from "../buttons/view-reject-reason-button";
import { ViewRequestReasonButton } from "../buttons/view-request-reason-button";
import { WorkspaceRequestResourceStatusText } from "../text/workspace-request-resource-status-text";
import { SecurityTooltip } from "../tooltip/security-tooltip";

const createColumnList = (): ResponsiveColumnType[] => {
  return [
    {
      dataIndex: "imageName",
      title: "이미지 이름",
      align: "left",
    },
    {
      dataIndex: "workspaceName",
      title: "워크스페이스",
      align: "left",
      width: 180,
    },
    {
      dataIndex: "imageTag",
      title: "태그",
      align: "center",
      width: 100,
    },
    {
      dataIndex: "security",
      title: "보안 검사 결과",
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
      dataIndex: "requestReason",
      title: "요청 사유",
      align: "center",
      width: 50,
      render: (requestReason: string) => {
        return <ViewRequestReasonButton reason={requestReason} />;
      },
    },
    {
      dataIndex: "status",
      title: "승인여부",
      align: "center",
      width: 80,
      render: (status: WorkspaceRequestResourceStatus) => {
        return <WorkspaceRequestResourceStatusText status={status} />;
      },
    },
    {
      dataIndex: "rejectReason",
      title: "승인/반려 사유",
      align: "center",
      width: 100,
      render: (rejectReason: string) => {
        return <ViewRejectReasonButton reason={rejectReason} />;
      },
    },
    {
      dataIndex: "creatorName",
      title: "요청자명",
      align: "center",
      width: 70,
    },
    {
      dataIndex: "creatorDate",
      title: "요청날짜",
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
      dataIndex: "reject",
      title: "반려",
      align: "center",
      width: ICON_COLUMN_WIDTH,
      render: (_: unknown, record: RequestImageListType) => {
        return <ViewRejectRequestImageButton requestImage={record} />;
      },
    },
    {
      dataIndex: "approve",
      title: "승인",
      align: "center",
      width: ICON_COLUMN_WIDTH,
      render: (_: unknown, record: RequestImageListType) => {
        return <ViewApproveRequestImageButton requestImage={record} />;
      },
    },
  ];
};

/**
 * 이미지 요청 관련 테이블 컬럼 생성
 *
 * @param config 컬럼 설정 (배열 형태)
 * @returns 컬럼 배열
 *
 * @example
 * // 1. 모든 컬럼 표시 (기본)
 * const columns = createRequestImageColumn();
 *
 * @example
 * // 2. 배열 형태 - 순서 변경 가능
 * const columns = createRequestImageColumn([
 *   { dataIndex: 'imageName' },
 *   { dataIndex: 'imageTag', width: 150 },
 *   { dataIndex: 'status', title: '상태' },
 * ]);
 */
export const createRequestImageColumn = (
  config?: CoreCreateColumnConfig[],
): ResponsiveColumnType[] => {
  const columnList = createColumnList();

  return applyColumnConfigs(columnList, config);
};
