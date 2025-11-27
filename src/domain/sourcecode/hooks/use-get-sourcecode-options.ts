import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import type { DropdownOption } from "xiilab-ui";

import { sourcecodeKeys } from "@/domain/sourcecode/constants/sourcecode.key";
import type { SourcecodeListType } from "@/domain/sourcecode/schemas/sourcecode.schema";
import { useServices } from "@/shared/providers/service-provider";

/**
 * 소스코드 옵션 목록 조회
 *
 */
export const useGetSourcecodeOptions = (): UseQueryResult<
  DropdownOption[],
  Error
> => {
  const { sourcecodeService } = useServices();

  return useQuery({
    queryKey: sourcecodeKeys.allList(),
    queryFn: async () => {
      const response = await sourcecodeService.getList({
        page: 1,
        size: 100,
        searchText: "",
      });
      return response.data;
    },
    select: (data) =>
      data.content.map((sourcecode: SourcecodeListType) => ({
        label: sourcecode.title,
        value: sourcecode.id,
      })),
  });
};
