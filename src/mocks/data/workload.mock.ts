import { vulnerabilityListResponseSchema } from "@/domain/security/schemas/vulnerability.schema";
import {
  type ActiveWorkloadListType,
  activeWorkloadListSchema,
  type DisabledWorkloadListType,
  disabledWorkloadListSchema,
  type WorkloadListType,
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

export const workloadDetailMock = makeMock(workloadDetailSchema);

export const workloadVulnerabilityListMock = Array.from(
  { length: LIST_PAGE_SIZE },
  () => makeMock(vulnerabilityListResponseSchema),
);

/**
 * 동적 mock 데이터 생성 팩토리 함수
 * 매 호출마다 새로운 데이터를 생성하며, override를 통해 특정 필드 값을 고정할 수 있음
 * override.size로 생성할 개수를 지정할 수 있음 (기본값: LIST_PAGE_SIZE)
 * override.searchText가 전달되면 workloadName에 해당 텍스트가 포함됨
 */
export function createActiveWorkloadListMock(
  override?: Partial<ActiveWorkloadListType> & {
    size?: number;
    searchText?: string;
  },
): ActiveWorkloadListType[] {
  const { size = LIST_PAGE_SIZE, searchText, ...restOverride } = override ?? {};
  return Array.from({ length: size }, (_, index) => {
    const baseOverride = { ...restOverride };
    if (searchText) {
      baseOverride.workloadName = `${searchText}-workload-${index + 1}`;
    }
    return makeMock(activeWorkloadListSchema, baseOverride);
  });
}

export function createDisabledWorkloadListMock(
  override?: Partial<DisabledWorkloadListType> & {
    size?: number;
    searchText?: string;
  },
): DisabledWorkloadListType[] {
  const { size = LIST_PAGE_SIZE, searchText, ...restOverride } = override ?? {};
  return Array.from({ length: size }, (_, index) => {
    const baseOverride = { ...restOverride };
    if (searchText) {
      baseOverride.workloadName = `${searchText}-workload-${index + 1}`;
    }
    return makeMock(disabledWorkloadListSchema, baseOverride);
  });
}

export function createWorkloadListMock(
  override?: Partial<WorkloadListType> & { size?: number },
): WorkloadListType[] {
  const { size = LIST_PAGE_SIZE, ...restOverride } = override ?? {};
  return Array.from({ length: size }, () =>
    makeMock(workloadListSchema, restOverride),
  );
}
