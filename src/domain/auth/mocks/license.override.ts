import {
  getGetLatestLicenseMockHandler,
  getGetLatestLicenseResponseMock,
  getLicenseMock,
} from "@/api/generated/license/license.msw";

/**
 * 유효한 라이선스 Mock 데이터 생성
 * expiredAt을 미래 날짜로 설정
 */
function createValidLicenseData() {
  const futureDate = new Date();
  futureDate.setFullYear(futureDate.getFullYear() + 1); // 1년 후 만료

  return {
    licenseId: 1,
    version: "2.0.0",
    gpuCount: 10,
    expiredAt: futureDate.toISOString(),
  };
}

export const licenseOverrideHandlers = [
  getGetLatestLicenseMockHandler(() => {
    const { status, message, timestamp } = getGetLatestLicenseResponseMock();

    return {
      status,
      message,
      timestamp,
      data: createValidLicenseData(),
    };
  }),
  getLicenseMock(),
];
