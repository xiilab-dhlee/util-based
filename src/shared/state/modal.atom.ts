import { atom } from "jotai";

/** 취약점 확인 모달 표시 여부 */
export const openViewVulnerabilityModalAtom = atom<boolean>(false);
/** 크레덴셜 추가 모달 표시 여부 */
export const openCreateCredentialModalAtom = atom<boolean>(false);
/** 워크스페이스 추가 모달 표시 여부 */
export const openCreateWorkspaceModalAtom = atom<boolean>(false);
/** 워크스페이스 수정 모달 표시 여부 */
export const openUpdateWorkspaceModalAtom = atom<boolean>(false);
/** 요청 사유 조회 모달 표시 여부 */
export const openViewRequestReasonModalAtom = atom<boolean>(false);
/** 반려 사유 조회 모달 표시 여부 */
export const openViewRejectReasonModalAtom = atom<boolean>(false);
/** 비밀번호 재확인 모달 표시 여부 */
export const openCheckPasswordModalAtom = atom<boolean>(false);
/** 비밀번호 수정 모달 표시 여부 */
export const openUpdatePasswordModalAtom = atom<boolean>(false);
/** 프로필 팝오버 표시 여부 */
export const openProfilePopoverAtom = atom<boolean>(false);
/** 워크로드 생성 드로어 표시 여부 */
export const openCreateWorkloadDrawerAtom = atom<boolean>(false);
/** 워크로드 가져오기 모달 표시 여부 */
export const openSelectWorkloadModalAtom = atom<boolean>(false);
