import { vulnerabilityListResponseSchema } from "@/domain/security/schemas/vulnerability.schema";
import {
  activeWorkloadListSchema,
  disabledWorkloadListSchema,
  workloadDetailSchema,
  workloadListSchema,
} from "@/domain/workload/schemas/workload.schema";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { makeMock } from "@/shared/utils/mock.util";

export const workloadListMock = Array.from({ length: LIST_PAGE_SIZE }, () =>
  makeMock(workloadListSchema),
);

export const activeWorkloadListMock = Array.from(
  { length: LIST_PAGE_SIZE },
  () => makeMock(activeWorkloadListSchema),
);

export const disabledWorkloadListMock = Array.from(
  { length: LIST_PAGE_SIZE },
  () => makeMock(disabledWorkloadListSchema),
);

// 기본 상세 조회용 mock 데이터
const baseDetailMock = makeMock(workloadDetailSchema);

// workloadListMock의 첫 번째 워크로드 정보와 동기화된 상세 mock
export const workloadDetailMock = {
  ...baseDetailMock,
  workloadName: workloadListMock[0].workloadName,
  description: workloadListMock[0].description,
  jobType: workloadListMock[0].jobType,
};

export const workloadVulnerabilityListMock = Array.from(
  { length: LIST_PAGE_SIZE },
  () => makeMock(vulnerabilityListResponseSchema),
);
