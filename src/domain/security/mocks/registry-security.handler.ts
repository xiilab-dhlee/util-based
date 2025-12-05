import { HttpResponse, http } from "msw";

import {
  registrySecurityTagDetailMock,
  registrySecurityTagVulnerabilityListMock,
  registrySecurityVulnerabilityInfoMock,
} from "@/domain/security/mocks/registry-security.mock";

/**
 * 레지스트리 보안 API 핸들러
 */
export const registrySecurityHandlers = [
  // 레지스트리 보안 이미지 태그 상세 조회
  http.get("/core-api/v1/core/internal-registry-image/:id/tag/:tagId", () => {
    return HttpResponse.json(registrySecurityTagDetailMock);
  }),
  // 레지스트리 보안 이미지 태그 취약점 목록 조회
  http.get(
    "/core-api/v1/core/internal-registry-image/:id/tag/:tagId/vulnerability",
    () => {
      return HttpResponse.json({
        content: registrySecurityTagVulnerabilityListMock,
        totalSize: 100,
      });
    },
  ),
  // 레지스트리 보안 취약점 상세 정보 조회 (모달용)
  http.get(
    "/core-api/v1/core/internal-registry-image/:id/tag/:tagId/vulnerability/:vulnerabilityId",
    () => {
      return HttpResponse.json(registrySecurityVulnerabilityInfoMock);
    },
  ),
];
