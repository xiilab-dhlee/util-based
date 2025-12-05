import { atomWithReset } from "jotai/utils";

/** 파일 시스템 보안 검사 목록 페이지 번호 */
export const fileSecurityScanListPageAtom = atomWithReset<number>(1);

/** 파일 시스템 보안 취약점 목록 페이지 번호 */
export const fileSecurityVulnerabilityPageAtom = atomWithReset<number>(1);

/** 파일 시스템 보안 검사 파일 목록 페이지 번호 */
export const fileSecurityScanFilePageAtom = atomWithReset<number>(1);

/** 파일 시스템 보안 취약점 상세 목록 페이지 번호 */
export const fileSecurityVulnerabilityDetailPageAtom = atomWithReset<number>(1);
