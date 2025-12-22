import {
  type ActiveWorkloadListType,
  activeWorkloadListSchema,
  type WorkloadListType,
  workloadDetailSchema,
  workloadListSchema,
} from "@/domain/workload/schemas/workload.schema";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { makeMock } from "@/shared/utils/mock.util";

export const workloadListMock = Array.from({ length: LIST_PAGE_SIZE }, () =>
  makeMock(workloadListSchema),
);

export const workloadDetailMock = makeMock(workloadDetailSchema);

/**
 * 제네릭 워크로드 목록 mock 생성 팩토리 함수
 * @param schema - Zod schema for the workload type
 * @param override - Partial override object with optional size and searchText
 * @returns Array of mocked workload data
 */
function createGenericWorkloadListMock<T extends { workloadName: string }>(
  schema: Parameters<typeof makeMock>[0],
  override?: Partial<T> & {
    size?: number;
    searchText?: string;
  },
): T[] {
  const { size = LIST_PAGE_SIZE, searchText, ...restOverride } = override ?? {};
  return Array.from({ length: size }, (_, index) => {
    const baseOverride = { ...restOverride };
    if (searchText) {
      baseOverride.workloadName = `${searchText}-workload-${index + 1}`;
    }

    return makeMock(schema, baseOverride) as T;
  });
}

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
  return createGenericWorkloadListMock<ActiveWorkloadListType>(
    activeWorkloadListSchema,
    override,
  );
}

/**
 * 워크로드 목록 mock 생성 함수
 * - status가 "COMPLETED"일 경우 revokeWarningCount를 0으로 자동 설정
 * - searchText가 전달되면 workloadName에 해당 텍스트가 포함됨
 */
export function createWorkloadListMock(
  override?: Partial<WorkloadListType> & {
    size?: number;
    searchText?: string;
  },
): WorkloadListType[] {
  // status=COMPLETED일 때 revokeWarningCount 기본값 0 설정
  // 사용자가 명시적으로 전달한 override는 우선 적용
  const enhancedOverride = {
    ...(override?.status === "COMPLETED" && { revokeWarningCount: 0 }),
    ...override,
  };

  return createGenericWorkloadListMock<WorkloadListType>(
    workloadListSchema,
    enhancedOverride,
  );
}
