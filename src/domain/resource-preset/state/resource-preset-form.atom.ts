import { atom } from "jotai";

/**
 * 리소스 프리셋 생성 드로어 열림 상태
 *
 * React Hook Form으로 이전하여 폼 상태 관련 atom은 삭제됨
 * Drawer 열림 상태만 Jotai atom으로 유지
 */
export const openCreateResourcePresetDrawerAtom = atom(false);
