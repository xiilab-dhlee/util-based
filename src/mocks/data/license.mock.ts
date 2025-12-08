import type { LicenseListResponseType } from "@/domain/system-setting/schemas/license.schema";

/**
 * 라이선스 Mock 데이터
 * 현재 활성 라이선스 + 등록 이력
 */
export const licenseMock: LicenseListResponseType = {
  current: {
    id: 3,
    licenseKey: "XXXX-YYYY-ZZZZ-1234",
    version: "1.0",
    gpuCount: 2,
    expirationDate: "2099-12-31T00:00:00Z",
    registrationDate: "2025-12-08T10:30:00Z",
  },
  history: [
    {
      id: 3,
      licenseKey: "XXXX-YYYY-ZZZZ-1234",
      version: "1.0",
      gpuCount: 2,
      expirationDate: "2099-12-31T00:00:00Z",
      registrationDate: "2025-12-08T10:30:00Z",
    },
    {
      id: 2,
      licenseKey: "AAAA-BBBB-CCCC-5678",
      version: "1.0",
      gpuCount: 4,
      expirationDate: "2025-06-30T00:00:00Z",
      registrationDate: "2025-01-15T09:00:00Z",
    },
    {
      id: 1,
      licenseKey: "PPPP-QQQQ-RRRR-9012",
      version: "1.0",
      gpuCount: 1,
      expirationDate: "2025-01-31T00:00:00Z",
      registrationDate: "2024-12-01T14:20:00Z",
    },
  ],
  totalCount: 3,
};

/**
 * Empty 상태의 라이선스 Mock 데이터
 */
export const emptyLicenseMock: LicenseListResponseType = {
  current: null,
  history: [],
  totalCount: 0,
};
