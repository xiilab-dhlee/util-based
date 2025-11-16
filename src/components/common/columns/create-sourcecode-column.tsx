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
import { ColumnAlignCenterWrap } from "@/styles/layers/column-layer.styled";
import type { CoreCreateColumnConfig } from "@/types/common/core.model";
import { applyColumnConfigs } from "@/utils/common/column.util";
import { getSourcecodeTypeInfo } from "@/utils/sourcecode/sourcecode.util";

const createColumnList = (): ResponsiveColumnType[] => {
  return [
    {
      dataIndex: "checkbox",
      title: <SourcecodeAllCheck />,
      align: "center",
      width: CHECKBOX_COLUMN_WIDTH,
      render: (_: string, record: SourcecodeListType) => {
        return <SourcecodeItemCheck sourcecode={record} />;
      },
    },
    {
      dataIndex: "title",
      title: "소스코드 이름",
      align: "left",
    },
    {
      dataIndex: "creatorName",
      title: "생성자",
      align: "center",
      render: (creatorName: string) => {
        return <ColumnAlignCenterWrap>{creatorName}</ColumnAlignCenterWrap>;
      },
    },
    {
      dataIndex: "defaultPath",
      title: "마운트 경로",
      align: "left",
    },
    {
      dataIndex: "codeType",
      title: "타입",
      align: "center",
      render: (codeType: SourcecodeCodeType) => {
        const { text } = getSourcecodeTypeInfo(codeType);
        return (
          <ColumnAlignCenterWrap>
            <Tag variant="yellow" theme="light">
              {text}
            </Tag>
          </ColumnAlignCenterWrap>
        );
      },
    },
    {
      dataIndex: "cmd",
      title: "실행 명령어",
      align: "left",
    },
    {
      dataIndex: "creatorDate",
      title: "생성일",
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
};

/**
 * 소스코드 관련 테이블 컬럼 생성
 *
 * @param config 컬럼 설정 (배열 형태)
 * @returns 컬럼 배열
 *
 * @example
 * // 1. 모든 컬럼 표시 (기본)
 * const columns = createSourcecodeColumn();
 *
 * @example
 * // 2. 배열 형태 - 순서 변경 가능
 * const columns = createSourcecodeColumn([
 *   { dataIndex: 'checkbox' },
 *   { dataIndex: 'title', title: '이름' },
 *   { dataIndex: 'codeType', width: 100 },
 * ]);
 */
export const createSourcecodeColumn = (
  config?: CoreCreateColumnConfig[],
): ResponsiveColumnType[] => {
  const columnList = createColumnList();

  return applyColumnConfigs(columnList, config);
};
