import type { ResponsiveColumnType } from "xiilab-ui";
import { Tag } from "xiilab-ui";

import { SourcecodeAllCheck } from "@/domain/sourcecode/components/sourcecode-all-check";
import { SourcecodeItemCheck } from "@/domain/sourcecode/components/sourcecode-item-check";
import type {
  SourcecodeListType,
  SourcecodeStatusType,
  SourcecodeType,
} from "@/domain/sourcecode/schemas/sourcecode.schema";
import {
  getSourcecodeStatusInfo,
  getSourcecodeTypeInfo,
} from "@/domain/sourcecode/utils/sourcecode.util";
import { creatorDateColumn } from "@/shared/components/column";
import { CHECKBOX_COLUMN_WIDTH } from "@/shared/constants/core.constant";
import type { CoreCreateColumnConfig } from "@/shared/types/core.model";
import { applyColumnConfigs } from "@/shared/utils/column.util";
import { ColumnAlignCenterWrap } from "@/styles/layers/column-layer.styled";

const createColumnList = (): ResponsiveColumnType[] => {
  return [
    {
      key: "checkbox",
      dataIndex: "checkbox",
      title: <SourcecodeAllCheck />,
      align: "center",
      width: CHECKBOX_COLUMN_WIDTH,
      render: (_: string, record: SourcecodeListType) => {
        return <SourcecodeItemCheck sourcecode={record} />;
      },
    },
    {
      key: "name",
      dataIndex: "name",
      title: "소스코드 이름",
      align: "left",
    },
    {
      key: "url",
      dataIndex: "url",
      title: "Git URL",
      align: "left",
    },
    {
      key: "creatorName",
      dataIndex: "creatorName",
      title: "생성자",
      align: "center",
      render: (creatorName: string) => {
        return <ColumnAlignCenterWrap>{creatorName}</ColumnAlignCenterWrap>;
      },
    },
    {
      key: "status",
      dataIndex: "status",
      title: "공개 설정",
      align: "center",
      render: (status: SourcecodeStatusType) => {
        const { text } = getSourcecodeStatusInfo(status);
        return <ColumnAlignCenterWrap>{text}</ColumnAlignCenterWrap>;
      },
    },
    {
      key: "path",
      dataIndex: "path",
      title: "마운트 경로",
      align: "left",
    },
    {
      key: "type",
      dataIndex: "type",
      title: "타입",
      align: "center",
      width: 100,
      render: (codeType: SourcecodeType) => {
        const { text, tag } = getSourcecodeTypeInfo(codeType);
        return (
          <ColumnAlignCenterWrap>
            <Tag variant={tag} theme="light">
              {text}
            </Tag>
          </ColumnAlignCenterWrap>
        );
      },
    },
    {
      key: "cmd",
      dataIndex: "cmd",
      title: "실행 명령어",
      align: "left",
    },
    creatorDateColumn,
  ];
};

export const createSourcecodeColumn = (
  config?: CoreCreateColumnConfig[],
): ResponsiveColumnType[] => {
  const columnList = createColumnList();

  return applyColumnConfigs(columnList, config);
};
