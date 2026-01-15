import { useQuery } from "@tanstack/react-query";

import type { VulnerabilityListType } from "@/domain/security/schemas/vulnerability.schema";
import { vulnerabilityListMock } from "@/mocks/data/vulnerability.mock";
import type { CoreListResponse } from "@/shared/types/core.model";

export const useGetPrivateRegistryVulnerabilities = ({
  pageNo,
  pageSize,
  imageTagId,
}: {
  pageNo: number;
  pageSize: number;
  imageTagId: number | null;
}) => {
  return useQuery<CoreListResponse<VulnerabilityListType>, Error>({
    queryKey: ["private-registry", "vulnerabilities", imageTagId],
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
    enabled: !!imageTagId,
  });
};
