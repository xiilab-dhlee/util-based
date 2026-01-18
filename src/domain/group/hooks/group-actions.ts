import type { QueryClient } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { isString } from "es-toolkit";

import {
  useCreateGroup,
  useDeleteGroup as useDeleteGroupApi,
  useUpdateGroup,
} from "@/api/generated/admin-group/admin-group";
import {
  getGetGroupChildrenQueryKey,
  getGetGroupDetailQueryKey,
  getGetRootGroupsQueryKey,
} from "@/api/generated/group/group";

/**
 * 쿼리 키 패턴 추출 (하드코딩 방지)
 * orval 생성 함수를 활용하여 API 경로 변경 시 자동 대응
 */
const GROUP_CHILDREN_KEY_PREFIX = getGetGroupChildrenQueryKey("")[0];
const ROOT_GROUPS_KEY = getGetRootGroupsQueryKey()[0];

/**
 * 모든 그룹 자식 데이터 쿼리를 무효화하는 헬퍼 함수
 * 각 트리가 독립적인 로컬 상태를 사용하므로, predicate로 모든 관련 쿼리 무효화
 * useQueries가 자동으로 refetch하여 트리뷰가 업데이트됨
 */
function invalidateAllGroupChildrenQueries(queryClient: QueryClient) {
  queryClient.invalidateQueries({
    predicate: (query) => {
      const queryKey = query.queryKey;
      if (!Array.isArray(queryKey) || queryKey.length === 0) return false;
      const firstKey = queryKey[0];
      return (
        isString(firstKey) &&
        firstKey.startsWith(GROUP_CHILDREN_KEY_PREFIX) &&
        firstKey !== ROOT_GROUPS_KEY
      );
    },
  });
}

/**
 * 그룹 생성 액션 - 쿼리 자동 리패치
 * 생성 후 루트 그룹 목록을 리패치하여 왼쪽 트리뷰가 즉시 업데이트됨
 */
export function useCreateGroupAction(
  options?: Parameters<typeof useCreateGroup>[0],
) {
  const queryClient = useQueryClient();

  return useCreateGroup(
    {
      ...options,
      mutation: {
        ...options?.mutation,
        onSuccess: (...args) => {
          queryClient.invalidateQueries({
            queryKey: getGetRootGroupsQueryKey(),
          });

          invalidateAllGroupChildrenQueries(queryClient);

          options?.mutation?.onSuccess?.(...args);
        },
      },
    },
    queryClient,
  );
}

/**
 * 그룹 업데이트 액션 - 쿼리 자동 리패치
 * 그룹 정보(이름, 설명, 멤버) 수정 후 관련 쿼리 리패치
 */
export function useUpdateGroupAction(
  options?: Parameters<typeof useUpdateGroup>[0],
) {
  const queryClient = useQueryClient();

  return useUpdateGroup(
    {
      ...options,
      mutation: {
        ...options?.mutation,
        onSuccess: (...args) => {
          const [, variables] = args;

          // 루트 그룹 목록 리패치 (그룹명이 변경되었을 수 있음)
          queryClient.invalidateQueries({
            queryKey: getGetRootGroupsQueryKey(),
          });

          // 모든 그룹 자식 데이터 refetch (각 트리의 확장 상태 유지)
          invalidateAllGroupChildrenQueries(queryClient);

          // 그룹 상세 정보 리패치
          const detailQueryKey = getGetGroupDetailQueryKey(variables.groupId);
          queryClient.invalidateQueries({
            queryKey: detailQueryKey,
          });

          options?.mutation?.onSuccess?.(...args);
        },
      },
    },
    queryClient,
  );
}

/**
 * 그룹 삭제 액션 - 쿼리 자동 리패치
 * 그룹 삭제 후 루트 그룹 목록 리패치
 */
export function useDeleteGroupAction(
  options?: Parameters<typeof useDeleteGroupApi>[0],
) {
  const queryClient = useQueryClient();

  return useDeleteGroupApi(
    {
      ...options,
      mutation: {
        ...options?.mutation,
        onSuccess: (...args) => {
          const [, variables] = args;

          // 루트 그룹 목록 리패치 (삭제된 그룹 제거)
          queryClient.invalidateQueries({
            queryKey: getGetRootGroupsQueryKey(),
          });

          // 모든 그룹 자식 데이터 refetch (각 트리의 확장 상태 유지)
          invalidateAllGroupChildrenQueries(queryClient);

          // 삭제된 그룹의 상세 정보 캐시 제거
          queryClient.removeQueries({
            queryKey: getGetGroupDetailQueryKey(variables.groupId),
          });

          options?.mutation?.onSuccess?.(...args);
        },
      },
    },
    queryClient,
  );
}
