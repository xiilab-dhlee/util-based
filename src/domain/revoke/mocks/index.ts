import type { HttpHandler } from "msw";

import {
  getGetAllPoliciesMockHandler,
  getGetPolicyMockHandler,
  getGetScanHistoryDetailMockHandler,
  getGetScanHistoryListMockHandler,
  getGetScanHistoryPolicyMockHandler,
  getGetScanResultListMockHandler,
  getUpdateReclaimPolicyEnabledMockHandler,
  getUpdateReclaimPolicyMockHandler,
} from "@/api/generated/workload-reclaim-policy-admin/workload-reclaim-policy-admin.msw";

/**
 * 리소스 회수 정책 관련 MSW 핸들러
 *
 * 중요: 구체적인 라우트가 파라미터 라우트보다 먼저 등록되어야 함
 * - /scan-histories (구체적) 먼저
 * - /:jobType (파라미터) 나중에
 */
export const revokeHandlers: HttpHandler[] = [
  // 구체적 라우트 먼저 등록 (파라미터 라우트보다 우선순위 높음)
  getGetAllPoliciesMockHandler(),
  getGetScanHistoryListMockHandler(),
  getGetScanHistoryDetailMockHandler(),
  getGetScanResultListMockHandler(),
  getGetScanHistoryPolicyMockHandler(),

  // 파라미터 라우트 나중에 등록
  getGetPolicyMockHandler(),
  getUpdateReclaimPolicyMockHandler(),
  getUpdateReclaimPolicyEnabledMockHandler(),
];
