import {
  gpuListSchema,
  gpuNodeListSchema,
  gpuProfileListSchema,
} from "@/shared/schemas/gpu.schema";
import { makeMock } from "@/shared/utils/mock.util";

/**
 * GPU 목록 모킹 데이터
 * - 각 타입별로 최소 1개씩 보장
 */
export const gpuListMock = [
  // NORMAL 타입 2개
  { ...makeMock(gpuListSchema), type: "NORMAL" as const },
  { ...makeMock(gpuListSchema), type: "NORMAL" as const },
  // MIG 타입 1개
  { ...makeMock(gpuListSchema), type: "MIG" as const },
  // MPS 타입 1개
  { ...makeMock(gpuListSchema), type: "MPS" as const },
];

/**
 * GPU 노드 목록 모킹 데이터
 * - GPU와 연결하기 위해 gpuId를 gpuListMock의 id로 설정
 */
export const gpuNodeListMock = gpuListMock.flatMap((gpu) =>
  Array.from({ length: 2 }, () => ({
    ...makeMock(gpuNodeListSchema),
    gpuId: gpu.id,
  })),
);

/**
 * GPU 프로파일 목록 모킹 데이터
 */
export const gpuProfileListMock = Array.from({ length: 3 }, () =>
  makeMock(gpuProfileListSchema),
);
