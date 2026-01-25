import { faker } from "@faker-js/faker";

import { ImageTagDetailResponseScanStatus } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
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
 * 태그 상세 mock 데이터 생성
 */
function generateTagDetailData(tagName: string) {
  return {
    imageTagId: faker.number.int({ min: 1000000, max: 5000000000 }),
    imageTagName: tagName,
    imageSizeByte: faker.number.int({ min: 1000000, max: 5000000000 }),
    scanStatus: faker.helpers.arrayElement([
      ImageTagDetailResponseScanStatus.SUCCESS,
      ImageTagDetailResponseScanStatus.ERROR,
      ImageTagDetailResponseScanStatus.RUNNING,
      ImageTagDetailResponseScanStatus.NOT_SCANNED,
    ]),
    creatorName: "관리자",
    createdAt: new Date(MOCK_BASE_TIMESTAMP).toISOString(),
    description: faker.lorem.sentence(),
    vulnerability: generateVulnerability(),
  };
}

export const registryTagDetailOverrideHandlers = [
  // Private registry tag detail handler
  getGetPrivateImageTagDetailMockHandler(async (info) => {
    const url = new URL(info.request.url);
    const tagName = url.searchParams.get("tagName") || "";

    const baseMock = getGetPrivateImageTagDetailResponseMock();
    return {
      ...baseMock,
      data: {
        ...baseMock.data,
        ...generateTagDetailData(tagName),
      },
    };
  }),
  // Public registry tag detail handler
  getGetPublicImageTagDetailMockHandler(async (info) => {
    const url = new URL(info.request.url);
    const tagName = url.searchParams.get("tagName") || "";

    const baseMock = getGetPublicImageTagDetailResponseMock();
    return {
      ...baseMock,
      data: {
        ...baseMock.data,
        ...generateTagDetailData(tagName),
      },
    };
  }),
];
