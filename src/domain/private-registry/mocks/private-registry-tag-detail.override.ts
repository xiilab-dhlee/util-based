import { faker } from "@faker-js/faker";

import {
  getGetPrivateImageTagDetailMockHandler,
  getGetPrivateImageTagDetailResponseMock,
} from "@/api/generated/private-registry/private-registry.msw";
import { MOCK_BASE_TIMESTAMP } from "@/shared/constants/date.constant";

/**
 * 취약점 카운트 생성
 */
function generateVulnerability() {
  return {
    criticalCount: faker.number.int({ min: 0, max: 999999 }),
    highCount: faker.number.int({ min: 0, max: 999999 }),
    mediumCount: faker.number.int({ min: 0, max: 999999 }),
    lowCount: faker.number.int({ min: 0, max: 999999 }),
  };
}

export const privateRegistryTagDetailOverrideHandlers = [
  getGetPrivateImageTagDetailMockHandler(async (info) => {
    const { imageTagId } = info.params as {
      imageId: string;
      imageTagId: string;
    };

    return getGetPrivateImageTagDetailResponseMock({
      data: {
        imageTagId: Number(imageTagId),
        imageTagName: `tag-${imageTagId}`,
        imageSizeByte: faker.number.int({ min: 1000000, max: 5000000000 }),
        scanStatus: faker.helpers.arrayElement([
          "COMPLETED",
          "FAILED",
          "IN_PROGRESS",
        ]),
        creatorId: "admin",
        creatorName: "관리자",
        createdAt: new Date(MOCK_BASE_TIMESTAMP).toISOString(),
        description: faker.lorem.sentence(),
        vulnerability: generateVulnerability(),
      },
    });
  }),
];
