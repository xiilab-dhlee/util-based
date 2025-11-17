import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { userKeys } from "@/constants/user/user.key";
import { useServices } from "@/providers/service-provider";
import type { UserListType } from "@/schemas/user.schema";
import type { CoreListResponse } from "@/types/common/core.model";
import type { GetPendingUsersPayload } from "@/types/user/user.type";

/**
 * 가입 승인 목록 조회
 */
export const useGetPendingUsers = (
  payload: GetPendingUsersPayload,
): UseQueryResult<CoreListResponse<UserListType>, Error> => {
  const { userService } = useServices();

  return useQuery({
    queryKey: userKeys.pendingList(payload),
    queryFn: async () => {
      const response = await userService.getPendingList(payload);
      return response.data;
    },
  });
};
