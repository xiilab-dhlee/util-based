import { compact, isString } from "es-toolkit";
import type { ResponsiveColumnType } from "xiilab-ui";

import { createCommonColumns } from "@/shared/components/column";
import type { CoreCreateColumnConfig } from "@/shared/types/core.model";

/**
 * ellipsis가 활성화된 컬럼에 data-tooltip 속성 적용
 *
 * 기존: 각 셀마다 Tooltip 컴포넌트 렌더링 (N개 DOM 요소)
 * 변경: data-tooltip 속성만 설정, CustomizedTable에서 단일 Tooltip으로 처리 (1개 DOM 요소)
 */
function applyEllipsisTooltip<TRecord>(
  column: ResponsiveColumnType<TRecord>,
): ResponsiveColumnType<TRecord> {
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

      // data-tooltip 속성으로 원본 데이터 전달 (CustomizedTable에서 처리)
      return (
        <div className="truncate" data-tooltip={title}>
          {content}
        </div>
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
export function applyColumnConfigs<TRecord>(
  columns: ResponsiveColumnType<TRecord>[],
  configs?: CoreCreateColumnConfig[],
): ResponsiveColumnType<TRecord>[] {
  // configs가 없으면 원본 columns에 ellipsis 툴팁만 적용
  if (!configs || configs.length === 0) {
    return columns.map(applyEllipsisTooltip);
  }

  // 컬럼을 맵으로 변환 (빠른 조회를 위해)
  const columnMap = new Map<string, ResponsiveColumnType<TRecord>>();

  // 1. commonColumns 먼저 등록
  const commonColumns = createCommonColumns<TRecord>();
  commonColumns.forEach((column) => {
    if (isString(column.dataIndex)) {
      columnMap.set(column.dataIndex, column);
    }
  });

  // 2. 도메인 전용 columns로 오버라이드
  columns.forEach((column) => {
    if (isString(column.dataIndex)) {
      columnMap.set(column.dataIndex, column);
    }
  });

  // configs 순서대로 컬럼 생성
  const mappedColumns = configs.map((config) => {
    const column = columnMap.get(config.dataIndex);
    if (!column) {
      console.warn(
        `Column with dataIndex "${config.dataIndex}" not found in column definitions`,
      );
      return null;
    }

    // 오버라이드 적용 후 ellipsis 툴팁 적용
    const mergedColumn: ResponsiveColumnType<TRecord> = {
      ...column,
      ...config,
    };

    return applyEllipsisTooltip(mergedColumn);
  });

  return compact(mappedColumns);
}
