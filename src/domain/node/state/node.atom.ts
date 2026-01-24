import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";

import type { NodeSortState } from "@/domain/node/constants/node-list.constant";
import type { MigGpu } from "@/domain/node/types/node.type";

/** 노드 페이지 번호 */
export const nodePageAtom = atomWithReset<number>(1);

/** 노드 정렬 상태 (기본값: 노드 이름 오름차순) */
export const nodeSortAtom = atomWithReset<NodeSortState>({
  field: "nodeName",
  order: "ascend",
});
/** MPS 설정 모달 표시 여부 */
export const openUpdateMpsModalAtom = atom<boolean>(false);
/** MIG GPU 제품 */
export const migGpuProductAtom = atom<string>("");
/** MIG GPU 목록 */
export const migGpusAtom = atom<MigGpu[]>([]);
/** MIG 선택된 GPU 인덱스 */
export const selectedMigGpuIndexAtom = atom<number>(-1);
/** MIG 선택된 개수 */
export const selectedMigCountAtom = atom<string>("DISABLED");
/** MIG 선택된 Config ID */
export const selectedMigConfigIdAtom = atom<number>(-1);
/** BMC 관리 모달 표시 여부 */
export const openManageBmcModalAtom = atom<boolean>(false);
/** Network Ports 모달 표시 여부 */
export const openViewNetworkPortsModalAtom = atom<boolean>(false);
