import { faker } from "@faker-js/faker";

import {
  GetPublicImageTagListOrder,
  GetPublicImageTagListSort,
  type ImageTagListResponse,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  getGetPublicImageTagListMockHandler,
  getGetPublicImageTagListResponseMock,
} from "@/api/generated/public-registry/public-registry.msw";
import {
  DAY_IN_MS,
  MOCK_BASE_TIMESTAMP,
} from "@/shared/constants/date.constant";

/**
 * 검색 키워드가 포함된 imageTagName 생성
 */
function generateImageTagName(index: number, keyword: string): string {
  const prefix = keyword || "v1";
  return `${prefix}.${index}.0`;
}

/**
 * 1 ~ max 범위의 랜덤 정수 생성
 */
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * vulnerability 필드 생성 (각 개수: 1 ~ 10000)
 */
function generateVulnerability() {
  const criticalCount = randomInt(1, 10000);
  const highCount = randomInt(1, 10000);
  const mediumCount = randomInt(1, 10000);
  const lowCount = randomInt(1, 10000);

  return {
    criticalCount,
    highCount,
    mediumCount,
    lowCount,
    totalCount: criticalCount + highCount + mediumCount + lowCount,
  };
}

/**
 * 정렬 순서에 따른 createDateTime 생성
 */
function generateCreatedAt(
  index: number,
  sort: string,
  order: string,
  baseTimestamp: number = MOCK_BASE_TIMESTAMP,
): string {
  if (sort === GetPublicImageTagListSort.CREATED_AT) {
    const safeIndex = Math.min(Math.max(index, 0), 29);
    const offset =
      order === GetPublicImageTagListOrder.ASC
        ? (30 - safeIndex) * DAY_IN_MS
        : safeIndex * DAY_IN_MS;
    return new Date(baseTimestamp - offset).toISOString();
  }
  return new Date(baseTimestamp - index * DAY_IN_MS).toISOString();
}

export const publicRegistryTagListOverrideHandlers = [
  getGetPublicImageTagListMockHandler(async (info) => {
    const url = new URL(info.request.url);
    const keyword = url.searchParams.get("keyword") || "";
    const pageNo = Number.parseInt(url.searchParams.get("pageNo") || "0", 10);
    const pageSize = Number.parseInt(
      url.searchParams.get("pageSize") || "10",
      10,
    );
    const sort =
      url.searchParams.get("sort") || GetPublicImageTagListSort.CREATED_AT;
    const order =
      url.searchParams.get("order") || GetPublicImageTagListOrder.DESC;

    const totalSize = pageSize * 3;

    // baseItem을 루프 외부에서 한 번만 생성 (성능 최적화)
    const mockResponse = getGetPublicImageTagListResponseMock();
    const baseItem = mockResponse.data?.content?.[0];

    // 검색/정렬 관련 필드만 오버라이드, 나머지는 faker 원본 사용
    const content: ImageTagListResponse[] = Array.from(
      { length: pageSize },
      (_, index) => {
        const globalIndex = pageNo * pageSize + index;

        return {
          ...baseItem,
          harborArtifactId: globalIndex + 1,
          imageTagName: generateImageTagName(globalIndex, keyword),
          createDateTime: generateCreatedAt(globalIndex, sort, order),
          vulnerability: generateVulnerability(),
          creatorName: "관리자",
          scanStatus: faker.helpers.arrayElement([
            "COMPLETED",
            "FAILED",
            "IN_PROGRESS",
            null,
          ]),
          hasMetadata: true,
        } as ImageTagListResponse;
      },
    );

    return getGetPublicImageTagListResponseMock({
      data: {
        totalSize,
        totalPageNum: Math.ceil(totalSize / pageSize),
        currentPageNo: pageNo,
        content,
      },
    });
  }),
];
