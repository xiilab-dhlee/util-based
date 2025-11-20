import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { userKeys } from "@/domain/user/constants/user.key";
import type { UserListType } from "@/domain/user/schemas/user.schema";
import type { GetUsersPayload } from "@/domain/user/types/user.type";
import { useServices } from "@/shared/providers/service-provider";
import type { CoreListResponse } from "@/shared/types/core.model";

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
