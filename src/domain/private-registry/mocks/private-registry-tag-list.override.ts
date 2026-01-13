import {
  GetPrivateImageTagListOrder,
  GetPrivateImageTagListSort,
  type ImageTagListResponse,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  getGetPrivateImageTagListMockHandler,
  getGetPrivateImageTagListResponseMock,
} from "@/api/generated/private-registry/private-registry.msw";
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
 * 정렬 순서에 따른 createDateTime 생성
 */
function generateCreatedAt(
  index: number,
  sort: string,
  order: string,
  baseTimestamp: number = MOCK_BASE_TIMESTAMP,
): string {
  if (sort === GetPrivateImageTagListSort.CREATED_AT) {
    const safeIndex = Math.min(Math.max(index, 0), 29);
    const offset =
      order === GetPrivateImageTagListOrder.ASC
        ? (30 - safeIndex) * DAY_IN_MS
        : safeIndex * DAY_IN_MS;
    return new Date(baseTimestamp - offset).toISOString();
  }
  return new Date(baseTimestamp - index * DAY_IN_MS).toISOString();
}

export const privateRegistryTagListOverrideHandlers = [
  getGetPrivateImageTagListMockHandler(async (info) => {
    const url = new URL(info.request.url);
    const keyword = url.searchParams.get("keyword") || "";
    const pageNo = Number.parseInt(url.searchParams.get("pageNo") || "0", 10);
    const pageSize = Number.parseInt(
      url.searchParams.get("pageSize") || "10",
      10,
    );
    const sort =
      url.searchParams.get("sort") || GetPrivateImageTagListSort.CREATED_AT;
    const order =
      url.searchParams.get("order") || GetPrivateImageTagListOrder.DESC;

    const totalSize = pageSize * 3;

    // 검색/정렬 관련 필드만 오버라이드, 나머지는 faker 원본 사용
    const content: ImageTagListResponse[] = Array.from(
      { length: pageSize },
      (_, index) => {
        const globalIndex = pageNo * pageSize + index;
        const baseItem =
          getGetPrivateImageTagListResponseMock().data?.content?.[0];

        return {
          ...baseItem,
          imageTagName: generateImageTagName(globalIndex, keyword),
          createDateTime: generateCreatedAt(globalIndex, sort, order),
        } as ImageTagListResponse;
      },
    );

    return getGetPrivateImageTagListResponseMock({
      data: {
        totalSize,
        totalPageNum: Math.ceil(totalSize / pageSize),
        currentPageNo: pageNo,
        content,
      },
    });
  }),
];
