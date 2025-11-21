import { z } from "zod";

/**
 * 워크스페이스 멤버 기본 스키마
 * API에서 사용되는 모든 필드를 정의
 */
const baseWorkspaceMemberSchema = z.object({
  /** 멤버 ID */
  id: z.string(),
  /** 멤버 이름 */
  name: z.string().min(1).max(100),
  /** 그룹 */
  group: z.string().min(1).max(100),
  /** 권한 */
  role: z.enum(["USER", "ADMIN"]),
  /** 이메일 */
  email: z.string().email(),
  /** 워크스페이스 보유 수 */
  workspaceCount: z.number().int().min(1).max(100),
  /** 워크스페이스 생성 제한 */
  limitWorkspaceCreate: z.number().int().min(1).max(100),
  /** 멤버 추가 날짜 */
  creatorDate: z.string().datetime(),
  /** 상태 */
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

/**
 * 워크스페이스 멤버 목록 스키마
 */
export const workspaceMemberListSchema = baseWorkspaceMemberSchema.pick({
  id: true,
  name: true,
  group: true,
  role: true,
  email: true,
  workspaceCount: true,
  limitWorkspaceCreate: true,
  creatorDate: true,
  status: true,
});

/**
 * 워크스페이스 멤버 목록 타입
 */
export type WorkspaceMemberListType = z.infer<typeof workspaceMemberListSchema>;
export type WorkspaceMemberIdType = WorkspaceMemberListType["id"];
