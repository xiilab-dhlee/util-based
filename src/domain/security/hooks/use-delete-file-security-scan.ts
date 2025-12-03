import { type UseMutationResult, useMutation } from "@tanstack/react-query";

import { useServices } from "@/shared/providers/service-provider";

/**
 * 파일 시스템 보안 검사 삭제
 */
export const useDeleteFileSecurityScan = (): UseMutationResult<
  unknown,
  Error,
  number[],
  unknown
> => {
  const { fileSecurityService } = useServices();

  return useMutation({
    mutationFn: (scanIds: number[]) => {
      return fileSecurityService.deleteScans(scanIds);
    },
    onSuccess: () => {},
  });
};
