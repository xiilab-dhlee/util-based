import { internalregistryImageTagDetailSchema } from "@/domain/internal-registry-image/schemas/internal-registry-image-tag.schema";
import { fileSecurityVulnerabilityInfoResponseSchema } from "@/domain/security/schemas/file-security-scan.schema";
import { vulnerabilityListResponseSchema } from "@/domain/security/schemas/vulnerability.schema";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { makeMock } from "@/shared/utils/mock.util";

/**
 * 레지스트리 보안 이미지 태그 상세 Mock 데이터
 */
export const registrySecurityTagDetailMock = makeMock(
  internalregistryImageTagDetailSchema,
);

/**
 * 레지스트리 보안 이미지 태그 취약점 목록 Mock 데이터
 */
export const registrySecurityTagVulnerabilityListMock = Array.from(
  { length: LIST_PAGE_SIZE },
  () => makeMock(vulnerabilityListResponseSchema),
);

/**
 * 레지스트리 보안 취약점 상세 정보 Mock 데이터 (모달용)
 */
export const registrySecurityVulnerabilityInfoMock = makeMock(
  fileSecurityVulnerabilityInfoResponseSchema,
);
