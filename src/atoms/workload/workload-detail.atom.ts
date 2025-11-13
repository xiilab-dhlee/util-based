import { atom } from "jotai";

// 커밋 이미지 생성 모달 표시 여부
export const openCreateCommitImageModalAtom = atom<boolean>(false);
// 워크로드 수정 모달 표시 여부
export const openUpdateWorkloadModalAtom = atom<boolean>(false);
// 워크로드 모니터링 모달 표시 여부(모니터링)
export const openViewWorkloadMonitoringModalAtom = atom<boolean>(false);
// 워크로드 모니터링 드로어 표시 여부(로그, 웹터미널)
export const openViewWorkloadMonitoringDrawerAtom = atom<boolean>(false);
