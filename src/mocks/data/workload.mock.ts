import { sourcecodeListSchema } from "@/domain/sourcecode/schemas/sourcecode.schema";
import { volumeListSchema } from "@/domain/volume/schemas/volume.schema";
import { WORKLOAD_STATUS } from "@/domain/workload/constants/workload.constant";
import {
  type WorkloadListType,
  type WorkloadStatusType,
  workloadDetailSchema,
  workloadListSchema,
} from "@/domain/workload/schemas/workload.schema";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { makeMock } from "@/shared/utils/mock.util";

export const workloadListMock = Array.from({ length: LIST_PAGE_SIZE }, () =>
  makeMock(workloadListSchema),
);

/**
 * 워크로드 상세 Mock 데이터
 *
 * sourcecodes와 volumes에 최소 1개 이상의 데이터를 포함하여
 * E2E 테스트에서 카드 검증이 가능하도록 함
 */
export const workloadDetailMock = makeMock(workloadDetailSchema, {
  sourcecodes: [
    {
      ...makeMock(sourcecodeListSchema),
      branch: "main",
      path: "/workspace/project",
    },
  ],
  volumes: [makeMock(volumeListSchema)],
});

/**
 * 랜덤 상태 선택 헬퍼 함수
 * @param excludeStatuses - 제외할 상태 목록
 * @returns 랜덤 선택된 상태
 */
function getRandomStatus(
  excludeStatuses: WorkloadStatusType[] = [],
): WorkloadStatusType {
  const availableStatuses = WORKLOAD_STATUS.filter(
    (status) => !excludeStatuses.includes(status),
  );

  if (availableStatuses.length === 0) {
    return WORKLOAD_STATUS[0]; // 기본값 반환
  }
  return availableStatuses[
    Math.floor(Math.random() * availableStatuses.length)
  ] as WorkloadStatusType;
}

/** 워크로드 mock 생성 옵션 타입 */
type WorkloadMockOptions = Partial<WorkloadListType> & {
  size?: number;
  searchText?: string;
  /** 상태 선택 시 제외할 상태 목록 (status 미지정 시에만 적용) */
  excludeStatuses?: WorkloadStatusType[];
};

/**
 * 워크로드 목록 mock 생성 함수
 * - status가 전달되지 않으면 RUNNING, PENDING, COMPLETED 중 랜덤 선택
 * - excludeStatuses로 특정 상태 제외 가능 (활성화 목록에서 COMPLETED 제외 등)
 * - status가 "COMPLETED"일 경우 revokeWarningCount를 0으로 자동 설정
 * - searchText가 전달되면 workloadName에 해당 텍스트가 포함됨
 */
export function createWorkloadListMock(
  override?: WorkloadMockOptions,
): WorkloadListType[] {
  const {
    size = LIST_PAGE_SIZE,
    searchText,
    excludeStatuses = [],
    ...restOverride
  } = override ?? {};

  return Array.from({ length: size }, (_, index) => {
    // status가 전달되지 않으면 랜덤 선택 (excludeStatuses 적용)
    const status = restOverride.status ?? getRandomStatus(excludeStatuses);

    // isRevoked 결정: COMPLETED일 때만 확률적으로 true, 그 외는 항상 false
    const isRevoked = status === "COMPLETED" ? Math.random() < 0.3 : false;

    // revokeWarningCount 결정:
    // - COMPLETED: 항상 0 (비활성화 목록에서는 회수 경고 없음)
    // - 그 외: 확률적으로 0 (30% 확률)
    const revokeWarningCount =
      status === "COMPLETED" ? 0 : Math.random() < 0.3 ? 0 : undefined;

    const baseOverride: Partial<WorkloadListType> = {
      ...restOverride,
      status,
      isRevoked,
      ...(revokeWarningCount !== undefined && { revokeWarningCount }),
    };

    // searchText가 있으면 workloadName에 포함
    if (searchText) {
      baseOverride.workloadName = `${searchText}-workload-${index + 1}`;
    }

    return makeMock(workloadListSchema, baseOverride);
  });
}
