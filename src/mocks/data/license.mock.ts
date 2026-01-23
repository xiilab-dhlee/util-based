import type {
  LicenseLatestResponse,
  LicenseListResponse,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";

/**
 * 라이선스 목록 Mock 데이터
 */
export const licenseListMock: LicenseListResponse[] = [
  {
    licenseId: 1,
    version: "2.0.0",
    gpuCount: 10,
    expiredAt: "2025-12-31T23:59:59Z",
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    licenseId: 2,
    version: "1.5.0",
    gpuCount: 5,
    expiredAt: "2024-06-30T23:59:59Z",
    createdAt: "2023-07-01T09:00:00Z",
  },
];

/**
 * 최신 라이선스 Mock 데이터
 */
export const latestLicenseMock: LicenseLatestResponse = {
  licenseId: 1,
  version: "2.0.0",
  gpuCount: 10,
  expiredAt: "2025-12-31T23:59:59Z",
};

/**
 * Empty 상태의 라이선스 Mock 데이터
 */
export const emptyLicenseListMock: LicenseListResponse[] = [];
