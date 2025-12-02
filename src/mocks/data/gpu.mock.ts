import {
  gpuListSchema,
  gpuNodeListSchema,
  gpuProfileListSchema,
} from "@/shared/schemas/gpu.schema";
import { makeMock } from "@/shared/utils/mock.util";

/**
 * GPU 목록 모킹 데이터
 */
export const gpuListMock = Array.from({ length: 10 }, () =>
  makeMock(gpuListSchema),
);

/**
 * GPU 노드 목록 모킹 데이터
 */
export const gpuNodeListMock = Array.from({ length: 2 }, () =>
  makeMock(gpuNodeListSchema),
);

/**
 * GPU 프로파일 목록 모킹 데이터
 */
export const gpuProfileListMock = Array.from({ length: 2 }, () =>
  makeMock(gpuProfileListSchema),
);
