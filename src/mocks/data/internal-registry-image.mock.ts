import {
  internalregistryImageDetailSchema,
  internalregistryImageListSchema,
} from "@/domain/internal-registry-image/schemas/internal-registry-image.schema";
import {
  internalregistryImageTagDetailSchema,
  internalregistryImageTagListSchema,
} from "@/domain/internal-registry-image/schemas/internal-registry-image-tag.schema";
import { vulnerabilityListSchema } from "@/domain/security/schemas/vulnerability.schema";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { makeMock } from "@/shared/utils/mock.util";

/**
 * 내부 레지스트리 이미지 목록 Mock 데이터
 */
export const internalregistryImageListMock = Array.from(
  { length: LIST_PAGE_SIZE },
  () => makeMock(internalregistryImageListSchema),
);

/**
 * 내부 레지스트리 이미지 상세 Mock 데이터
 */
export const internalregistryImageDetailMock = makeMock(
  internalregistryImageDetailSchema,
);

/**
 * 내부 레지스트리 이미지 태그 목록 Mock 데이터
 */
export const internalregistryImageTagListMock = Array.from(
  { length: LIST_PAGE_SIZE },
  () => makeMock(internalregistryImageTagListSchema),
);

/**
 * 내부 레지스트리 이미지 태그 상세 Mock 데이터
 */
export const internalregistryImageTagDetailMock = makeMock(
  internalregistryImageTagDetailSchema,
);

/**
 * 내부 레지스트리 이미지 태그 취약점 목록 Mock 데이터
 */
export const internalregistryImageTagVulnerabilityListMock = Array.from(
  { length: LIST_PAGE_SIZE },
  () => makeMock(vulnerabilityListSchema),
);
