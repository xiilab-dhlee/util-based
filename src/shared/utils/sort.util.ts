import type { SorterResult } from "antd/es/table/interface";

import type { SortDirection } from "@/shared/types/api.interface";
import type { TableSortState } from "@/shared/types/core.model";

/** Ant Design sortOrder 타입 */
export type AntdSortOrder = "ascend" | "descend";

/** parseSorter 반환 타입 */
export interface ParsedSortResult {
  field: string;
  direction: SortDirection;
}

/**
 * Ant Design sortOrder를 API SortDirection으로 변환
 * @param order - Ant Design 정렬 순서 ("ascend" | "descend")
 * @returns API 정렬 방향 ("ASC" | "DESC")
 */
export const toSortDirection = (order: AntdSortOrder): SortDirection =>
  order === "ascend" ? "ASC" : "DESC";

/**
 * API SortDirection을 Ant Design sortOrder로 변환
 * @param direction - API 정렬 방향 ("ASC" | "DESC")
 * @returns Ant Design 정렬 순서 ("ascend" | "descend")
 */
export const toSortOrder = (direction: SortDirection): AntdSortOrder =>
  direction === "ASC" ? "ascend" : "descend";

/**
 * 현재 정렬 상태에 따라 컬럼의 sortOrder 반환
 * @param sortState - 현재 정렬 상태 (sortBy, sortDirection)
 * @param field - 컬럼의 dataIndex
 * @returns 해당 컬럼이 정렬 중이면 sortOrder, 아니면 null
 */
export const getSortOrder = (
  sortState: TableSortState,
  field: string,
): AntdSortOrder | null =>
  sortState.sortBy === field ? toSortOrder(sortState.sortDirection) : null;

/**
 * Ant Design Table sorter를 파싱하여 API 요청용 정렬 정보 반환
 * @param sorter - Ant Design Table onChange의 sorter 파라미터
 * @returns 유효한 정렬이면 { field, direction }, 아니면 null
 */
export const parseSorter = <T>(
  sorter: SorterResult<T> | SorterResult<T>[],
): ParsedSortResult | null => {
  const single = Array.isArray(sorter) ? sorter[0] : sorter;

  if (!single.field || !single.order) return null;

  return {
    field: String(single.field),
    direction: toSortDirection(single.order),
  };
};
