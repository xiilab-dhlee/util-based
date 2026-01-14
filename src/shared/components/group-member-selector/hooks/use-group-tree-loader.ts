import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import type { GroupChildrenResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  getGroupChildren as fetchGroupChildrenApi,
  getGetGroupChildrenQueryKey,
  useGetRootGroups,
} from "@/api/generated/group/group";

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

  const collapseGroup = (groupId: string) => {
    setExpandedGroups((prev) => {
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
        staleTime: 1 * 60 * 1000,
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
  };
}
