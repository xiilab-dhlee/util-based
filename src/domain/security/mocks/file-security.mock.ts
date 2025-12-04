import {
  fileSecurityScanDetailResponseSchema,
  fileSecurityScanFileResponseSchema,
  fileSecurityScanListResponseSchema,
  fileSecurityVulnerabilityDetailResponseSchema,
  fileSecurityVulnerabilityInfoResponseSchema,
} from "@/domain/security/schemas/file-security-scan.schema";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { makeMock } from "@/shared/utils/mock.util";

/**
 * 파일 시스템 보안 검사 목록 Mock 데이터
 */
export const fileSecurityScanListMock = Array.from(
  { length: LIST_PAGE_SIZE },
  () => makeMock(fileSecurityScanListResponseSchema),
);

/**
 * 파일 시스템 보안 검사 상세 Mock 데이터
 */
export const fileSecurityScanDetailMock = makeMock(
  fileSecurityScanDetailResponseSchema,
);

/**
 * 파일 시스템 보안 검사 파일 목록 Mock 데이터
 */
export const fileSecurityScanFileListMock = Array.from(
  { length: LIST_PAGE_SIZE },
  () => makeMock(fileSecurityScanFileResponseSchema),
);

/**
 * 파일 시스템 보안 취약점 상세 목록 Mock 데이터
 */
export const fileSecurityVulnerabilityDetailListMock = Array.from(
  { length: LIST_PAGE_SIZE },
  () => makeMock(fileSecurityVulnerabilityDetailResponseSchema),
);

/**
 * 파일 시스템 보안 취약점 상세 정보 Mock 데이터 (모달용)
 */
export const fileSecurityVulnerabilityInfoMock = makeMock(
  fileSecurityVulnerabilityInfoResponseSchema,
);
