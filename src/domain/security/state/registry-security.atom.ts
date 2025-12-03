import { atomWithReset } from "jotai/utils";

/** 레지스트리 보안 이미지 태그 취약점 페이지 번호 */
export const registrySecurityTagVulnerabilityPageAtom =
  atomWithReset<number>(1);
