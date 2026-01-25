import { atomWithReset } from "jotai/utils";

import type { GetUsageRequestListApprovalStatus } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import type { RequestImageSortState } from "@/domain/request-image/constants/request-image.constant";

/** 이미지 요청 페이지 번호 */
export const requestImagePageAtom = atomWithReset<number>(1);
/** 이미지 요청 검색어 */
export const requestImageSearchTextAtom = atomWithReset<string>("");
/** 이미지 요청 승인 상태 */
export const requestImageStatusAtom =
  atomWithReset<GetUsageRequestListApprovalStatus | null>(null);
/** 이미지 요청 워크스페이스 ID */
export const requestImageWorkspaceIdAtom = atomWithReset<number | null>(null);
/** 이미지 요청 정렬 상태 */
export const requestImageSortAtom = atomWithReset<RequestImageSortState>({
  field: "requestedAt",
  order: "descend",
});
