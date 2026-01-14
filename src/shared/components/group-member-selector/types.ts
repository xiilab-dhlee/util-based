import type {
  GroupMemberResponse,
  GroupSummaryResponse,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";

export const ITEM_TYPES = {
  ACCOUNT: "account",
  GROUP: "group",
} as const;

export const NODE_POSITIONS = {
  FIRST: "first",
  MIDDLE: "middle",
  LAST: "last",
} as const;

export type ItemType = (typeof ITEM_TYPES)[keyof typeof ITEM_TYPES];
export type NodePosition = (typeof NODE_POSITIONS)[keyof typeof NODE_POSITIONS];

export type SelectableItem =
  | { type: typeof ITEM_TYPES.ACCOUNT; data: GroupMemberResponse }
  | { type: typeof ITEM_TYPES.GROUP; data: GroupSummaryResponse };
