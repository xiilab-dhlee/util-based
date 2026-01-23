import type { ClusterNodeSortRequestSort } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import type { AntdTableSortState } from "@/shared/types/core.model";

export const NODE_SORT_FIELD_MAP = {
  nodeName: "NODE_NAME",
} as const satisfies Record<string, ClusterNodeSortRequestSort>;

/** 노드 정렬 필드 타입 */
export type NodeSortField = keyof typeof NODE_SORT_FIELD_MAP;

/** 노드 허용 정렬 필드 목록 */
export const NODE_SORT_FIELDS = Object.keys(
  NODE_SORT_FIELD_MAP,
) as NodeSortField[];

/** 노드 정렬 상태 타입 */
export type NodeSortState = AntdTableSortState<NodeSortField>;
