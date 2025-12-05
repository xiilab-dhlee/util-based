import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { isNil } from "es-toolkit";

import { fileSecurityKeys } from "@/domain/security/constants/file-security.key";
import type { FileSecurityScanDetailType } from "@/domain/security/schemas/file-security-scan.schema";
import type { GetFileSecurityScanDetailPayload } from "@/domain/security/types/file-security.type";
import { useServices } from "@/shared/providers/service-provider";

/**
 * 파일 시스템 보안 검사 상세 조회
 */
export const useGetFileSecurityScanDetail = (
  payload: GetFileSecurityScanDetailPayload,
): UseQueryResult<FileSecurityScanDetailType, Error> => {
  const { fileSecurityService } = useServices();

  const enabled = !isNil(payload.scanId) && Number.isFinite(payload.scanId);

  return useQuery({
    queryKey: fileSecurityKeys.scanDetail(payload),
    queryFn: async () => {
      const response = await fileSecurityService.getScanDetail(payload);
      return response.data;
    },
    enabled,
  });
};
