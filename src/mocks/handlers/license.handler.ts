import { HttpResponse, http } from "msw";

import {
  licenseDetailSchema,
  renewLicenseRequestSchema,
} from "@/domain/system-setting/schemas/license.schema";
import { licenseMock } from "@/mocks/data/license.mock";

/**
 * 라이선스 API Mock 핸들러
 */
export const licenseHandlers = [
  // GET /api/v1/license - 라이선스 정보 및 이력 조회
  http.get("/api/v1/license", () => {
    return HttpResponse.json(licenseMock);
  }),

  // POST /api/v1/license - 라이선스 갱신 (신규 등록)
  http.post("/api/v1/license", async ({ request }) => {
    // 요청 검증
    const validatedBody = renewLicenseRequestSchema.parse(await request.json());

    // Mock 응답 생성 (백엔드에서 키를 파싱한다고 가정)
    const newLicense = licenseDetailSchema.parse({
      id: licenseMock.totalCount + 1,
      licenseKey: validatedBody.licenseKey,
      version: "1.0", // 키에서 파싱된 버전
      gpuCount: 5, // 키에서 파싱된 GPU 개수
      expirationDate: "2026-12-31T00:00:00Z", // 키에서 파싱된 만료일
      registrationDate: new Date().toISOString(),
    });

    return HttpResponse.json(newLicense);
  }),
];
