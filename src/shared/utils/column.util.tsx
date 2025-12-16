import type { ResponsiveColumnType } from "xiilab-ui";
import { Tooltip } from "xiilab-ui";

import { commonColumns } from "@/shared/components/column";
import type { CoreCreateColumnConfig } from "@/shared/types/core.model";

/**
 * ellipsis가 활성화된 컬럼에 툴팁 렌더러 적용
 * 툴팁에는 원본 데이터(title)를 표시하고, 컨텐츠에는 렌더링된 컴포넌트를 표시
 */
function applyEllipsisTooltip(
  column: ResponsiveColumnType,
): ResponsiveColumnType {
  if (!column.ellipsis) {
    return column;
  }

  const originalRender = column.render;
  return {
    ...column,
    render: (title, record, index) => {
      const content = originalRender
        ? originalRender(title, record, index)
        : title;

      // 툴팁에는 원본 데이터(title)를 표시
      const tooltipTitle = title;

      return (
        <Tooltip title={tooltipTitle} getPopupContainer={() => document.body}>
          <div className="truncate">{content}</div>
        </Tooltip>
      );
    },
  };
}

/**
 * 컬럼 배열에 설정 적용
 * 배열 순서대로 컬럼을 필터링하고 오버라이드 적용
 *
 * @param columns 원본 컬럼 배열
 * @param configs 컬럼 설정 배열
 * @returns 설정이 적용된 컬럼 배열
 *
 * @example
 * const columns = createColumnList();
 * const customColumns = applyColumnConfigs(columns, [
 *   { dataIndex: "workloadName", title: "이름", width: 200 },
 *   { dataIndex: "status", align: "center" },
 *   { dataIndex: "jobType" },
 * ]);
 */
export function applyColumnConfigs(
  columns: ResponsiveColumnType[],
  configs?: CoreCreateColumnConfig[],
): ResponsiveColumnType[] {
  // configs가 없으면 원본 columns에 ellipsis 툴팁만 적용
  if (!configs || configs.length === 0) {
    return columns.map(applyEllipsisTooltip);
  }

  // 컬럼을 맵으로 변환 (빠른 조회를 위해)
  const columnMap = new Map<string, ResponsiveColumnType>();
  // commonColumns 먼저 등록 후, 도메인 전용 columns 로 오버라이드 되도록 순서 설정
  [...commonColumns, ...columns].forEach((column) => {
    const dataIndex = column.dataIndex as string;
    if (dataIndex) {
      columnMap.set(dataIndex, column);
    }
  });

  // configs 순서대로 컬럼 생성
  return configs
    .map((config) => {
      const column = columnMap.get(config.dataIndex);
      if (!column) {
        console.warn(
          `Column with dataIndex "${config.dataIndex}" not found in column definitions`,
        );
        return null;
      }

      // 오버라이드 적용 후 ellipsis 툴팁 적용
      const mergedColumn = {
        ...column,
        ...config,
      };

      return applyEllipsisTooltip(mergedColumn);
    })
    .filter((column): column is ResponsiveColumnType => column !== null);
}
