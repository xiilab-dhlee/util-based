import { HttpResponse, http } from "msw";

import {
  fileSecurityScanDetailMock,
  fileSecurityScanFileListMock,
  fileSecurityScanListMock,
  fileSecurityVulnerabilityDetailListMock,
  fileSecurityVulnerabilityInfoMock,
} from "@/domain/security/mocks/file-security.mock";

/**
 * 파일 시스템 보안 API 핸들러
 */
export const fileSecurityHandlers = [
  // 파일 시스템 보안 검사 목록 조회
  http.get("/core-api/v1/core/file-security/scan", () => {
    return HttpResponse.json({
      content: fileSecurityScanListMock,
      totalSize: 100,
    });
  }),
  // 파일 시스템 보안 검사 상세 조회
  http.get("/core-api/v1/core/file-security/scan/:scanId", () => {
    return HttpResponse.json(fileSecurityScanDetailMock);
  }),

  // 파일 시스템 보안 검사 파일 목록 조회
  http.get("/core-api/v1/core/file-security/scan/:scanId/files", () => {
    return HttpResponse.json({
      content: fileSecurityScanFileListMock,
      totalSize: 124,
    });
  }),
  // 파일 시스템 보안 파일별 취약점 목록 조회
  http.get(
    "/core-api/v1/core/file-security/scan/:scanId/files/:fileId/vulnerabilities",
    () => {
      return HttpResponse.json({
        content: fileSecurityVulnerabilityDetailListMock,
        totalSize: 124,
      });
    },
  ),
  // 파일 시스템 보안 검사 삭제
  http.delete("/core-api/v1/core/file-security/scan/:scanId", () => {
    return HttpResponse.json({ success: true });
  }),
  // 파일 시스템 보안 취약점 상세 정보 조회 (모달용)
  http.get(
    "/core-api/v1/core/file-security/scan/:scanId/files/:fileId/vulnerabilities/:vulnerabilityId",
    () => {
      return HttpResponse.json(fileSecurityVulnerabilityInfoMock);
    },
  ),
];
