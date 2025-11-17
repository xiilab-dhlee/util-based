import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { userKeys } from "@/constants/user/user.key";
import { useServices } from "@/providers/service-provider";
import type { UserListType } from "@/schemas/user.schema";
import type { CoreListResponse } from "@/types/common/core.model";
import type { GetUsersPayload } from "@/types/user/user.type";

/**
 * 사용자 목록 조회
 */
export const useGetUsers = (
  payload: GetUsersPayload,
): UseQueryResult<CoreListResponse<UserListType>, Error> => {
  const { userService } = useServices();

  return useQuery({
    queryKey: userKeys.list(payload),
    queryFn: async () => {
      const response = await userService.getList(payload);
      return response.data;
    },
  });
};
