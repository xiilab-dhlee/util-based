import type { ResponsiveColumnType } from "xiilab-ui";

import { InternalRegistryImageAllCheck } from "@/domain/internal-registry-image/components/list/internal-registry-image-all-check";
import { InternalRegistryImageItemCheck } from "@/domain/internal-registry-image/components/list/internal-registry-image-item-check";
import { InternalRegistryImageNameLink } from "@/domain/internal-registry-image/components/list/internal-registry-image-name-link";
import type { InternalRegistryImageListType } from "@/domain/internal-registry-image/schemas/internal-registry-image.schema";
import {
  creatorDateColumn,
  creatorNameColumn,
} from "@/shared/components/column";
import { CHECKBOX_COLUMN_WIDTH } from "@/shared/constants/core.constant";
import type { CoreCreateColumnConfig } from "@/shared/types/core.model";
import { applyColumnConfigs } from "@/shared/utils/column.util";
import { ColumnAlignCenterWrap } from "@/styles/layers/column-layer.styled";

const createColumnList = (): ResponsiveColumnType[] => {
  return [
    {
      title: <InternalRegistryImageAllCheck />,
      key: "checkbox",
      dataIndex: "checkbox",
      align: "center",
      width: CHECKBOX_COLUMN_WIDTH,
      render: (_, record: InternalRegistryImageListType) => {
        return <InternalRegistryImageItemCheck image={record} />;
      },
    },
    {
      key: "name",
      dataIndex: "name",
      title: "이미지 이름",
      align: "left",
      render: (name, { id, projectId }: InternalRegistryImageListType) => {
        return (
          <InternalRegistryImageNameLink
            imageId={id}
            projectId={projectId}
            imageName={name}
          />
        );
      },
    },
    {
      key: "tagCnt",
      dataIndex: "tagCnt",
      title: "태그 수",
      align: "center",
      width: 100,
      render: () => {
        return <span>v.1.2 / 8개</span>;
      },
    },
    {
      key: "description",
      dataIndex: "description",
      title: "설명",
      align: "left",
    },
    {
      key: "pullCount",
      dataIndex: "pullCount",
      title: "다운로드 횟수",
      align: "center",
      width: 120,
      render: (_, { pullCnt }: InternalRegistryImageListType) => {
        return <span>{pullCnt.toLocaleString()}번</span>;
      },
    },
    {
      key: "status",
      dataIndex: "status",
      title: "업로드 상태",
      align: "center",
      render: (_, { status }: InternalRegistryImageListType) => {
        return <ColumnAlignCenterWrap>{status}</ColumnAlignCenterWrap>;
      },
    },
    creatorNameColumn,
    creatorDateColumn,
  ];
};

export const createInternalRegistryImageColumn = (
  config?: CoreCreateColumnConfig[],
): ResponsiveColumnType[] => {
  const columnList = createColumnList();

  return applyColumnConfigs(columnList, config);
};
