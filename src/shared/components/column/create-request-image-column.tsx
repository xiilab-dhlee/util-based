import type { ResponsiveColumnType } from "xiilab-ui";

import type {
  ImageTagUsageRequestResponse,
  ImageTagUsageRequestResponseApprovalStatus,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { ViewApproveRequestImageButton } from "@/domain/request-image/components/view-approve-request-image-button";
import { ViewRejectRequestImageButton } from "@/domain/request-image/components/view-reject-request-image-button";
import { ViewDecisionReasonButton } from "@/shared/components/button/view-decision-reason-button";
import { ViewRequestReasonButton } from "@/shared/components/button/view-request-reason-button";
import { ImageTagUsageRequestStatusText } from "@/shared/components/text/image-tag-usage-request-status-text";
import { VulnerabilityTooltip } from "@/shared/components/tooltip/vulnerability-tooltip";
import type { CoreCreateColumnConfig } from "@/shared/types/core.model";
import { applyColumnConfigs } from "@/shared/utils/column.util";
import { formatDateTimeSafely } from "@/shared/utils/date.util";
import { ColumnAlignCenterWrap } from "@/styles/layers/column-layer.styled";

const createColumnList = (): ResponsiveColumnType[] => {
  return [
    {
      key: "imageDisplayName",
      dataIndex: "imageDisplayName",
      title: "이미지 이름",
      align: "left",
      render: (imageDisplayName: string) => {
        return <span>{imageDisplayName || "-"}</span>;
      },
    },
    {
      key: "workspaceName",
      dataIndex: "workspaceName",
      title: "워크스페이스",
      align: "left",
      render: (workspaceName: string) => {
        return <span>{workspaceName || "-"}</span>;
      },
    },
    {
      key: "imageTagName",
      dataIndex: "imageTagName",
      title: "태그",
      align: "left",
      render: (imageTagName: string) => {
        return <span>{imageTagName || "-"}</span>;
      },
    },
    {
      key: "vulnerability",
      dataIndex: "vulnerability",
      title: "보안 검사 결과",
      align: "center",
      render: (_: unknown, record: ImageTagUsageRequestResponse) => {
        const vulnerability = record.vulnerability;
        return (
          <ColumnAlignCenterWrap>
            <VulnerabilityTooltip
              critical={vulnerability?.criticalCount || 0}
              high={vulnerability?.highCount || 0}
              medium={vulnerability?.mediumCount || 0}
              low={vulnerability?.lowCount || 0}
            />
          </ColumnAlignCenterWrap>
        );
      },
    },
    {
      key: "requestReason",
      dataIndex: "requestReason",
      title: "요청 사유",
      align: "center",
      render: (requestReason: string) => {
        return <ViewRequestReasonButton reason={requestReason} />;
      },
    },
    {
      key: "approvalStatus",
      dataIndex: "approvalStatus",
      title: "승인 상태",
      align: "center",
      render: (approvalStatus: ImageTagUsageRequestResponseApprovalStatus) => {
        return <ImageTagUsageRequestStatusText status={approvalStatus} />;
      },
    },
    {
      key: "decisionReason",
      dataIndex: "decisionReason",
      title: "승인/반려 사유",
      align: "center",
      render: (_: unknown, record: ImageTagUsageRequestResponse) => {
        return (
          <ViewDecisionReasonButton
            reason={record.decisionReason}
            approvalStatus={record.approvalStatus}
          />
        );
      },
    },
    {
      key: "creatorName",
      dataIndex: "creatorName",
      title: "요청자명",
      align: "center",
    },
    {
      key: "requestedAt",
      dataIndex: "requestedAt",
      title: "요청날짜",
      align: "center",
      render: (requestedAt: string) => {
        return <span>{formatDateTimeSafely(requestedAt)}</span>;
      },
    },
    {
      key: "reject",
      title: "반려",
      align: "center",
      render: (_: unknown, record: ImageTagUsageRequestResponse) => {
        return <ViewRejectRequestImageButton requestImage={record} />;
      },
    },
    {
      key: "approve",
      title: "승인",
      align: "center",
      render: (_: unknown, record: ImageTagUsageRequestResponse) => {
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
 *   { key: 'imageDisplayName' },
 *   { key: 'imageTagName', width: 150 },
 *   { key: 'approvalStatus', title: '상태' },
 * ]);
 */
export const createRequestImageColumn = (
  config?: CoreCreateColumnConfig[],
): ResponsiveColumnType[] => {
  const columnList = createColumnList();

  return applyColumnConfigs(columnList, config);
};
