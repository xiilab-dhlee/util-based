import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import { isNil } from "es-toolkit";

import { fileSecurityKeys } from "@/domain/security/constants/file-security.key";
import type { FileSecurityScanFileType } from "@/domain/security/schemas/file-security-scan.schema";
import type { GetFileSecurityScanFileListPayload } from "@/domain/security/types/file-security.type";
import { useServices } from "@/shared/providers/service-provider";
import type { CoreListResponse } from "@/shared/types/core.model";

/**
 * 파일 시스템 보안 검사 파일 목록 조회
 */
export const useGetFileSecurityScanFiles = (
  payload: GetFileSecurityScanFileListPayload,
): UseQueryResult<CoreListResponse<FileSecurityScanFileType>, Error> => {
  const { fileSecurityService } = useServices();

  return useQuery({
    queryKey: fileSecurityKeys.scanFileList(payload),
    queryFn: async () => {
      const response = await fileSecurityService.getScanFileList(payload);
      return response.data;
    },
    enabled: !isNil(payload.scanId) && Number.isFinite(payload.scanId),
  });
};
