import { format } from "date-fns";
import { Label, type ResponsiveColumnType } from "xiilab-ui";

import type { ImageTagListResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { PrivateRegistryTagAllCheck } from "@/domain/private-registry/components/detail/private-registry-tag-all-check";
import { PrivateRegistryTagItemCheck } from "@/domain/private-registry/components/detail/private-registry-tag-item-check";
import { CHECKBOX_COLUMN_WIDTH } from "@/shared/constants/core.constant";
import type { CoreCreateColumnConfig } from "@/shared/types/core.model";
import { applyColumnConfigs } from "@/shared/utils/column.util";
import { formatFileSize } from "@/shared/utils/file.util";
import { ColumnAlignCenterWrap } from "@/styles/layers/column-layer.styled";
import { VulnerabilityTooltip } from "../tooltip/vulnerability-tooltip";

const createColumnList = (): ResponsiveColumnType[] => {
  return [
    {
      title: <PrivateRegistryTagAllCheck />,
      dataIndex: "checkbox",
      align: "center",
      width: CHECKBOX_COLUMN_WIDTH,
      render: (_, record: ImageTagListResponse) => {
        return <PrivateRegistryTagItemCheck tag={record} />;
      },
    },
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
      width: 100,
      render: (scanStatus: string) => {
        if (!scanStatus) {
          return (
            <ColumnAlignCenterWrap>
              <span>미검사</span>
            </ColumnAlignCenterWrap>
          );
        }
        return (
          <ColumnAlignCenterWrap>
            <Label variant="blue">완료</Label>
          </ColumnAlignCenterWrap>
        );
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
          <ColumnAlignCenterWrap>
            <VulnerabilityTooltip
              critical={vuln.criticalCount ?? 0}
              high={vuln.highCount ?? 0}
              medium={vuln.mediumCount ?? 0}
              low={vuln.lowCount ?? 0}
            />
          </ColumnAlignCenterWrap>
        );
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
      dataIndex: "createdAt",
      align: "center",
      render: (createdAt: string) => {
        if (!createdAt) return <span>-</span>;
        return (
          <ColumnAlignCenterWrap>
            {format(createdAt, "yyyy.MM.dd")}
          </ColumnAlignCenterWrap>
        );
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
