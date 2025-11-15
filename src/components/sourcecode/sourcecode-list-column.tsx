import { format } from "date-fns";
import type { ResponsiveColumnType } from "xiilab-ui";
import { Tag } from "xiilab-ui";

import { SourcecodeAllCheck } from "@/components/sourcecode/list/sourcecode-all-check";
import { SourcecodeItemCheck } from "@/components/sourcecode/list/sourcecode-item-check";
import { CHECKBOX_COLUMN_WIDTH } from "@/constants/common/core.constant";
import type {
  SourcecodeCodeType,
  SourcecodeListType,
} from "@/schemas/sourcecode.schema";
import { getSourcecodeTypeInfo } from "@/utils/sourcecode/sourcecode.util";
import { ColumnAlignCenterWrap } from "../../styles/layers/column-layer.styled";

export const sourcecodeListColumn: ResponsiveColumnType[] = [
  {
    title: <SourcecodeAllCheck />,
    dataIndex: "checkbox",
    align: "center",
    width: CHECKBOX_COLUMN_WIDTH,
    render: (id: string, record: SourcecodeListType) => {
      return <SourcecodeItemCheck sourcecode={record} />;
    },
  },
  {
    title: "소스코드 이름",
    dataIndex: "title",
    align: "left",
  },
  {
    title: "생성자",
    dataIndex: "creatorName",
    align: "center",
    render: (creatorName: string) => {
      return <ColumnAlignCenterWrap>{creatorName}</ColumnAlignCenterWrap>;
    },
  },
  {
    title: "마운트 경로",
    dataIndex: "defaultPath",
    align: "left",
  },
  {
    title: "타입",
    dataIndex: "codeType",
    align: "center",
    render: (codeType: SourcecodeCodeType) => {
      const { tag, text } = getSourcecodeTypeInfo(codeType);
      return (
        <ColumnAlignCenterWrap>
          <Tag variant={tag}>{text}</Tag>
        </ColumnAlignCenterWrap>
      );
    },
  },
  {
    title: "실행 명령어",
    dataIndex: "cmd",
    align: "left",
  },
  {
    title: "생성일",
    dataIndex: "creatorDate",
    align: "center",
    render: (creatorDate: string) => {
      return (
        <ColumnAlignCenterWrap>
          {format(creatorDate, "yyyy-MM-dd HH:mm:ss")}
        </ColumnAlignCenterWrap>
      );
    },
  },
];
