import { getPrivateImageTagDetailResponse } from "@/api/generated/private-registry/private-registry.zod";
import { fileSecurityVulnerabilityInfoResponseSchema } from "@/domain/security/schemas/file-security-scan.schema";
import { vulnerabilityListResponseSchema } from "@/domain/security/schemas/vulnerability.schema";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { makeMock } from "@/shared/utils/mock.util";

/**
 * 레지스트리 보안 이미지 태그 상세 Mock 데이터
 * orval 생성 스키마에서 data 필드 추출하여 사용
 */
export const registrySecurityTagDetailMock = makeMock(
  getPrivateImageTagDetailResponse.shape.data.unwrap(),
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
