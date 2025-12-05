import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { fileSecurityKeys } from "@/domain/security/constants/file-security.key";
import type { FileSecurityScanListQuery } from "@/domain/security/schemas/file-security-scan.schema";
import type { GetFileSecurityScanListResponse } from "@/domain/security/types/file-security.type";
import { useServices } from "@/shared/providers/service-provider";

/**
 * 파일 시스템 보안 검사 목록 조회
 */
export const useGetFileSecurityScanList = (
  payload?: FileSecurityScanListQuery,
): UseQueryResult<GetFileSecurityScanListResponse, Error> => {
  const { fileSecurityService } = useServices();

  return useQuery({
    queryKey: fileSecurityKeys.scanList(payload),
    queryFn: async () => {
      const response = await fileSecurityService.getScanList(payload);
      return response.data;
    },
  });
};
