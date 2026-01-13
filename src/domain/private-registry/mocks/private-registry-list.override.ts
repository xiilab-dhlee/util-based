import { faker } from "@faker-js/faker";

import {
  GetPrivateRegistryListOrder,
  GetPrivateRegistryListSort,
  type RegistryListResponse,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  getGetPrivateRegistryListMockHandler,
  getGetPrivateRegistryListResponseMock,
} from "@/api/generated/private-registry/private-registry.msw";
import {
  DAY_IN_MS,
  MOCK_BASE_TIMESTAMP,
} from "@/shared/constants/date.constant";

/**
 * 정렬 가능한 imageDisplayName 생성
 * 정렬 시 순서가 올바르게 유지되도록 숫자 패딩 사용
 * ASC: private-image-001, private-image-002, ... (오름차순)
 * DESC: private-image-999, private-image-998, ... (내림차순)
 *
 * keyword가 있는 경우에도 sort/order를 적용하여 정렬 순서 보장
 */
function generateImageDisplayName(
  index: number,
  keyword: string,
  sort: string,
  order: string,
): string {
  const prefix = keyword || "private-image";

  if (sort === "IMAGE_NAME") {
    // 3자리 숫자로 패딩하여 정렬 순서 보장
    const paddedIndex = String((index % 1000) + 1).padStart(3, "0");
    // ASC: 001, 002, 003... / DESC: 999, 998, 997...
    const sortableValue = 999 - (index % 1000);
    const sortableNum =
      order === GetPrivateRegistryListOrder.ASC
        ? paddedIndex
        : String(sortableValue).padStart(3, "0");
    return `${prefix}-${sortableNum}`;
  }

  return `${prefix}-${index + 1}`;
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

export const privateRegistryListOverrideHandlers = [
  getGetPrivateRegistryListMockHandler(async (info) => {
    const url = new URL(info.request.url);
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

    const totalSize = pageSize * 3;

    // 검색/정렬 관련 필드만 오버라이드, 나머지는 faker 원본 사용
    const content: RegistryListResponse[] = Array.from(
      { length: pageSize },
      (_, index) => {
        const globalIndex = pageNo * pageSize + index;
        const baseItem =
          getGetPrivateRegistryListResponseMock().data?.content?.[0];

        return {
          ...baseItem,
          imageDisplayName: generateImageDisplayName(
            globalIndex,
            keyword,
            sort,
            order,
          ),
          latestImageTagName: "v0.0.0",
          createdAt: generateCreatedAt(globalIndex, sort, order),
          downloadCount: faker.number.int({ min: 0, max: 10000 }),
          imageTagCount: faker.number.int({ min: 0, max: 10000 }),
        } as RegistryListResponse;
      },
    );

    return getGetPrivateRegistryListResponseMock({
      data: {
        totalSize,
        totalPageNum: Math.ceil(totalSize / pageSize),
        currentPageNo: pageNo,
        content,
      },
    });
  }),
];
