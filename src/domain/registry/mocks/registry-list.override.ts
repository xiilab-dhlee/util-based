import { faker } from "@faker-js/faker";

import {
  GetPrivateRegistryListImageSourceType,
  GetPrivateRegistryListOrder,
  GetPrivateRegistryListSort,
  type RegistryListResponse,
  type RegistryListResponseImageSourceType,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  getGetPrivateRegistryListMockHandler,
  getGetPrivateRegistryListResponseMock,
} from "@/api/generated/private-registry/private-registry.msw";
import {
  getGetPublicRegistryListMockHandler,
  getGetPublicRegistryListResponseMock,
} from "@/api/generated/public-registry/public-registry.msw";
import {
  DAY_IN_MS,
  MOCK_BASE_TIMESTAMP,
} from "@/shared/constants/date.constant";

/**
 * 정렬 가능한 imageDisplayName 생성
 * 정렬 시 순서가 올바르게 유지되도록 숫자 패딩 사용
 * ASC: {prefix}-image-001, {prefix}-image-002, ... (오름차순)
 * DESC: {prefix}-image-999, {prefix}-image-998, ... (내림차순)
 *
 * keyword가 있는 경우에도 sort/order를 적용하여 정렬 순서 보장
 */
function generateImageDisplayName(
  index: number,
  keyword: string,
  sort: string,
  order: string,
  prefix: string,
): string {
  const namePrefix = keyword || `${prefix}-image`;

  if (sort === "IMAGE_NAME") {
    // 3자리 숫자로 패딩하여 정렬 순서 보장
    const paddedIndex = String((index % 1000) + 1).padStart(3, "0");
    // ASC: 001, 002, 003... / DESC: 999, 998, 997...
    const sortableValue = 999 - (index % 1000);
    const sortableNum =
      order === GetPrivateRegistryListOrder.ASC
        ? paddedIndex
        : String(sortableValue).padStart(3, "0");
    return `${namePrefix}-${sortableNum}`;
  }

  return `${namePrefix}-${index}`;
}

/**
 * 정렬 순서에 따른 createdAt 생성
 */
function generateCreatedAt(
  index: number,
  sort: string,
  order: string,
  baseTimestamp: number = MOCK_BASE_TIMESTAMP,
): string {
  if (sort === GetPrivateRegistryListSort.CREATED_AT) {
    const safeIndex = Math.min(Math.max(index, 0), 29);
    const offset =
      order === GetPrivateRegistryListOrder.ASC
        ? (30 - safeIndex) * DAY_IN_MS
        : safeIndex * DAY_IN_MS;
    return new Date(baseTimestamp - offset).toISOString();
  }
  return new Date(baseTimestamp - index * DAY_IN_MS).toISOString();
}

/**
 * 인덱스에 따른 이미지 소스 타입 생성
 * 짝수: SNAPSHOT, 홀수: EXTERNAL
 */
function generateImageSourceType(
  index: number,
): RegistryListResponseImageSourceType {
  return index % 2 === 0
    ? GetPrivateRegistryListImageSourceType.SNAPSHOT
    : GetPrivateRegistryListImageSourceType.EXTERNAL;
}

/**
 * 레지스트리 목록 mock 핸들러 생성 팩토리
 */
function createRegistryListHandler<T>(
  getMockHandler: (
    handler: (info: { request: Request }) => Promise<T>,
  ) => ReturnType<typeof getGetPrivateRegistryListMockHandler>,
  getResponseMock: (override?: {
    data?: {
      totalSize: number;
      totalPageNum: number;
      currentPageNo: number;
      content: RegistryListResponse[];
    };
  }) => T,
  prefix: string,
) {
  return getMockHandler(async (info) => {
    const url = new URL(info.request.url);

    // 평탄화된 파라미터 파싱
    const keyword = url.searchParams.get("keyword") || "";
    const pageNo = Number.parseInt(url.searchParams.get("pageNo") || "0", 10);
    const pageSize = Number.parseInt(
      url.searchParams.get("pageSize") || "10",
      10,
    );
    const sort =
      url.searchParams.get("sort") || GetPrivateRegistryListSort.CREATED_AT;
    const order =
      url.searchParams.get("order") || GetPrivateRegistryListOrder.DESC;
    const imageSourceType = url.searchParams.get(
      "imageSourceType",
    ) as GetPrivateRegistryListImageSourceType | null;

    // 필터링이 있으면 해당 타입만, 없으면 전체
    const baseTotalSize = pageSize * 3;
    // 필터 적용 시 해당 타입의 절반 정도로 가정
    const totalSize = imageSourceType
      ? Math.ceil(baseTotalSize / 2)
      : baseTotalSize;

    // baseItem을 루프 외부에서 한 번만 생성 (성능 최적화)
    const mockResponse = getResponseMock();
    const baseItem = (
      mockResponse as { data?: { content?: RegistryListResponse[] } }
    ).data?.content?.[0];

    // 검색/정렬 관련 필드만 오버라이드, 나머지는 faker 원본 사용
    const content: RegistryListResponse[] = Array.from(
      { length: pageSize },
      (_, index) => {
        const globalIndex = pageNo * pageSize + index + 1;

        // 필터가 적용된 경우 해당 타입만, 아니면 인덱스 기반 타입
        const itemImageSourceType = imageSourceType
          ? imageSourceType
          : generateImageSourceType(globalIndex);

        return {
          ...baseItem,
          imageId: globalIndex,
          imageDisplayName: generateImageDisplayName(
            globalIndex,
            keyword,
            sort,
            order,
            prefix,
          ),
          latestImageTagName: "v0.0.0",
          createdAt: generateCreatedAt(globalIndex, sort, order),
          downloadCount: faker.number.int({ min: 0, max: 10000 }),
          imageTagCount: faker.number.int({ min: 0, max: 10000 }),
          imageSourceType: itemImageSourceType,
          harborImageName: globalIndex.toString(),
        } as RegistryListResponse;
      },
    );

    return getResponseMock({
      data: {
        totalSize,
        totalPageNum: Math.ceil(totalSize / pageSize),
        currentPageNo: pageNo,
        content,
      },
    });
  });
}

export const registryListOverrideHandlers = [
  // Private registry list handler
  createRegistryListHandler(
    getGetPrivateRegistryListMockHandler,
    getGetPrivateRegistryListResponseMock,
    "private",
  ),
  // Public registry list handler
  createRegistryListHandler(
    getGetPublicRegistryListMockHandler,
    getGetPublicRegistryListResponseMock,
    "public",
  ),
];
