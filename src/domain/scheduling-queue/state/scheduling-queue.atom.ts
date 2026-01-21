import { atomWithReset } from "jotai/utils";

import type { GetPendingWorkloadsJobType } from "@/api/generated/astragoBackendAPIDocumentation.schemas";

/** 대기중인 워크로드 페이지 번호 */
export const pendingWorkloadPageAtom = atomWithReset<number>(1);

/** Job Type 필터 */
export const pendingWorkloadJobTypeAtom = atomWithReset<
  GetPendingWorkloadsJobType | undefined
>(undefined);

/** 검색어 */
export const pendingWorkloadSearchAtom = atomWithReset<string>("");
