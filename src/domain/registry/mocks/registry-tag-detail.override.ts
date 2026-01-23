import { faker } from "@faker-js/faker";

import {
  getGetPrivateImageTagDetailMockHandler,
  getGetPrivateImageTagDetailResponseMock,
} from "@/api/generated/private-registry/private-registry.msw";
import {
  getGetPublicImageTagDetailMockHandler,
  getGetPublicImageTagDetailResponseMock,
} from "@/api/generated/public-registry/public-registry.msw";
import { MOCK_BASE_TIMESTAMP } from "@/shared/constants/date.constant";

/**
 * 취약점 카운트 생성
 */
function generateVulnerability() {
  const criticalCount = faker.number.int({ min: 0, max: 999999 });
  const highCount = faker.number.int({ min: 0, max: 999999 });
  const mediumCount = faker.number.int({ min: 0, max: 999999 });
  const lowCount = faker.number.int({ min: 0, max: 999999 });

  return {
    criticalCount,
    highCount,
    mediumCount,
    lowCount,
    totalCount: criticalCount + highCount + mediumCount + lowCount,
  };
}

/**
 * 태그 상세 mock 핸들러 생성 팩토리
 */
function createTagDetailHandler<T>(
  getMockHandler: (
    handler: (info: { request: Request }) => Promise<T>,
  ) => ReturnType<typeof getGetPrivateImageTagDetailMockHandler>,
  getResponseMock: (override?: {
    data?: {
      imageTagId: number;
      imageTagName: string;
      imageSizeByte: number;
      scanStatus: string;
      creatorName: string;
      createdAt: string;
      description: string;
      vulnerability: ReturnType<typeof generateVulnerability>;
    };
  }) => T,
) {
  return getMockHandler(async (info) => {
    const url = new URL(info.request.url);
    const tagName = url.searchParams.get("tagName") || "";

    return getResponseMock({
      data: {
        imageTagId: faker.number.int({ min: 1000000, max: 5000000000 }),
        imageTagName: tagName,
        imageSizeByte: faker.number.int({ min: 1000000, max: 5000000000 }),
        scanStatus: faker.helpers.arrayElement([
          "COMPLETED",
          "FAILED",
          "IN_PROGRESS",
          "NOT_SCANNED",
        ]),
        creatorName: "관리자",
        createdAt: new Date(MOCK_BASE_TIMESTAMP).toISOString(),
        description: faker.lorem.sentence(),
        vulnerability: generateVulnerability(),
      },
    });
  });
}

export const registryTagDetailOverrideHandlers = [
  // Private registry tag detail handler
  createTagDetailHandler(
    getGetPrivateImageTagDetailMockHandler,
    getGetPrivateImageTagDetailResponseMock,
  ),
  // Public registry tag detail handler
  createTagDetailHandler(
    getGetPublicImageTagDetailMockHandler,
    getGetPublicImageTagDetailResponseMock,
  ),
];
