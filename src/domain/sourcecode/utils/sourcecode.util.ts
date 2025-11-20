import type { SourcecodeCodeType } from "@/domain/sourcecode/schemas/sourcecode.schema";

/**
 * 소스코드 타입 정보 조회
 * @param codeType - 소스코드 타입
 * @returns 타입 정보 (텍스트, 태그)
 */
export const getSourcecodeTypeInfo = (codeType: SourcecodeCodeType) => {
  // 타입 표시 텍스트
  let text = "";
  // 태그 색상
  let tag = "";

  if (codeType === "GIT_HUB") {
    text = "GitHub";
    tag = "yellow";
  } else if (codeType === "GIT_LAB") {
    text = "GitLab";
    tag = "yellow";
  } else if (codeType === "BIT_BUCKET") {
    text = "BitBucket";
    tag = "purple";
  }

  return { text, tag };
};
