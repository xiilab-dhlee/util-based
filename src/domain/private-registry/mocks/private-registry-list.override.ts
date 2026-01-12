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
 */
function generateImageDisplayName(
  index: number,
  keyword: string,
  sort: string,
  order: string,
): string {
  const prefix = keyword || "private-image";

  if (sort === "CREATED_AT") {
    return `${prefix}-${index + 1}`;
  }

  const paddedIndex = String((index % 1000) + 1).padStart(3, "0");
  const sortableValue = 999 - (index % 1000);
  const sortableNum =
    order === "ASC" ? paddedIndex : String(sortableValue).padStart(3, "0");
  return `${prefix}-${sortableNum}`;
}

/**
 * 정렬 가능한 createdAt 생성
 */
function generateCreatedAt(
  index: number,
  sort: string,
  order: string,
  baseTimestamp: number = MOCK_BASE_TIMESTAMP,
): string {
  if (sort === "CREATED_AT") {
    const safeIndex = Math.min(Math.max(index, 0), 29);
    const offset =
      order === "ASC" ? (30 - safeIndex) * DAY_IN_MS : safeIndex * DAY_IN_MS;
    return new Date(baseTimestamp - offset).toISOString();
  }

  return new Date(baseTimestamp - index * DAY_IN_MS).toISOString();
}

export const privateRegistryListOverrideHandlers = [
  getGetPrivateRegistryListMockHandler(async (info) => {
    const url = new URL(info.request.url);
    const keyword = url.searchParams.get("keyword") || "";
    const pageNo = parseInt(url.searchParams.get("pageNo") || "0", 10);
    const pageSize = parseInt(url.searchParams.get("pageSize") || "10", 10);
    const sort =
      url.searchParams.get("sort") || GetPrivateRegistryListSort.CREATED_AT;
    const order =
      url.searchParams.get("order") || GetPrivateRegistryListOrder.DESC;

    const { status, message, timestamp } =
      getGetPrivateRegistryListResponseMock();

    const content: RegistryListResponse[] = Array.from(
      { length: pageSize },
      (_, index) => {
        const globalIndex = pageNo * pageSize + index;

        return {
          imageId: globalIndex + 1,
          imageDisplayName: generateImageDisplayName(
            globalIndex,
            keyword,
            sort,
            order,
          ),
          harborImageName: `harbor.example.com/private/image-${globalIndex + 1}`,
          latestImageTagName: `v1.${globalIndex}.0`,
          imageTagCount: (globalIndex % 10) + 1,
          downloadCount: globalIndex * 10,
          creatorName: `사용자-${(globalIndex % 5) + 1}`,
          creatorId: `user-${(globalIndex % 5) + 1}`,
          createdAt: generateCreatedAt(globalIndex, sort, order),
          imageType: "PRIVATE",
          hasMetadata: true,
        };
      },
    );

    const totalSize = pageSize * 3;

    return {
      status,
      message,
      timestamp,
      data: {
        totalSize,
        totalPageNum: Math.ceil(totalSize / pageSize),
        currentPageNo: pageNo,
        content,
      },
    };
  }),
];
