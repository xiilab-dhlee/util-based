import { format } from "date-fns";
import { Label, type ResponsiveColumnType } from "xiilab-ui";

import { PrivateRegistryImageTagAllCheck } from "@/components/private-registry-image/detail/private-registry-image-tag-all-check";
import { PrivateRegistryImageTagItemCheck } from "@/components/private-registry-image/detail/private-registry-image-tag-item-check";
import { CHECKBOX_COLUMN_WIDTH } from "@/constants/common/core.constant";
import type { PrivateRegistryImageTagListType } from "@/schemas/private-registry-image-tag.schema";
import { ColumnAlignCenterWrap } from "@/styles/layers/column-layer.styled";
import type { CoreCreateColumnConfig } from "@/types/common/core.model";
import { applyColumnConfigs } from "@/utils/common/column.util";
import { ViewRejectReasonButton } from "../buttons/view-reject-reason-button";
import { ViewRequestReasonButton } from "../buttons/view-request-reason-button";
import { SecurityTooltip } from "../tooltip/security-tooltip";

const createColumnList = (): ResponsiveColumnType[] => {
  return [
    {
      title: <PrivateRegistryImageTagAllCheck />,
      dataIndex: "checkbox",
      align: "center",
      width: CHECKBOX_COLUMN_WIDTH,
      render: (_: string, record: PrivateRegistryImageTagListType) => {
        return <PrivateRegistryImageTagItemCheck tag={record} />;
      },
    },
    {
      title: "태그",
      dataIndex: "tag",
      align: "left",
    },
    {
      title: "이미지 크기",
      dataIndex: "imageSize",
      align: "center",
    },
    {
      title: "보안 검사 상태",
      dataIndex: "lastCheckedAt",
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
      render: (status: string) => {
        return <span>{status}</span>;
      },
    },
    {
      title: "보안 검사 진행 상태",
      dataIndex: "scanStatus",
      align: "center",
      width: 110,
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
