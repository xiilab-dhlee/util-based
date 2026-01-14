import { useQueries } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import type {
  GroupMemberResponse,
  GroupSummaryResponse,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  getGetGroupChildrenQueryKey,
  getGroupChildren,
} from "@/api/generated/group/group";
import {
  ITEM_TYPES,
  type ItemType,
  type SelectableItem,
} from "@/shared/components/group-member-selector/types";

interface UseMemberSelectionProps {
  /** 초기 선택된 멤버 (선택 사항) */
  initialMembers?: GroupMemberResponse[];
  /** 선택 변경 시 콜백 */
  onChange?: (
    accounts: GroupMemberResponse[],
    groups: GroupSummaryResponse[],
  ) => void;
}

/**
 * 멤버 선택 상태 관리 훅
 */
export function useMemberSelection({
  initialMembers,
  onChange,
}: UseMemberSelectionProps = {}) {
  // 선택된 계정 목록
  const [selectedAccounts, setSelectedAccounts] = useState<
    GroupMemberResponse[]
  >([]);

  // 선택된 그룹 목록
  const [selectedGroups, setSelectedGroups] = useState<GroupSummaryResponse[]>(
    [],
  );

  useEffect(() => {
    setSelectedGroups([]);
    setSelectedAccounts(initialMembers ?? []);
  }, [initialMembers]);

  const groupQueriesResults = useQueries({
    queries: selectedGroups.map((group) => ({
      queryKey: getGetGroupChildrenQueryKey(group.groupId),
      queryFn: ({ signal }: { signal: AbortSignal }) =>
        getGroupChildren(group.groupId, signal),
    })),
  });

  const isFlatteningMembers = groupQueriesResults.some(
    (result) => result.isLoading,
  );

  // 선택 변경 시 콜백 호출
  useEffect(() => {
    if (onChange) {
      onChange(selectedAccounts, selectedGroups);
    }
  }, [selectedAccounts, selectedGroups, onChange]);

  const toggleMember = (item: SelectableItem) => {
    if (item.type === ITEM_TYPES.ACCOUNT) {
      const account = item.data;
      setSelectedAccounts((prev) => {
        const exists = prev.some((a) => a.accountId === account.accountId);
        if (exists) {
          return prev.filter((a) => a.accountId !== account.accountId);
        }
        return [...prev, account];
      });
      return;
    }

    // 그룹 토글
    const group = item.data;
    setSelectedGroups((prevGroups) => {
      const exists = prevGroups.some((g) => g.groupId === group.groupId);

      if (exists) {
        return prevGroups.filter((g) => g.groupId !== group.groupId);
      }

      return [...prevGroups, group];
    });
  };

  /**
   * 멤버 제거
   */
  const removeMember = (id: string, type: ItemType) => {
    if (type === ITEM_TYPES.ACCOUNT) {
      setSelectedAccounts((prev) => prev.filter((a) => a.accountId !== id));
    } else {
      setSelectedGroups((prev) => prev.filter((g) => g.groupId !== id));
    }
  };

  /**
   * 특정 항목이 선택되었는지 확인
   */
  const isSelected = (id: string, type: ItemType) => {
    if (type === ITEM_TYPES.ACCOUNT) {
      return selectedAccounts.some((a) => a.accountId === id);
    }
    return selectedGroups.some((g) => g.groupId === id);
  };

  const flattenMembers = (): GroupMemberResponse[] => {
    const accountMap = new Map<string, GroupMemberResponse>();

    selectedAccounts.forEach((acc) => {
      accountMap.set(acc.accountId, acc);
    });

    groupQueriesResults.forEach((result, index) => {
      if (result.isSuccess && result.data) {
        const groupId = selectedGroups[index]?.groupId;
        const isStillSelected = selectedGroups.some(
          (g) => g.groupId === groupId,
        );

        if (isStillSelected) {
          const accounts = result.data.account ?? [];
          accounts.forEach((acc) => {
            accountMap.set(acc.accountId, acc);
          });
        }
      }
    });

    return Array.from(accountMap.values());
  };

  const reset = () => {
    setSelectedAccounts([]);
    setSelectedGroups([]);
  };

  /**
   * 선택된 항목이 있는지 확인
   */
  const hasSelections =
    selectedAccounts.length > 0 || selectedGroups.length > 0;

  return {
    // 상태
    selectedAccounts,
    selectedGroups,
    hasSelections,
    isFlatteningMembers,

    // 액션
    toggleMember,
    removeMember,
    isSelected,
    flattenMembers,
    reset,
  };
}
