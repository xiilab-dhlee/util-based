import type { ResponsiveColumnType } from "xiilab-ui";

import type {
  ImageTagListResponse,
  ImageTagListResponseApprovalStatus,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { RegistryTagNameButton } from "@/domain/registry/components/detail/registry-tag-name-button";
import { RequestUseButton } from "@/domain/registry/components/detail/request-use-button";
import { REGISTRY_TAG_APPROVAL_STATUS_TEXT } from "@/domain/registry/constants/registry-detail.constant";
import { ViewRejectReasonButton } from "@/shared/components/button/view-reject-reason-button";
import { ViewRequestReasonButton } from "@/shared/components/button/view-request-reason-button";
import { createdAtColumn, creatorNameColumn } from "@/shared/components/column";
import { ScanStatusText } from "@/shared/components/text/scan-status-text";
import { VulnerabilityTooltip } from "@/shared/components/tooltip/vulnerability-tooltip";
import type { CoreCreateColumnConfig } from "@/shared/types/core.model";
import { applyColumnConfigs } from "@/shared/utils/column.util";
import { formatDateTimeSafely } from "@/shared/utils/date.util";
import { formatFileSize } from "@/shared/utils/file.util";

const createColumnList = (): ResponsiveColumnType[] => {
  return [
    {
      key: "imageTagName",
      title: "태그",
      dataIndex: "imageTagName",
      align: "left",
      render: (_: string, record: ImageTagListResponse) => {
        return <RegistryTagNameButton {...record} />;
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
      title: "사용 요청 상태",
      dataIndex: "approvalStatus",
      align: "center",
      render: (approvalStatus?: ImageTagListResponseApprovalStatus) => {
        if (!approvalStatus) {
          return <span>-</span>;
        }

        return <span>{REGISTRY_TAG_APPROVAL_STATUS_TEXT[approvalStatus]}</span>;
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
      render: (requestReason?: string) => {
        return (
          <ViewRequestReasonButton
            reason={requestReason}
            disabled={!requestReason}
          />
        );
      },
    },
    {
      key: "useRequest",
      title: "사용 요청",
      align: "center",
      render: (_: unknown, record: ImageTagListResponse) => {
        const isDisabled = !record.imageTagId;

        return (
          <RequestUseButton
            imageTagId={record.imageTagId ?? 0}
            disabled={isDisabled}
          />
        );
      },
    },
    {
      key: "decisionReason",
      dataIndex: "decisionReason",
      title: "승인/반려 사유",
      align: "center",
      render: (decisionReason?: string) => {
        return (
          <ViewRejectReasonButton reason={decisionReason} disabled={true} />
        );
      },
    },
    creatorNameColumn,
    createdAtColumn({ includeTime: true }),
  ];
};

/**
 * 레지스트리 이미지 태그 테이블 컬럼 생성
 *
 * @param config 컬럼 설정 (배열 형태)
 * @returns 컬럼 배열
 */
export const createRegistryTagColumn = (
  config?: CoreCreateColumnConfig[],
): ResponsiveColumnType[] => {
  const columnList = createColumnList();

  return applyColumnConfigs(columnList, config);
};
