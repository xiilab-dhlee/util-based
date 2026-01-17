import { useQueries, useQueryClient } from "@tanstack/react-query";
import { isString } from "es-toolkit";
import { useCallback, useMemo, useState } from "react";

import type { GroupChildrenResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  getGroupChildren as fetchGroupChildrenApi,
  getGetGroupChildrenQueryKey,
  getGetRootGroupsQueryKey,
  useGetRootGroups,
} from "@/api/generated/group/group";
import { useUngroupedAccounts } from "@/shared/components/group-member-selector/hooks/use-ungrouped-accounts";

const GROUP_CHILDREN_KEY_PREFIX = getGetGroupChildrenQueryKey("")[0];
const ROOT_GROUPS_KEY = getGetRootGroupsQueryKey()[0];

export type GroupTreeLoaderState = ReturnType<typeof useGroupTreeLoader>;

export function useGroupTreeLoader() {
  const queryClient = useQueryClient();

  const {
    data: rootGroupsResponse,
    isLoading: isLoadingRoot,
    error: rootError,
  } = useGetRootGroups();

  // 각 트리 인스턴스별 독립적인 확장 상태
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [loadingGroups, setLoadingGroups] = useState<Set<string>>(new Set());

  // 트리 상태 초기화 함수 (모달에서 열릴 때 호출)
  const resetTree = useCallback(() => {
    setExpandedGroups(new Set());
    setLoadingGroups(new Set());

    // 캐시된 그룹 자식 쿼리 제거
    queryClient.removeQueries({
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
  }, [queryClient]);

  const rootGroups = rootGroupsResponse ?? [];

  // 미소속 계정 훅 사용
  const {
    ungroupedAccounts,
    fetchNextUngroupedPage,
    hasMoreUngrouped,
    isLoadingMoreUngrouped,
  } = useUngroupedAccounts();

  // 확장된 그룹들의 자식 데이터를 reactive하게 구독
  const expandedGroupIds = useMemo(
    () => Array.from(expandedGroups),
    [expandedGroups],
  );

  const childrenQueries = useQueries({
    queries: expandedGroupIds.map((groupId) => ({
      queryKey: getGetGroupChildrenQueryKey(groupId),
      queryFn: ({ signal }: { signal: AbortSignal }) =>
        fetchGroupChildrenApi(groupId, signal),
      staleTime: 0,
    })),
  });

  const childrenDataMap = useMemo(() => {
    const map = new Map<string, GroupChildrenResponse>();
    expandedGroupIds.forEach((groupId, index) => {
      const queryResult = childrenQueries[index];
      if (queryResult?.data) {
        map.set(groupId, queryResult.data);
      }
    });
    return map;
  }, [expandedGroupIds, childrenQueries]);

  const collapseGroup = (groupId: string) => {
    setExpandedGroups((prev: Set<string>) => {
      const next = new Set(prev);
      next.delete(groupId);
      return next;
    });
  };

  const expandGroup = async (groupId: string) => {
    setLoadingGroups((prev) => new Set(prev).add(groupId));

    try {
      await queryClient.fetchQuery({
        queryKey: getGetGroupChildrenQueryKey(groupId),
        queryFn: ({ signal }) => fetchGroupChildrenApi(groupId, signal),
      });

      setExpandedGroups((prev: Set<string>) => new Set(prev).add(groupId));
    } catch (error) {
      if (
        error instanceof Error &&
        (error.name === "AbortError" || error.name === "CanceledError")
      ) {
        return;
      }
      console.error(`Failed to load children for group ${groupId}:`, error);
    } finally {
      setLoadingGroups((prev) => {
        const next = new Set(prev);
        next.delete(groupId);
        return next;
      });
    }
  };

  const toggleGroup = async (groupId: string) => {
    const isExpanded = expandedGroups.has(groupId);
    const hasData = Boolean(getGroupChildren(groupId));

    if (isExpanded && hasData) {
      collapseGroup(groupId);
      return;
    }

    await expandGroup(groupId);
  };

  const getGroupChildren = (
    groupId: string,
  ): GroupChildrenResponse | undefined => {
    return childrenDataMap.get(groupId);
  };

  const isGroupExpanded = (groupId: string) => expandedGroups.has(groupId);

  const isGroupLoading = (groupId: string) => loadingGroups.has(groupId);

  return {
    rootGroups,
    getGroupChildren,
    expandedGroups,
    isLoadingRoot,
    rootError,
    toggleGroup,
    isGroupExpanded,
    isGroupLoading,
    resetTree,
    // 미소속 그룹 관련
    ungroupedAccounts,
    fetchNextUngroupedPage,
    hasMoreUngrouped,
    isLoadingMoreUngrouped,
  };
}
