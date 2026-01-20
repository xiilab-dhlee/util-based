import {
  type RequestResourceListType,
  type RequestResourceMigGpuType,
  requestResourceListSchema,
} from "@/domain/request-resource/schemas/request-resource.schema";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { makeMock } from "@/shared/utils/mock.util";

/** MIG GPU 기본 프로파일 목록 */
const DEFAULT_MIG_GPU_PROFILES: RequestResourceMigGpuType = [
  { "7g.120gb": 1 },
  { "4g.60gb": 1 },
  { "3g.60gb": 1 },
  { "2g.30gb": 4 },
  { "1g.15gb": 7 },
];

/** 리소스 요청 mock 생성 옵션 타입 */
type RequestResourceMockOptions = Partial<RequestResourceListType> & {
  size?: number;
  searchText?: string;
};

/**
 * 리소스 요청 목록 mock 생성 함수
 * - searchText가 전달되면 workspaceName에 해당 텍스트가 포함됨
 * - migGpu는 기본 프로파일 목록으로 설정 (override 가능)
 */
export function createRequestResourceListMock(
  override?: RequestResourceMockOptions,
): RequestResourceListType[] {
  const { size = LIST_PAGE_SIZE, searchText, ...restOverride } = override ?? {};

  return Array.from({ length: size }, (_, index) => {
    const baseOverride: Partial<RequestResourceListType> = {
      ...restOverride,
      // migGpu가 override에 없으면 기본값 사용
      migGpu: DEFAULT_MIG_GPU_PROFILES,
    };

    // searchText가 있으면 workspaceName에 포함
    if (searchText) {
      baseOverride.workspaceName = `${searchText}-workspace-${index + 1}`;
    }

    return makeMock(requestResourceListSchema, baseOverride);
  });
}
