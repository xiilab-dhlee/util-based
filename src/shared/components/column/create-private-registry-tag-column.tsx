import { Label, type ResponsiveColumnType } from "xiilab-ui";

import {
  type ImageTagListResponse,
  ImageTagListResponseApprovalStatus,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import type { CoreCreateColumnConfig } from "@/shared/types/core.model";
import { applyColumnConfigs } from "@/shared/utils/column.util";
import {
  formatDateSafely,
  formatDateTimeSafely,
} from "@/shared/utils/date.util";
import { formatFileSize } from "@/shared/utils/file.util";
import { ViewRejectReasonButton } from "../button/view-reject-reason-button";
import { ViewRequestReasonButton } from "../button/view-request-reason-button";
import { VulnerabilityTooltip } from "../tooltip/vulnerability-tooltip";

/** 승인 상태 텍스트 매핑 */
const APPROVAL_STATUS_TEXT: Record<ImageTagListResponseApprovalStatus, string> =
  {
    [ImageTagListResponseApprovalStatus.REJECTED]: "반려",
    [ImageTagListResponseApprovalStatus.APPROVAL_REQUIRED]: "승인 필요",
    [ImageTagListResponseApprovalStatus.AVAILABLE]: "요청 가능",
    [ImageTagListResponseApprovalStatus.APPROVAL_WAITING]: "승인 대기",
    [ImageTagListResponseApprovalStatus.APPROVED]: "승인",
    [ImageTagListResponseApprovalStatus.REQUEST_BLOCKED]: "요청 불가",
  };

const createColumnList = (): ResponsiveColumnType[] => {
  return [
    {
      title: "태그",
      dataIndex: "imageTagName",
      align: "left",
      render: (imageTagName: string) => {
        return <span>{imageTagName || "-"}</span>;
      },
    },
    {
      title: "이미지 크기",
      dataIndex: "imageTagSizeByte",
      align: "center",
      render: (imageTagSizeByte: number) => {
        return <span>{formatFileSize(imageTagSizeByte).formatted}</span>;
      },
    },
    {
      title: "업로드 상태",
      dataIndex: "uploadStatus",
      align: "center",
      width: 90,
      render: () => {
        return (
          <span>
            <Label variant="blue">완료</Label>
          </span>
        );
      },
    },
    {
      title: "보안 검사 상태",
      dataIndex: "scanStatus",
      align: "center",
      width: 100,
      render: (scanStatus: string) => {
        if (!scanStatus) {
          return <span>-</span>;
        }

        return <Label variant="blue">완료</Label>;
      },
    },
    {
      title: "보안 검사 결과",
      dataIndex: "vulnerability",
      align: "center",
      width: 90,
      render: (_: unknown, record: ImageTagListResponse) => {
        const vuln = record.vulnerability;
        if (!vuln) return <span>-</span>;
        return (
          <span>
            <VulnerabilityTooltip
              critical={vuln.criticalCount ?? 0}
              high={vuln.highCount ?? 0}
              medium={vuln.mediumCount ?? 0}
              low={vuln.lowCount ?? 0}
            />
          </span>
        );
      },
    },
    {
      title: "사용/요청 상태",
      dataIndex: "approvalStatus",
      align: "center",
      render: (approvalStatus: ImageTagListResponseApprovalStatus) => {
        return <span>{APPROVAL_STATUS_TEXT[approvalStatus] ?? "-"}</span>;
      },
    },
    {
      title: "생성자",
      dataIndex: "creatorName",
      align: "center",
      render: (creatorName: string) => {
        return <span>{creatorName || "-"}</span>;
      },
    },
    {
      title: "생성일",
      dataIndex: "createDateTime",
      align: "center",
      render: (createdAt: string) => {
        return <span>{formatDateSafely(createdAt, "yyyy.MM.dd")}</span>;
      },
    },
    {
      title: "최근 검사일시",
      dataIndex: "latestVulnerabilityScanDateTime",
      align: "center",
      render: (latestVulnerabilityScanDateTime: string) => {
        return (
          <span>{formatDateTimeSafely(latestVulnerabilityScanDateTime)}</span>
        );
      },
    },
    {
      dataIndex: "requestReason",
      title: "요청 사유",
      align: "center",
      width: 70,
      render: (requestReason: string) => {
        return <ViewRequestReasonButton reason={requestReason} />;
      },
    },
    {
      dataIndex: "decisionReason",
      title: "승인/반려 사유",
      align: "center",
      width: 100,
      render: (decisionReason: string) => {
        return <ViewRejectReasonButton reason={decisionReason} />;
      },
    },
  ];
};

/**
 * 프라이빗 레지스트리 이미지 태그 테이블 컬럼 생성
 *
 * @param config 컬럼 설정 (배열 형태)
 * @returns 컬럼 배열
 */
export const createPrivateRegistryTagColumn = (
  config?: CoreCreateColumnConfig[],
): ResponsiveColumnType[] => {
  const columnList = createColumnList();

  return applyColumnConfigs(columnList, config);
};
