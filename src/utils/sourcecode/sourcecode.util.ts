import type { SourcecodeCodeType } from "@/schemas/sourcecode.schema";

/**
 * 소스코드 타입과 텍스트를 한 번에 관리하는 매핑
 */
const TYPE_MAP: Record<SourcecodeCodeType, any> = {
  GIT_HUB: {
    text: "GitHub",
    tag: "yellow",
  },
  GIT_LAB: {
    text: "GitLab",
    tag: "yellow",
  },
  BIT_BUCKET: {
    text: "BitBucket",
    tag: "purple",
  },
} as const;

interface SourcecodeTypeInfo {
  text: string;
  tag: string;
}

/**
 * 소스코드 타입 정보 조회
 * @param status - 소스코드 타입
 * @returns 타입 정보 (텍스트, 태그)
 */
export function getSourcecodeTypeInfo(
  status: SourcecodeCodeType,
): SourcecodeTypeInfo {
  return TYPE_MAP[status];
}
