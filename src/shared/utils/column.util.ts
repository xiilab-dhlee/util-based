import type { ResponsiveColumnType } from "xiilab-ui";

import { commonColumns } from "@/shared/components/column";
import type { CoreCreateColumnConfig } from "@/shared/types/core.model";

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
  if (!configs || configs.length === 0) {
    return columns;
  }

  // 컬럼을 맵으로 변환 (빠른 조회를 위해)
  const columnMap = new Map<string, ResponsiveColumnType>();
  [...columns, ...commonColumns].forEach((column) => {
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

      // 오버라이드 적용
      return {
        ...column,
        ...(config.title !== undefined && { title: config.title }),
        ...(config.width !== undefined && { width: config.width }),
        ...(config.hidden !== undefined && { hidden: config.hidden }),
        ...(config.align !== undefined && { align: config.align }),
      };
    })
    .filter((column): column is ResponsiveColumnType => column !== null);
}
