import type { ResponsiveColumnType } from "xiilab-ui";

import { MyIcon } from "@/components/common/icons";
import { PrivateRegistryImageAllCheck } from "@/components/private-registry-image/list/private-registry-image-all-check";
import { PrivateRegistryImageItemCheck } from "@/components/private-registry-image/list/private-registry-image-item-check";
import { PrivateRegistryImageNameLink } from "@/components/private-registry-image/list/private-registry-image-name-link";
import {
  CHECKBOX_COLUMN_WIDTH,
  ICON_COLUMN_WIDTH,
} from "@/constants/common/core.constant";
import type { PrivateRegistryImageListType } from "@/schemas/private-registry-image.schema";
import {
  ColumnAlignCenterWrap,
  ColumnIconWrap,
  ColumnTruncateText,
} from "@/styles/layers/column-layer.styled";
import type { CoreCreateColumnConfig } from "@/types/common/core.model";
import { applyColumnConfigs } from "@/utils/common/column.util";

const createColumnList = (): ResponsiveColumnType[] => {
  return [
    {
      title: <PrivateRegistryImageAllCheck />,
      dataIndex: "checkbox",
      align: "center",
      width: CHECKBOX_COLUMN_WIDTH,
      render: (_, record: PrivateRegistryImageListType) => {
        return <PrivateRegistryImageItemCheck image={record} />;
      },
    },
    {
      dataIndex: "imageName",
      title: "이미지 이름",
      align: "left",
      render: (_, { id, projectId, name }: PrivateRegistryImageListType) => {
        return (
          <PrivateRegistryImageNameLink
            imageId={id}
            projectId={projectId}
            imageName={name}
          />
        );
      },
    },
    {
      dataIndex: "tagCnt",
      title: "태그 수",
      align: "center",
      width: 100,
      render: (_, { tagCnt }: PrivateRegistryImageListType) => {
        return (
          <ColumnAlignCenterWrap>
            <span>{tagCnt}</span>
          </ColumnAlignCenterWrap>
        );
      },
    },
    {
      dataIndex: "description",
      title: "설명",
      align: "left",
      render: (description) => {
        return (
          <ColumnTruncateText width={300}>{description}</ColumnTruncateText>
        );
      },
    },
    {
      dataIndex: "pullCount",
      title: "다운로드 횟수",
      align: "center",
      width: 120,
      render: (_, { pullCnt }: PrivateRegistryImageListType) => {
        return (
          <ColumnAlignCenterWrap>
            <span>{pullCnt}</span>
          </ColumnAlignCenterWrap>
        );
      },
    },
    {
      dataIndex: "status",
      title: "업로드 상태",
      align: "center",
      render: (_, { status }: PrivateRegistryImageListType) => {
        return <ColumnAlignCenterWrap>{status}</ColumnAlignCenterWrap>;
      },
    },
  ];
};

/**
 * 내부 레지스트리 이미지 관련 테이블 컬럼 생성
 *
 * @param config 컬럼 설정 (배열 형태)
 * @returns 컬럼 배열
 *
 * @example
 * // 배열 형태 - 순서 변경 가능
 * const columns = createPrivateRegistryImageColumn([
 *   { dataIndex: 'imageName' },
 *   { dataIndex: 'registryName' },
 *   { dataIndex: 'tags' },
 * ]);
 */
export const createPrivateRegistryImageColumn = (
  config?: CoreCreateColumnConfig[],
): ResponsiveColumnType[] => {
  const columnList = createColumnList();

  return applyColumnConfigs(columnList, config);
};
