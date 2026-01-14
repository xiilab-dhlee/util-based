import { format } from "date-fns";
import { Label, type ResponsiveColumnType } from "xiilab-ui";

import { AdminInternalRegistryImageTagAllCheck } from "@/domain/internal-registry/components/detail/admin-internal-registry-image-tag-all-check";
import { AdminInternalRegistryImageTagItemCheck } from "@/domain/internal-registry/components/detail/admin-internal-registry-image-tag-item-check";
import { InternalRegistryImageTagAllCheck } from "@/domain/internal-registry-image/components/detail/internal-registry-image-tag-all-check";
import { InternalRegistryImageTagItemCheck } from "@/domain/internal-registry-image/components/detail/internal-registry-image-tag-item-check";
import { InternalRegistryImageTagLink } from "@/domain/internal-registry-image/components/detail/internal-registry-image-tag-link";
import type { InternalRegistryImageTagListType } from "@/domain/internal-registry-image/schemas/internal-registry-image-tag.schema";
import { ViewRejectReasonButton } from "@/shared/components/button/view-reject-reason-button";
import { ViewRequestReasonButton } from "@/shared/components/button/view-request-reason-button";
import { CHECKBOX_COLUMN_WIDTH } from "@/shared/constants/core.constant";
import type { CoreCreateColumnConfig } from "@/shared/types/core.model";
import { applyColumnConfigs } from "@/shared/utils/column.util";
import { ColumnAlignCenterWrap } from "@/styles/layers/column-layer.styled";
import { VulnerabilityTooltip } from "../tooltip/vulnerability-tooltip";

const createColumnList = (): ResponsiveColumnType[] => {
  return [
    {
      title: <InternalRegistryImageTagAllCheck />,
      key: "checkbox",
      dataIndex: "checkbox",
      align: "center",
      width: CHECKBOX_COLUMN_WIDTH,
      render: (_, record: InternalRegistryImageTagListType) => {
        return <InternalRegistryImageTagItemCheck tag={record} />;
      },
    },
    {
      title: <AdminInternalRegistryImageTagAllCheck />,
      key: "admin-checkbox",
      dataIndex: "admin-checkbox",
      align: "center",
      width: CHECKBOX_COLUMN_WIDTH,
      render: (_, record: InternalRegistryImageTagListType) => {
        return <AdminInternalRegistryImageTagItemCheck tag={record} />;
      },
    },
    {
      title: "태그",
      key: "tag",
      dataIndex: "tag",
      align: "left",
      render: (tag: string, record: InternalRegistryImageTagListType) => {
        return <InternalRegistryImageTagLink tagId={record.id} tagName={tag} />;
      },
    },
    {
      title: "이미지 크기",
      key: "imageSize",
      dataIndex: "imageSize",
      align: "center",
      render: (imageSize: number) => {
        return <span>{imageSize}MB</span>;
      },
    },
    {
      title: "업로드 상태",
      key: "uploadStatus",
      dataIndex: "uploadStatus",
      align: "center",
      width: 90,
      render: () => {
        return (
          <ColumnAlignCenterWrap>
            <Label variant="blue">완료</Label>
          </ColumnAlignCenterWrap>
        );
      },
    },
    {
      title: "보안 검사 상태",
      key: "scanStatus",
      dataIndex: "scanStatus",
      align: "center",
      width: 90,
      render: () => {
        return (
          <ColumnAlignCenterWrap>
            <Label variant="blue">완료</Label>
          </ColumnAlignCenterWrap>
        );
      },
    },
    {
      title: "보안 검사 결과",
      key: "securityResult",
      dataIndex: "securityResult",
      align: "center",
      width: 90,
      render: (_: number, record: InternalRegistryImageTagListType) => {
        return (
          <ColumnAlignCenterWrap>
            <VulnerabilityTooltip
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
      title: "Critical",
      key: "critical",
      dataIndex: "critical",
      align: "center",
    },
    {
      title: "High",
      key: "high",
      dataIndex: "high",
      align: "center",
    },
    {
      title: "Medium",
      key: "medium",
      dataIndex: "medium",
      align: "center",
    },
    {
      title: "Low",
      key: "low",
      dataIndex: "low",
      align: "center",
    },
    {
      title: "최근 검증일시",
      key: "lastCheckedAt",
      dataIndex: "lastCheckedAt",
      align: "center",
      render: (lastCheckedAt: string) => {
        return (
          <ColumnAlignCenterWrap>
            {format(lastCheckedAt, "yyyy.MM.dd")}
          </ColumnAlignCenterWrap>
        );
      },
    },
    {
      title: "사용/요청 상태",
      key: "status",
      dataIndex: "status",
      align: "center",
      width: 90,
      render: () => {
        return <span>승인 필요</span>;
      },
    },

    {
      title: "요청 사유",
      key: "requestReason",
      dataIndex: "requestReason",
      align: "center",
      width: 100,
      render: (requestReason: string) => {
        return <ViewRequestReasonButton reason={requestReason} />;
      },
    },
    {
      title: "승인/반려 사유",
      key: "rejectReason",
      dataIndex: "rejectReason",
      align: "center",
      width: 90,
      render: (rejectReason: string) => {
        return <ViewRejectReasonButton reason={rejectReason} />;
      },
    },
  ];
};

/**
 * 내부 레지스트리 이미지 태그 관련 테이블 컬럼 생성
 *
 * @param config 컬럼 설정 (배열 형태)
 * @returns 컬럼 배열
 *
 * @example
 * // 1. 모든 컬럼 표시 (기본)
 * const columns = createInternalRegistryImageTagColumn();
 *
 * @example
 * // 2. 배열 형태 - 순서 변경 가능
 * const columns = createInternalRegistryImageTagColumn([
 *   { key: 'checkbox' },
 *   { key: 'tag' },
 *   { key: 'imageSize' },
 * ]);
 */
export const createInternalRegistryImageTagColumn = (
  config?: CoreCreateColumnConfig[],
): ResponsiveColumnType[] => {
  const columnList = createColumnList();

  return applyColumnConfigs(columnList, config);
};
