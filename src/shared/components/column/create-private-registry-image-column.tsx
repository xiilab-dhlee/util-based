import type { ResponsiveColumnType } from "xiilab-ui";

import { PrivateRegistryImageAllCheck } from "@/domain/private-registry-image/components/list/private-registry-image-all-check";
import { PrivateRegistryImageItemCheck } from "@/domain/private-registry-image/components/list/private-registry-image-item-check";
import { PrivateRegistryImageNameLink } from "@/domain/private-registry-image/components/list/private-registry-image-name-link";
import type { PrivateRegistryImageListType } from "@/domain/private-registry-image/schemas/private-registry-image.schema";
import { CHECKBOX_COLUMN_WIDTH } from "@/shared/constants/core.constant";
import type { CoreCreateColumnConfig } from "@/shared/types/core.model";
import { applyColumnConfigs } from "@/shared/utils/column.util";
import { ColumnAlignCenterWrap } from "@/styles/layers/column-layer.styled";

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
      render: () => {
        return <span>v.1.2 / 8개</span>;
      },
    },
    {
      dataIndex: "description",
      title: "설명",
      align: "left",
    },
    {
      dataIndex: "pullCount",
      title: "다운로드 횟수",
      align: "center",
      width: 120,
      render: (_, { pullCnt }: PrivateRegistryImageListType) => {
        return <span>{pullCnt.toLocaleString()}번</span>;
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
