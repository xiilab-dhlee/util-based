import { faker } from "@faker-js/faker";

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

export const publicRegistryTagDetailOverrideHandlers = [
  getGetPublicImageTagDetailMockHandler(async (info) => {
    const { imageTagId } = info.params as {
      imageTagId: string;
    };

    return getGetPublicImageTagDetailResponseMock({
      data: {
        imageTagId: Number(imageTagId),
        imageTagName: `tag-${imageTagId}`,
        imageSizeByte: faker.number.int({ min: 1000000, max: 5000000000 }),
        scanStatus: faker.helpers.arrayElement([
          "COMPLETED",
          "FAILED",
          "IN_PROGRESS",
        ]),
        creatorName: "관리자",
        createdAt: new Date(MOCK_BASE_TIMESTAMP).toISOString(),
        description: faker.lorem.sentence(),
        vulnerability: generateVulnerability(),
      },
    });
  }),
];
