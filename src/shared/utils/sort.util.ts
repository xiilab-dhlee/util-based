import type { SorterResult } from "antd/es/table/interface";

import type {
  AntdTableSortOrder,
  AntdTableSortState,
} from "@/shared/types/core.model";

type SortDirection = "ASC" | "DESC";

export type BackendOrder = SortDirection;

/** parseSorter 반환 타입 */
export interface ParsedSortResult {
  field: string;
  direction: SortDirection;
}

/**
 * Ant Design sortOrder를 API SortDirection으로 변환
 */
export const toSortDirection = (order: AntdTableSortOrder): SortDirection =>
  order === "ascend" ? "ASC" : "DESC";

/**
 * API SortDirection을 Ant Design sortOrder로 변환
 */
export const toSortOrder = (direction: SortDirection): AntdTableSortOrder =>
  direction === "ASC" ? "ascend" : "descend";

export function toBackendOrder(order: AntdTableSortOrder): BackendOrder {
  return order === "ascend" ? "ASC" : "DESC";
}

export function buildSortRequest<TField extends string, TSortEnum>(args: {
  state: AntdTableSortState<TField>;
  fieldMap: Record<TField, TSortEnum>;
}): { sort: TSortEnum; order: BackendOrder } | null {
  if (!args.state.field || !args.state.order) return null;

  return {
    sort: args.fieldMap[args.state.field],
    order: toBackendOrder(args.state.order),
  };
}

export const getColumnSortOrder = <TField extends string>(
  sortState: AntdTableSortState<TField>,
  field: TField,
): AntdTableSortOrder | undefined => {
  if (sortState.field !== field) return undefined;
  return sortState.order ?? undefined;
};

export const parseSorterToAntdState = <T>(
  sorter: SorterResult<T> | SorterResult<T>[],
): AntdTableSortState => {
  const single = Array.isArray(sorter) ? sorter[0] : sorter;

  return {
    field: single.field ? String(single.field) : null,
    order: (single.order ?? null) as AntdTableSortOrder | null,
  };
};
