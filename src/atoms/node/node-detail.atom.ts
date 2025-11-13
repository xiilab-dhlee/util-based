import { atom } from "jotai";

// BMC 관리(Create/Update) 모달 표시 여부
export const openManageBmcModalAtom = atom<boolean>(false);
// Network Ports 모달 표시 여부
export const openViewNetworkPortsModalAtom = atom<boolean>(false);
