import type { ResponsiveColumnType } from "xiilab-ui";

import type { SourceCodeListResponseSourceCodeType } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { getSourcecodeTypeInfo } from "@/domain/sourcecode/utils/sourcecode.util";
import { createdAtColumn, creatorNameColumn } from "@/shared/components/column";
import type { CoreCreateColumnConfig } from "@/shared/types/core.model";
import { applyColumnConfigs } from "@/shared/utils/column.util";

const createColumnList = (): ResponsiveColumnType[] => {
  return [
    {
      key: "sourceCodeName",
      dataIndex: "sourceCodeName",
      title: "소스코드이름",
      align: "left",
    },
    {
      key: "gitUrl",
      dataIndex: "gitUrl",
      title: "Git URL",
      align: "left",
    },
    {
      key: "isPublic",
      dataIndex: "isPublic",
      title: "공개 설정",
      align: "center",
      render: (isPublic: boolean) => {
        return <span>{isPublic ? "공개" : "비공개"}</span>;
      },
    },
    {
      key: "sourceCodeType",
      dataIndex: "sourceCodeType",
      title: "타입",
      align: "center",
      render: (codeType: SourceCodeListResponseSourceCodeType) => {
        const { text } = getSourcecodeTypeInfo(codeType);
        return <span>{text}</span>;
      },
    },
    {
      key: "executionCmd",
      dataIndex: "executionCmd",
      title: "실행 명령어",
      align: "left",
      ellipsis: { showTitle: false },
    },
    creatorNameColumn,
    createdAtColumn(),
  ];
};

/**
 * 소스코드 테이블 컬럼 생성
 *
 * @param config 컬럼 설정 (배열 형태)
 * @returns 컬럼 배열
 *
 * @example
 * // 1. 모든 컬럼 표시 (기본)
 * const columns = createSourcecodeColumn();
 *
 * @example
 * // 2. 정렬 상태 적용
 * const columns = createSourcecodeColumn([
 *   { key: 'sourceCodeName', sortOrder: getColumnSortOrder(sort, 'sourceCodeName') },
 *   { key: 'createdAt', sortOrder: getColumnSortOrder(sort, 'createdAt') },
 * ]);
 */
export const createSourcecodeColumn = (
  config?: CoreCreateColumnConfig[],
): ResponsiveColumnType[] => {
  const columnList = createColumnList();

  return applyColumnConfigs(columnList, config);
};
