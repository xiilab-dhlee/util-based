import type {
  ResourcePresetDetailResponseType,
  ResourcePresetListResponseType,
} from "@/domain/resource-preset/schemas/resource-preset.schema";
import type { CorePayload } from "@/shared/types/api.interface";
import type { CoreListResponse } from "@/shared/types/core.model";

/**
 * 리소스 프리셋 목록 조회 페이로드
 */
export interface GetResourcePresetsPayload extends CorePayload {
  /** 페이지 번호 */
  page?: number;
  /** 페이지 크기 */
  size?: number;
  /** 검색어 */
  search?: string;
  /** Job Type 필터 */
  jobType?: string;
  /** Node Type 필터 */
  nodeType?: string;
}

/**
 * 리소스 프리셋 목록 응답 타입
 */
export type ResourcePresetsListResponse =
  CoreListResponse<ResourcePresetListResponseType>;

/**
 * 리소스 프리셋 상세 응답 타입
 */
export type ResourcePresetDetailResponse = ResourcePresetDetailResponseType;
