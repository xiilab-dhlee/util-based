import type { ResponsiveColumnType } from "xiilab-ui";

import type {
  ImageTagListResponse,
  ImageTagListResponseApprovalStatus,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { PrivateRegistryTagNameButton } from "@/domain/private-registry/components/detail/private-registry-tag-name-button";
import { PRIVATE_REGISTRY_TAG_APPROVAL_STATUS_TEXT } from "@/domain/private-registry/constants/private-registry-tag.constant";
import { ViewRejectReasonButton } from "@/shared/components/button/view-reject-reason-button";
import { ViewRequestReasonButton } from "@/shared/components/button/view-request-reason-button";
import { ScanStatusText } from "@/shared/components/text/scan-status-text";
import { VulnerabilityTooltip } from "@/shared/components/tooltip/vulnerability-tooltip";
import type { CoreCreateColumnConfig } from "@/shared/types/core.model";
import { applyColumnConfigs } from "@/shared/utils/column.util";
import {
  formatDateSafely,
  formatDateTimeSafely,
} from "@/shared/utils/date.util";
import { formatFileSize } from "@/shared/utils/file.util";

const createColumnList = (): ResponsiveColumnType[] => {
  return [
    {
      key: "imageTagName",
      title: "태그",
      dataIndex: "imageTagName",
      align: "left",
      render: (_: string, record: ImageTagListResponse) => {
        return <PrivateRegistryTagNameButton {...record} />;
      },
    },
    {
      key: "imageTagSizeByte",
      title: "이미지 크기",
      dataIndex: "imageTagSizeByte",
      align: "center",
      render: (imageTagSizeByte: number) => {
        return <span>{formatFileSize(imageTagSizeByte).formatted}</span>;
      },
    },
    {
      key: "scanStatus",
      title: "보안 검사 상태",
      dataIndex: "scanStatus",
      align: "center",
      render: (scanStatus: string) => {
        return <ScanStatusText status={scanStatus} />;
      },
    },
    {
      key: "vulnerability",
      title: "보안 검사 결과",
      dataIndex: "vulnerability",
      align: "center",
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
      key: "approvalStatus",
      title: "사용/요청 상태",
      dataIndex: "approvalStatus",
      align: "center",
      render: (approvalStatus: ImageTagListResponseApprovalStatus) => {
        return (
          <span>
            {PRIVATE_REGISTRY_TAG_APPROVAL_STATUS_TEXT[approvalStatus] ?? "-"}
          </span>
        );
      },
    },
    {
      key: "creatorName",
      title: "생성자",
      dataIndex: "creatorName",
      align: "center",
      render: (creatorName: string) => {
        return <span>{creatorName || "-"}</span>;
      },
    },
    {
      key: "createDateTime",
      title: "생성일",
      dataIndex: "createDateTime",
      align: "center",
      render: (createdAt: string) => {
        return <span>{formatDateSafely(createdAt, "yyyy.MM.dd")}</span>;
      },
    },
    {
      key: "latestVulnerabilityScanDateTime",
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
      key: "requestReason",
      dataIndex: "requestReason",
      title: "요청 사유",
      align: "center",
      render: (requestReason: string) => {
        return <ViewRequestReasonButton reason={requestReason} />;
      },
    },
    {
      key: "decisionReason",
      dataIndex: "decisionReason",
      title: "승인/반려 사유",
      align: "center",
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
