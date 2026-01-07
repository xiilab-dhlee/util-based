import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";

/** 레지스트리 보안 이미지 태그 취약점 페이지 번호 */
export const registrySecurityTagVulnerabilityPageAtom =
  atomWithReset<number>(1);

/** 레지스트리 보안 레벨 설정 모달 표시 여부 */
export const openRegistrySecurityLevelSettingModalAtom = atom<boolean>(false);
