import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { userKeys } from "@/domain/user/constants/user.key";
import type { UserListType } from "@/domain/user/schemas/user.schema";
import type { GetPendingUsersPayload } from "@/domain/user/types/user.type";
import { useServices } from "@/shared/providers/service-provider";
import type { CoreListResponse } from "@/shared/types/core.model";

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
