import { z } from "zod";

// ============================================================================
// 그룹 트리 노드 타입
// ============================================================================

/** 그룹 트리 노드 타입 enum (스키마 + 런타임 상수) */
export const groupTreeNodeTypeSchema = z.enum(["group", "account"]);
export type GroupTreeNodeType = z.infer<typeof groupTreeNodeTypeSchema>;

/** 트리 노드 타입 상수 (런타임에서 사용) */
export const GROUP_TREE_NODE_TYPE = groupTreeNodeTypeSchema.Enum;

// ============================================================================
// 그룹 트리 스키마 (재귀적 구조)
// ============================================================================

/** 그룹 트리 노드 스키마 */
const baseGroupTreeSchema: z.ZodType<{
  id: string;
  name: string;
  nodeType: GroupTreeNodeType;
  children: GroupTreeType[];
  email?: string;
}> = z.lazy(() =>
  z.object({
    /** 노드 고유 ID */
    id: z.string(),
    /** 노드 표시 이름 */
    name: z.string(),
    /** 노드 타입 (group 또는 account) */
    nodeType: groupTreeNodeTypeSchema,
    /** 자식 노드 목록 */
    children: z.array(baseGroupTreeSchema),
    /** 이메일 (account 노드인 경우에만) */
    email: z.string().optional(),
  }),
);

export const groupTreeSchema = baseGroupTreeSchema;
export const groupTreeArraySchema = z.array(groupTreeSchema);

// ============================================================================
// 타입 추출
// ============================================================================

/** 그룹 트리 노드 타입 */
export type GroupTreeType = z.infer<typeof groupTreeSchema>;

/** 그룹 트리 배열 타입 */
export type GroupTreeArrayType = z.infer<typeof groupTreeArraySchema>;

// ============================================================================
// 그룹 상세 API 응답 스키마
// ============================================================================

/** 그룹 내 계정 정보 스키마 */
export const groupUserSchema = z.object({
  /** 계정 ID */
  accountId: z.string(),
  /** 계정 이름 */
  accountName: z.string(),
  /** 이메일 */
  email: z.string().email(),
});

/** 그룹 상세 정보 응답 스키마 */
export const groupDetailResponseSchema = z.object({
  /** 그룹 이름 */
  groupName: z.string(),
  /** 그룹 설명 */
  description: z.string().nullable(),
  /** 생성자 ID */
  creatorId: z.string(),
  /** 생성자 이름 */
  creatorName: z.string(),
  /** 생성일시 */
  createDateTime: z.coerce.date(),
  /** 그룹 내 사용자 목록 */
  users: z.array(groupUserSchema),
});

export type GroupUserType = z.infer<typeof groupUserSchema>;
export type GroupDetailResponseType = z.infer<typeof groupDetailResponseSchema>;
