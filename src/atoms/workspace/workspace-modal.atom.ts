import { atom } from "jotai";

/**
 * 워크스페이스 수정 모달에서 사용할 데이터 타입
 */
export interface UpdateWorkspaceModalData {
  id: string;
  name: string;
  description?: string;
}

/**
 * 워크스페이스 수정 모달의 열림/닫힘 상태를 관리하는 atom
 */
export const openUpdateWorkspaceModalAtom = atom<boolean>(false);

/**
 * 워크스페이스 수정 모달에서 사용할 데이터를 관리하는 atom
 */
export const updateWorkspaceModalDataAtom =
  atom<UpdateWorkspaceModalData | null>(null);

/**
 * 워크스페이스 수정 모달을 열고 데이터를 설정하는 액션 atom
 */
export const openUpdateWorkspaceModalWithDataAtom = atom(
  null,
  (_, set, data: UpdateWorkspaceModalData) => {
    set(updateWorkspaceModalDataAtom, data);
    set(openUpdateWorkspaceModalAtom, true);
  },
);

/**
 * 워크스페이스 수정 모달을 닫고 데이터를 초기화하는 액션 atom
 */
export const closeUpdateWorkspaceModalAtom = atom(null, (_, set) => {
  set(openUpdateWorkspaceModalAtom, false);
  set(updateWorkspaceModalDataAtom, null);
});

/**
 * 워크스페이스 삭제 모달에서 사용할 데이터 타입
 */
export interface DeleteSingleWorkspaceModalData {
  id: string;
  name: string;
}

/**
 * 워크스페이스 삭제 확인 모달의 열림/닫힘 상태를 관리하는 atom
 */
export const openDeleteSingleWorkspaceModalAtom = atom<boolean>(false);

/**
 * 워크스페이스 삭제 모달에서 사용할 데이터를 관리하는 atom
 */
export const deleteSingleWorkspaceModalDataAtom =
  atom<DeleteSingleWorkspaceModalData | null>(null);

/**
 * 워크스페이스 삭제 모달을 열고 데이터를 설정하는 액션 atom
 */
export const openDeleteSingleWorkspaceModalWithDataAtom = atom(
  null,
  (_, set, data: DeleteSingleWorkspaceModalData) => {
    set(deleteSingleWorkspaceModalDataAtom, data);
    set(openDeleteSingleWorkspaceModalAtom, true);
  },
);

/**
 * 워크스페이스 삭제 모달을 닫고 데이터를 초기화하는 액션 atom
 */
export const closeDeleteSingleWorkspaceModalAtom = atom(null, (_, set) => {
  set(openDeleteSingleWorkspaceModalAtom, false);
  set(deleteSingleWorkspaceModalDataAtom, null);
});
