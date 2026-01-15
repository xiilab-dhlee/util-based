import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import type { GroupChildrenResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  getGroupChildren as fetchGroupChildrenApi,
  getGetGroupChildrenQueryKey,
  useGetRootGroups,
} from "@/api/generated/group/group";
import {
  UNGROUPED_GROUP_ID,
  useUngroupedAccounts,
} from "@/shared/components/group-member-selector/hooks/use-ungrouped-accounts";

export function useGroupTreeLoader() {
  const queryClient = useQueryClient();

  const {
    data: rootGroupsResponse,
    isLoading: isLoadingRoot,
    error: rootError,
  } = useGetRootGroups();

  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [loadingGroups, setLoadingGroups] = useState<Set<string>>(new Set());

  const rootGroups = rootGroupsResponse ?? [];

  // 미소속 계정 훅 사용
  const {
    ungroupedGroup,
    getUngroupedChildren,
    fetchNextUngroupedPage,
    hasMoreUngrouped,
    isLoadingMoreUngrouped,
  } = useUngroupedAccounts();

  const collapseGroup = (groupId: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      next.delete(groupId);
      return next;
    });
  };

  const expandGroup = async (groupId: string) => {
    // 미소속 그룹은 이미 useUngroupedAccounts에서 데이터를 가져오므로
    // API 호출을 하지 않고 바로 확장 상태만 업데이트
    if (groupId === UNGROUPED_GROUP_ID) {
      setExpandedGroups((prev) => new Set(prev).add(groupId));
      return;
    }

    setLoadingGroups((prev) => new Set(prev).add(groupId));

    try {
      await queryClient.fetchQuery({
        queryKey: getGetGroupChildrenQueryKey(groupId),
        queryFn: ({ signal }) => fetchGroupChildrenApi(groupId, signal),
      });

      setExpandedGroups((prev) => new Set(prev).add(groupId));
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
    if (expandedGroups.has(groupId)) {
      collapseGroup(groupId);
      return;
    }

    await expandGroup(groupId);
  };

  const getGroupChildren = (
    groupId: string,
  ): GroupChildrenResponse | undefined => {
    // 미소속 그룹을 위한 특수 케이스 처리
    if (groupId === UNGROUPED_GROUP_ID) {
      return getUngroupedChildren();
    }

    return queryClient.getQueryData<GroupChildrenResponse>(
      getGetGroupChildrenQueryKey(groupId),
    );
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
    // 미소속 그룹 관련
    ungroupedGroup,
    fetchNextUngroupedPage,
    hasMoreUngrouped,
    isLoadingMoreUngrouped,
  };
}
