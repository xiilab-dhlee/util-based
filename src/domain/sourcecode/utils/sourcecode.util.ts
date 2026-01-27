import type { TagProps } from "xiilab-ui";

import type {
  SourceCodeDetailResponseSourceCodeType,
  SourceCodeListResponseSourceCodeType,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";

/** 소스코드 타입 (List 및 Detail 응답 공용) */
type SourceCodeType =
  | SourceCodeListResponseSourceCodeType
  | SourceCodeDetailResponseSourceCodeType;

/**
 * 소스코드 타입 정보 조회
 * @param type - 소스코드 타입
 * @returns 타입 정보 (텍스트, 태그)
 */
export const getSourcecodeTypeInfo = (type?: SourceCodeType) => {
  // 타입 표시 텍스트
  let text = "-";
  // 태그 색상
  let tag: TagProps["variant"] = "yellow";

  if (type === "GITHUB") {
    text = "GitHub";
    tag = "yellow";
  } else if (type === "GITLAB") {
    text = "GitLab";
    tag = "yellow";
  } else if (type === "BITBUCKET") {
    text = "BitBucket";
    tag = "purple";
  }

  return { text, tag };
};
