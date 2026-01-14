import { useQuery } from "@tanstack/react-query";

import type { VulnerabilityListType } from "@/domain/security/schemas/vulnerability.schema";
import { vulnerabilityListMock } from "@/mocks/data/vulnerability.mock";
import type { CoreListResponse } from "@/shared/types/core.model";

/**
 * 개인 레지스트리 태그 취약점 목록 조회 (임시 mock)
 */
export const useGetPrivateRegistryVulnerabilities = ({
  pageNo,
  pageSize,
}: {
  pageNo: number;
  pageSize: number;
}) => {
  return useQuery<CoreListResponse<VulnerabilityListType>, Error>({
    queryKey: ["private-registry", "vulnerabilities"],
    queryFn: async () => {
      return {
        content: vulnerabilityListMock,
        totalSize: vulnerabilityListMock.length,
        params: {
          pageNo,
          pageSize,
        },
      };
    },
  });
};
