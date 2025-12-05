import type { FileSecurityScanListQuery } from "@/domain/security/schemas/file-security-scan.schema";
import type {
  GetFileSecurityCriticalVulnerabilitiesPayload,
  GetFileSecurityScanDetailPayload,
  GetFileSecurityScanFileListPayload,
  GetFileSecurityVulnerabilityDetailListPayload,
  GetFileSecurityVulnerabilityInfoPayload,
} from "@/domain/security/types/file-security.type";

export const fileSecurityKeys = {
  default: ["file-security"],
  // 파일 시스템 보안 검사 목록
  scanList: (payload?: FileSecurityScanListQuery) => [
    ...fileSecurityKeys.default,
    "scanList",
    ...(payload ? Object.values(payload) : []),
  ],
  // 파일 시스템 보안 검사 상세
  scanDetail: (payload: GetFileSecurityScanDetailPayload) => [
    ...fileSecurityKeys.default,
    "scanDetail",
    ...Object.values(payload),
  ],
  // 파일 시스템 보안 검사 파일 목록
  scanFileList: (payload: GetFileSecurityScanFileListPayload) => [
    ...fileSecurityKeys.default,
    "scanFileList",
    ...Object.values(payload),
  ],
  // 파일 시스템 보안 Critical 취약점 목록
  criticalVulnerabilityList: (
    payload: GetFileSecurityCriticalVulnerabilitiesPayload,
  ) => [
    ...fileSecurityKeys.default,
    "criticalVulnerabilityList",
    ...Object.values(payload),
  ],
  // 파일 시스템 보안 파일별 취약점 목록
  fileVulnerabilityList: (
    payload: GetFileSecurityVulnerabilityDetailListPayload,
  ) => [
    ...fileSecurityKeys.default,
    "fileVulnerabilityList",
    ...Object.values(payload),
  ],
  // 파일 시스템 보안 취약점 상세 정보
  vulnerabilityInfo: (
    payload?: Partial<GetFileSecurityVulnerabilityInfoPayload> | null,
  ) => [
    ...fileSecurityKeys.default,
    "vulnerabilityInfo",
    payload?.scanId,
    payload?.fileId,
    payload?.vulnerabilityId,
  ],
  // 파일 보안 레벨 설정 업데이트 (mutation key)
  updateSecurityLevel: () => [...fileSecurityKeys.default, "securityLevel"],
  // 파일 보안 스케줄 설정 업데이트 (mutation key)
  updateSecuritySchedule: () => [
    ...fileSecurityKeys.default,
    "securitySchedule",
  ],
};
