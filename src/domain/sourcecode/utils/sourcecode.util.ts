import type { TagProps } from "xiilab-ui";

import { SourceCodeListResponseSourceCodeType } from "@/api/generated/astragoBackendAPIDocumentation.schemas";

/**
 * 소스코드 타입 정보 조회
 * @param type - 소스코드 타입
 * @returns 타입 정보 (텍스트, 태그)
 */
export const getSourcecodeTypeInfo = (
  type: SourceCodeListResponseSourceCodeType,
) => {
  // 타입 표시 텍스트
  let text = "";
  // 태그 색상
  let tag: TagProps["variant"] = "yellow";

  if (type === SourceCodeListResponseSourceCodeType.GITHUB) {
    text = "GitHub";
    tag = "yellow";
  } else if (type === SourceCodeListResponseSourceCodeType.GITLAB) {
    text = "GitLab";
    tag = "yellow";
  } else if (type === SourceCodeListResponseSourceCodeType.BITBUCKET) {
    text = "BitBucket";
    tag = "purple";
  }

  return { text, tag };
};
