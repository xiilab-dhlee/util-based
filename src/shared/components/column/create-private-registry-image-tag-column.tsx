import { format } from "date-fns";
import { Label, type ResponsiveColumnType } from "xiilab-ui";

import { AdminPrivateRegistryImageTagAllCheck } from "@/domain/private-registry/components/detail/admin-private-registry-image-tag-all-check";
import { AdminPrivateRegistryImageTagItemCheck } from "@/domain/private-registry/components/detail/admin-private-registry-image-tag-item-check";
import { PrivateRegistryImageTagAllCheck } from "@/domain/private-registry-image/components/detail/private-registry-image-tag-all-check";
import { PrivateRegistryImageTagItemCheck } from "@/domain/private-registry-image/components/detail/private-registry-image-tag-item-check";
import { PrivateRegistryImageTagLink } from "@/domain/private-registry-image/components/detail/private-registry-image-tag-link";
import type { PrivateRegistryImageTagListType } from "@/domain/private-registry-image/schemas/private-registry-image-tag.schema";
import { CHECKBOX_COLUMN_WIDTH } from "@/shared/constants/core.constant";
import type { CoreCreateColumnConfig } from "@/shared/types/core.model";
import { applyColumnConfigs } from "@/shared/utils/column.util";
import { ColumnAlignCenterWrap } from "@/styles/layers/column-layer.styled";
import { ViewRejectReasonButton } from "../button/view-reject-reason-button";
import { ViewRequestReasonButton } from "../button/view-request-reason-button";
import { SecurityTooltip } from "../tooltip/security-tooltip";

const createColumnList = (): ResponsiveColumnType[] => {
  return [
    {
      title: <PrivateRegistryImageTagAllCheck />,
      dataIndex: "checkbox",
      align: "center",
      width: CHECKBOX_COLUMN_WIDTH,
      render: (_, record: PrivateRegistryImageTagListType) => {
        return <PrivateRegistryImageTagItemCheck tag={record} />;
      },
    },
    {
      title: <AdminPrivateRegistryImageTagAllCheck />,
      dataIndex: "admin-checkbox",
      align: "center",
      width: CHECKBOX_COLUMN_WIDTH,
      render: (_, record: PrivateRegistryImageTagListType) => {
        return <AdminPrivateRegistryImageTagItemCheck tag={record} />;
      },
    },
    {
      title: "태그",
      dataIndex: "tag",
      align: "left",
      render: (tag: string, record: PrivateRegistryImageTagListType) => {
        return <PrivateRegistryImageTagLink tagId={record.id} tagName={tag} />;
      },
    },
    {
      title: "이미지 크기",
      dataIndex: "imageSize",
      align: "center",
      render: (imageSize: number) => {
        return <span>{imageSize}MB</span>;
      },
    },
    {
      title: "업로드 상태",
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
      dataIndex: "securityResult",
      align: "center",
      width: 90,
      render: (_: number, record: PrivateRegistryImageTagListType) => {
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
      title: "Critical",
      dataIndex: "critical",
      align: "center",
    },
    {
      title: "High",
      dataIndex: "high",
      align: "center",
    },
    {
      title: "Medium",
      dataIndex: "medium",
      align: "center",
    },
    {
      title: "Low",
      dataIndex: "low",
      align: "center",
    },
    {
      title: "최근 검증일시",
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
      dataIndex: "status",
      align: "center",
      width: 90,
      render: () => {
        return <span>승인 필요</span>;
      },
    },

    {
      title: "요청 사유",
      dataIndex: "requestReason",
      align: "center",
      width: 100,
      render: (requestReason: string) => {
        return <ViewRequestReasonButton reason={requestReason} />;
      },
    },
    {
      title: "승인/반려 사유",
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
 * const columns = createPrivateRegistryImageTagColumn();
 *
 * @example
 * // 2. 배열 형태 - 순서 변경 가능
 * const columns = createPrivateRegistryImageTagColumn([
 *   { dataIndex: 'checkbox' },
 *   { dataIndex: 'tag' },
 *   { dataIndex: 'imageSize' },
 * ]);
 */
export const createPrivateRegistryImageTagColumn = (
  config?: CoreCreateColumnConfig[],
): ResponsiveColumnType[] => {
  const columnList = createColumnList();

  return applyColumnConfigs(columnList, config);
};
