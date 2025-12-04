import type {
  GetRegistrySecurityTagDetailPayload,
  GetRegistrySecurityVulnerabilityInfoPayload,
  GetRegistrySecurityVulnerabilityListPayload,
} from "@/domain/security/types/registry-security.type";

export const registrySecurityKeys = {
  default: ["registry-security"],
  // 레지스트리 보안 이미지 태그 상세
  tagDetail: (payload: GetRegistrySecurityTagDetailPayload) => [
    ...registrySecurityKeys.default,
    "tagDetail",
    ...Object.values(payload),
  ],
  // 레지스트리 보안 이미지 태그 취약점 목록
  tagVulnerabilityList: (
    payload: GetRegistrySecurityVulnerabilityListPayload,
  ) => [
    ...registrySecurityKeys.default,
    "tagVulnerabilityList",
    ...Object.values(payload),
  ],
  // 레지스트리 보안 취약점 상세 정보
  vulnerabilityInfo: (
    payload?: Partial<GetRegistrySecurityVulnerabilityInfoPayload> | null,
  ) => [
    ...registrySecurityKeys.default,
    "vulnerabilityInfo",
    payload?.imageId,
    payload?.tagId,
    payload?.vulnerabilityId,
  ],
  // 레지스트리 보안 레벨 설정 업데이트 (mutation key)
  updateSecurityLevel: () => [
    ...registrySecurityKeys.default,
    "securityLevel",
    "update",
  ],
};
