import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { isNil } from "es-toolkit";

import { fileSecurityKeys } from "@/domain/security/constants/file-security.key";
import type {
  GetFileSecurityCriticalVulnerabilitiesPayload,
  GetFileSecurityCriticalVulnerabilitiesResponse,
} from "@/domain/security/types/file-security.type";
import { useServices } from "@/shared/providers/service-provider";

/**
 * 파일 시스템 보안 Critical 취약점 목록 조회
 *
 * - 스캔 ID 기준 Critical 취약점 카드 목록을 조회합니다.
 * - 응답은 공통 목록 응답 형태(CoreListResponse)입니다.
 */
export const useGetFileSecurityCriticalVulnerabilities = (
  payload: GetFileSecurityCriticalVulnerabilitiesPayload,
): UseQueryResult<GetFileSecurityCriticalVulnerabilitiesResponse, Error> => {
  const { fileSecurityService } = useServices();

  return useQuery({
    queryKey: fileSecurityKeys.criticalVulnerabilityList(payload),
    queryFn: async () => {
      const response =
        await fileSecurityService.getCriticalVulnerabilities(payload);
      return response.data;
    },
    enabled: !isNil(payload.scanId),
  });
};
