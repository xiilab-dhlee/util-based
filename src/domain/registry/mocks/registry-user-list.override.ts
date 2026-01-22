import { faker } from "@faker-js/faker";

import {
  getGetPrivateImageTagsByAccountIdMockHandler,
  getGetPrivateImageTagsByAccountIdResponseMock,
  getGetPrivateImageUsageByAccountMockHandler,
  getGetPrivateImageUsageByAccountResponseMock,
} from "@/api/generated/admin-private-registry/admin-private-registry.msw";
import {
  getGetPublicImageTagsByAccountIdMockHandler,
  getGetPublicImageTagsByAccountIdResponseMock,
  getGetPublicImageUsageByAccountMockHandler,
  getGetPublicImageUsageByAccountResponseMock,
} from "@/api/generated/admin-public-registry/admin-public-registry.msw";
import type {
  AccountImageTagResponse,
  AccountImageTagResponseImageType,
  BaseResponsePageResponseAccountImageTagResponse,
  BaseResponsePageResponsePrivateImageUsageResponse,
  BaseResponsePageResponsePublicImageUsageResponse,
  PrivateImageUsageResponse,
  PublicImageUsageResponse,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  DAY_IN_MS,
  MOCK_BASE_TIMESTAMP,
} from "@/shared/constants/date.constant";

/** 이미지 타입 배열 */
const IMAGE_TYPES: AccountImageTagResponseImageType[] = [
  "PRIVATE",
  "HUB",
  "PUBLIC",
  "BUILT_IN",
];

/**
 * 사용자 목록용 계정명 생성
 */
function generateAccountName(index: number, keyword: string): string {
  const baseName = keyword || "user";
  return `${baseName}-${String(index).padStart(3, "0")}`;
}

/**
 * 이메일 생성
 */
function generateEmail(index: number): string {
  return `user-${String(index).padStart(3, "0")}@example.com`;
}

/**
 * 업로드 일시 생성
 */
function generateUploadedAt(
  index: number,
  baseTimestamp: number = MOCK_BASE_TIMESTAMP,
): string {
  const offset = index * DAY_IN_MS;
  return new Date(baseTimestamp - offset).toISOString();
}

/**
 * 정렬된 사용자 목록 데이터 생성 (Private/Public 공통)
 */
function sortUserContent<
  T extends PrivateImageUsageResponse | PublicImageUsageResponse,
>(content: T[], sort: string | null, order: string | null): T[] {
  if (!sort) return content;

  const sortedContent = [...content];
  const isAsc = order === "ASC";

  sortedContent.sort((a, b) => {
    let comparison = 0;

    switch (sort) {
      case "ACCOUNT_NAME":
        comparison = (a.accountName || "").localeCompare(b.accountName || "");
        break;
      case "IMAGE_COUNT":
        comparison = (a.imageCount || 0) - (b.imageCount || 0);
        break;
      case "USED_STORAGE":
        comparison = (a.usedStorage || 0) - (b.usedStorage || 0);
        break;
      default:
        return 0;
    }

    return isAsc ? comparison : -comparison;
  });

  return sortedContent;
}

/**
 * 사용자별 이미지 등록 현황 목록 핸들러
 */
const privateImageUsageHandler = getGetPrivateImageUsageByAccountMockHandler(
  async (info) => {
    const url = new URL(info.request.url);
    const keyword = url.searchParams.get("keyword") || "";
    const pageNo = Number.parseInt(url.searchParams.get("pageNo") || "0", 10);
    const pageSize = Number.parseInt(
      url.searchParams.get("pageSize") || "20",
      10,
    );
    const sort = url.searchParams.get("sort");
    const order = url.searchParams.get("order");

    const totalSize = pageSize * 3;

    const mockResponse = getGetPrivateImageUsageByAccountResponseMock();
    const baseItem = mockResponse.data?.content?.[0];

    const content: PrivateImageUsageResponse[] = Array.from(
      { length: pageSize },
      (_, index) => {
        const globalIndex = pageNo * pageSize + index + 1;

        return {
          ...baseItem,
          accountId: `account-${globalIndex}`,
          accountName: generateAccountName(globalIndex, keyword),
          email: generateEmail(globalIndex),
          imageCount: faker.number.int({ min: 1, max: 50 }),
          usedStorage: faker.number.int({
            min: 1024 * 1024,
            max: 10 * 1024 * 1024 * 1024,
          }), // 1MB ~ 10GB
        } as PrivateImageUsageResponse;
      },
    );

    const sortedContent = sortUserContent(content, sort, order);

    return {
      status: "SUCCESS",
      data: {
        totalSize,
        totalPageNum: Math.ceil(totalSize / pageSize),
        currentPageNo: pageNo,
        content: sortedContent,
      },
      timestamp: Date.now(),
    } as BaseResponsePageResponsePrivateImageUsageResponse;
  },
);

/**
 * 사용자별 이미지 태그 목록 핸들러
 */
const privateImageTagsByAccountIdHandler =
  getGetPrivateImageTagsByAccountIdMockHandler(async (info) => {
    const url = new URL(info.request.url);
    const pageNo = Number.parseInt(
      url.searchParams.get("page.pageNo") || "0",
      10,
    );
    const pageSize = Number.parseInt(
      url.searchParams.get("page.pageSize") || "5",
      10,
    );

    // accountId가 없으면 빈 응답
    const accountId = url.pathname.split("/").pop();
    if (!accountId) {
      return {
        status: "SUCCESS",
        data: {
          totalSize: 0,
          totalPageNum: 0,
          currentPageNo: 0,
          content: [],
        },
        timestamp: Date.now(),
      } as BaseResponsePageResponseAccountImageTagResponse;
    }

    const totalSize = pageSize * 4;

    const mockResponse = getGetPrivateImageTagsByAccountIdResponseMock();
    const baseItem = mockResponse.data?.content?.[0];

    const content: AccountImageTagResponse[] = Array.from(
      { length: pageSize },
      (_, index) => {
        const globalIndex = pageNo * pageSize + index + 1;

        return {
          ...baseItem,
          harborTagId: globalIndex,
          harborImageName: `harbor/image-${globalIndex}`,
          imageDisplayName: `image-${String(globalIndex).padStart(3, "0")}`,
          tagName: `v${faker.number.int({ min: 1, max: 10 })}.${faker.number.int({ min: 0, max: 9 })}.${faker.number.int({ min: 0, max: 9 })}`,
          workspaceName: `workspace-${faker.number.int({ min: 1, max: 5 })}`,
          uploadedAt: generateUploadedAt(globalIndex),
          sizeByte: faker.number.int({
            min: 1024 * 1024,
            max: 5 * 1024 * 1024 * 1024,
          }), // 1MB ~ 5GB
          description: faker.lorem.sentence(),
          imageType: IMAGE_TYPES[globalIndex % IMAGE_TYPES.length],
        } as AccountImageTagResponse;
      },
    );

    return {
      status: "SUCCESS",
      data: {
        totalSize,
        totalPageNum: Math.ceil(totalSize / pageSize),
        currentPageNo: pageNo,
        content,
      },
      timestamp: Date.now(),
    } as BaseResponsePageResponseAccountImageTagResponse;
  });

/**
 * 공개 레지스트리 사용자별 이미지 등록 현황 목록 핸들러
 */
const publicImageUsageHandler = getGetPublicImageUsageByAccountMockHandler(
  async (info) => {
    const url = new URL(info.request.url);
    const keyword = url.searchParams.get("keyword") || "";
    const pageNo = Number.parseInt(url.searchParams.get("pageNo") || "0", 10);
    const pageSize = Number.parseInt(
      url.searchParams.get("pageSize") || "20",
      10,
    );
    const sort = url.searchParams.get("sort");
    const order = url.searchParams.get("order");

    const totalSize = pageSize * 3;

    const mockResponse = getGetPublicImageUsageByAccountResponseMock();
    const baseItem = mockResponse.data?.content?.[0];

    const content: PublicImageUsageResponse[] = Array.from(
      { length: pageSize },
      (_, index) => {
        const globalIndex = pageNo * pageSize + index + 1;

        return {
          ...baseItem,
          accountId: `account-${globalIndex}`,
          accountName: generateAccountName(globalIndex, keyword),
          email: generateEmail(globalIndex),
          imageCount: faker.number.int({ min: 1, max: 50 }),
          usedStorage: faker.number.int({
            min: 1024 * 1024,
            max: 10 * 1024 * 1024 * 1024,
          }), // 1MB ~ 10GB
        } as PublicImageUsageResponse;
      },
    );

    const sortedContent = sortUserContent(content, sort, order);

    return {
      status: "SUCCESS",
      data: {
        totalSize,
        totalPageNum: Math.ceil(totalSize / pageSize),
        currentPageNo: pageNo,
        content: sortedContent,
      },
      timestamp: Date.now(),
    } as BaseResponsePageResponsePublicImageUsageResponse;
  },
);

/**
 * 공개 레지스트리 사용자별 이미지 태그 목록 핸들러
 */
const publicImageTagsByAccountIdHandler =
  getGetPublicImageTagsByAccountIdMockHandler(async (info) => {
    const url = new URL(info.request.url);
    const pageNo = Number.parseInt(
      url.searchParams.get("page.pageNo") || "0",
      10,
    );
    const pageSize = Number.parseInt(
      url.searchParams.get("page.pageSize") || "5",
      10,
    );

    // accountId가 없으면 빈 응답
    const accountId = url.pathname.split("/").pop();
    if (!accountId) {
      return {
        status: "SUCCESS",
        data: {
          totalSize: 0,
          totalPageNum: 0,
          currentPageNo: 0,
          content: [],
        },
        timestamp: Date.now(),
      } as BaseResponsePageResponseAccountImageTagResponse;
    }

    const totalSize = pageSize * 4;

    const mockResponse = getGetPublicImageTagsByAccountIdResponseMock();
    const baseItem = mockResponse.data?.content?.[0];

    const content: AccountImageTagResponse[] = Array.from(
      { length: pageSize },
      (_, index) => {
        const globalIndex = pageNo * pageSize + index + 1;

        return {
          ...baseItem,
          harborTagId: globalIndex,
          harborImageName: `harbor/image-${globalIndex}`,
          imageDisplayName: `image-${String(globalIndex).padStart(3, "0")}`,
          tagName: `v${faker.number.int({ min: 1, max: 10 })}.${faker.number.int({ min: 0, max: 9 })}.${faker.number.int({ min: 0, max: 9 })}`,
          workspaceName: `workspace-${faker.number.int({ min: 1, max: 5 })}`,
          uploadedAt: generateUploadedAt(globalIndex),
          sizeByte: faker.number.int({
            min: 1024 * 1024,
            max: 5 * 1024 * 1024 * 1024,
          }), // 1MB ~ 5GB
          description: faker.lorem.sentence(),
          imageType: IMAGE_TYPES[globalIndex % IMAGE_TYPES.length],
        } as AccountImageTagResponse;
      },
    );

    return {
      status: "SUCCESS",
      data: {
        totalSize,
        totalPageNum: Math.ceil(totalSize / pageSize),
        currentPageNo: pageNo,
        content,
      },
      timestamp: Date.now(),
    } as BaseResponsePageResponseAccountImageTagResponse;
  });

export const registryUserListOverrideHandlers = [
  privateImageUsageHandler,
  privateImageTagsByAccountIdHandler,
  publicImageUsageHandler,
  publicImageTagsByAccountIdHandler,
];
