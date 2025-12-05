import type { CorePaginate, CorePayload } from "@/shared/types/api.interface";

export interface GetRegistrySecurityTagDetailPayload {
  imageId: number;
  tagId: number;
}

export interface GetRegistrySecurityVulnerabilityListPayload
  extends CorePayload,
    CorePaginate {
  imageId: number;
  tagId: number;
}

export interface UpdateSecurityLevelSettingPayload {
  isEnabled: boolean;
  level: string;
  thresholdCount: number;
}

/** 레지스트리 보안 취약점 상세 정보 조회 요청 */
export interface GetRegistrySecurityVulnerabilityInfoPayload {
  imageId: number;
  tagId: number;
  vulnerabilityId: string;
}
