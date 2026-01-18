import { Spin } from "antd";
import type { ChangeEvent } from "react";
import { Fragment, useEffect, useRef } from "react";
import styled from "styled-components";
import { Icon, Input } from "xiilab-ui";

import type {
  AccountWithGroupsResponse,
  GroupMemberResponse,
  GroupSummaryResponse,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { DataErrorState } from "@/shared/components/feedback/data-error-state";
import { AccountNodeLazy } from "@/shared/components/group-member-selector/components/account-node-lazy";
import { AccountWithGroupsNode } from "@/shared/components/group-member-selector/components/account-with-groups-node";
import { GroupNodeLazy } from "@/shared/components/group-member-selector/components/group-node-lazy";
import {
  type GroupTreeLoaderState,
  useGroupTreeLoader,
} from "@/shared/components/group-member-selector/hooks/use-group-tree-loader";
import type { GroupTreeSearchState } from "@/shared/components/group-member-selector/hooks/use-group-tree-search-state";
import {
  ITEM_TYPES,
  type ItemType,
  NODE_POSITIONS,
  type NodePosition,
  type SelectableItem,
} from "@/shared/components/group-member-selector/types";

interface GroupTreeSelectorProps {
  selectedAccountIds: Set<string>;
  selectedGroupIds: Set<string>;
  onSelectMember: (item: SelectableItem) => void;
  searchState: GroupTreeSearchState;
  treeHeight?: number;
  searchPlaceholder?: string;
  /** 외부에서 트리 상태를 관리할 경우 전달 (모달에서 resetTree 호출 등) */
  treeLoader?: GroupTreeLoaderState;
}

// Intersection Observer를 사용한 무한 스크롤 센티널 컴포넌트
function InfiniteScrollSentinel({
  onVisible,
  isLoading,
}: {
  onVisible: () => void;
  isLoading: boolean;
}) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !isLoading) {
          onVisible();
        }
      },
      {
        root: null,
        rootMargin: "150px",
        threshold: 0,
      },
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [onVisible, isLoading]);

  return <SentinelDiv ref={sentinelRef} />;
}

export function GroupTreeSelector({
  selectedAccountIds,
  selectedGroupIds,
  onSelectMember,
  searchState,
  treeHeight,
  searchPlaceholder = "계정 이름 또는 그룹 이름을 입력해 주세요.",
  treeLoader: externalTreeLoader,
}: GroupTreeSelectorProps) {
  const {
    searchText,
    onSearchTextChange,
    onSearchSubmit,
    onSearchClear,
    expandedSearchGroupIds,
    setExpandedSearchGroupIds,
    searchResults,
    isSearching,
    searchError,
    searchKeyword,
  } = searchState;

  const internalTreeLoader = useGroupTreeLoader();
  const treeLoader = externalTreeLoader ?? internalTreeLoader;

  const {
    rootGroups,
    getGroupChildren,
    isLoadingRoot,
    rootError,
    toggleGroup,
    isGroupExpanded,
    isGroupLoading,
    ungroupedAccounts,
    fetchNextUngroupedPage,
    hasMoreUngrouped,
    isLoadingMoreUngrouped,
  } = treeLoader;

  const isSelected = (id: string, type: ItemType) => {
    if (type === ITEM_TYPES.ACCOUNT) {
      return selectedAccountIds.has(id);
    }
    return selectedGroupIds.has(id);
  };

  const getNodePosition = (index: number, totalCount: number): NodePosition => {
    if (totalCount === 1) return NODE_POSITIONS.LAST;
    if (index === 0) return NODE_POSITIONS.FIRST;
    if (index === totalCount - 1) return NODE_POSITIONS.LAST;
    return NODE_POSITIONS.MIDDLE;
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    onSearchTextChange(e.target.value);
  };

  const handleSelectGroup = (group: GroupSummaryResponse) => {
    onSelectMember({ type: ITEM_TYPES.GROUP, data: group });
  };

  const handleSelectAccount = (account: GroupMemberResponse) => {
    onSelectMember({ type: ITEM_TYPES.ACCOUNT, data: account });
  };

  const handleSelectAccountWithGroups = (
    account: AccountWithGroupsResponse,
  ) => {
    onSelectMember({
      type: ITEM_TYPES.ACCOUNT,
      data: {
        accountId: account.accountId,
        accountName: account.accountName,
        email: account.email,
      },
    });
  };

  const toggleSearchGroup = (groupId: string) => {
    setExpandedSearchGroupIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
        if (!getGroupChildren(groupId)) {
          toggleGroup(groupId);
        }
      }
      return newSet;
    });
  };

  const renderGroup = (
    group: GroupSummaryResponse,
    depth: number,
    position: NodePosition,
    ancestorsHasNext: boolean[],
  ) => {
    const expanded = isGroupExpanded(group.groupId);
    const loading = isGroupLoading(group.groupId);
    const selected = isSelected(group.groupId, ITEM_TYPES.GROUP);

    return (
      <Fragment key={`group-${group.groupId}`}>
        <GroupNodeLazy
          group={group}
          isExpanded={expanded}
          isLoading={loading}
          isSelected={selected}
          depth={depth}
          position={position}
          ancestorsHasNext={ancestorsHasNext}
          onToggle={() => toggleGroup(group.groupId)}
          onSelect={() => handleSelectGroup(group)}
          isSingleRoot={false}
          hasParentRow={depth === 1}
        />

        {expanded &&
          renderChildren(group.groupId, depth + 1, [
            ...ancestorsHasNext,
            position !== NODE_POSITIONS.LAST,
          ])}
      </Fragment>
    );
  };

  const renderAccount = (
    account: GroupMemberResponse,
    depth: number,
    position: NodePosition,
    ancestorsHasNext: boolean[],
  ) => {
    const selected = isSelected(account.accountId, ITEM_TYPES.ACCOUNT);

    return (
      <AccountNodeLazy
        key={`account-${account.accountId}`}
        account={account}
        isSelected={selected}
        depth={depth}
        position={position}
        ancestorsHasNext={ancestorsHasNext}
        onSelect={() => handleSelectAccount(account)}
        isSingleRoot={false}
        hasParentRow={depth === 1}
      />
    );
  };

  const renderChildren = (
    groupId: string,
    depth: number,
    ancestorsHasNext: boolean[],
  ) => {
    const childrenData = getGroupChildren(groupId);
    if (!childrenData) return null;

    const { group: childGroups = [], account: childAccounts = [] } =
      childrenData;

    const totalCount = childGroups.length + childAccounts.length;

    return (
      <>
        {childGroups.map((childGroup, index) => {
          const position = getNodePosition(index, totalCount);
          return renderGroup(childGroup, depth, position, ancestorsHasNext);
        })}

        {childAccounts.map((account, index) => {
          const position = getNodePosition(
            index + childGroups.length,
            totalCount,
          );
          return renderAccount(account, depth, position, ancestorsHasNext);
        })}
      </>
    );
  };

  const renderSearchGroup = (
    group: GroupSummaryResponse,
    depth: number,
    position: NodePosition,
    ancestorsHasNext: boolean[],
  ) => {
    const expanded = expandedSearchGroupIds.has(group.groupId);
    const loading = isGroupLoading(group.groupId);
    const selected = isSelected(group.groupId, ITEM_TYPES.GROUP);

    return (
      <Fragment key={`search-group-${group.groupId}`}>
        <GroupNodeLazy
          group={group}
          isExpanded={expanded}
          isLoading={loading}
          isSelected={selected}
          depth={depth}
          position={position}
          ancestorsHasNext={ancestorsHasNext}
          onToggle={() => toggleSearchGroup(group.groupId)}
          onSelect={() => handleSelectGroup(group)}
          isSingleRoot={false}
          hasParentRow={false}
        />

        {expanded &&
          renderChildren(group.groupId, depth + 1, [
            ...ancestorsHasNext,
            position !== NODE_POSITIONS.LAST,
          ])}
      </Fragment>
    );
  };

  const renderSearchAccount = (
    account: AccountWithGroupsResponse,
    depth: number,
    position: NodePosition,
    ancestorsHasNext: boolean[],
  ) => {
    const selected = isSelected(account.accountId, ITEM_TYPES.ACCOUNT);

    return (
      <AccountWithGroupsNode
        key={`search-account-${account.accountId}`}
        account={account}
        isSelected={selected}
        depth={depth}
        position={position}
        ancestorsHasNext={ancestorsHasNext}
        onSelect={() => handleSelectAccountWithGroups(account)}
        isSingleRoot={false}
        hasParentRow={false}
      />
    );
  };

  const renderSearchResults = () => {
    if (!searchResults) return null;

    const { groups, accounts } = searchResults;
    const hasGroups = groups.length > 0;
    const hasAccounts = accounts.length > 0;

    if (!hasGroups && !hasAccounts) {
      return (
        <EmptyWrapper>
          <Icon name="Search" size={32} color="#d9d9d9" />
          <EmptyText>검색 결과가 없습니다.</EmptyText>
        </EmptyWrapper>
      );
    }

    const totalCount = groups.length + accounts.length;

    return (
      <>
        {hasGroups && (
          <SearchSectionLabel>그룹 ({groups.length})</SearchSectionLabel>
        )}
        {groups.map((group, index) => {
          const position = getNodePosition(
            index,
            hasAccounts ? groups.length : totalCount,
          );
          return renderSearchGroup(group, 0, position, []);
        })}

        {hasAccounts && (
          <SearchSectionLabel>계정 ({accounts.length})</SearchSectionLabel>
        )}
        {accounts.map((account, index) => {
          const position = getNodePosition(index, accounts.length);
          return renderSearchAccount(account, 0, position, []);
        })}
      </>
    );
  };

  const hasRootError = Boolean(rootError);
  const isEmptyRoot =
    !isLoadingRoot &&
    !hasRootError &&
    rootGroups.length === 0 &&
    ungroupedAccounts.length === 0;

  const isSearchMode = Boolean(searchKeyword);

  const renderTreeContent = () => {
    // 검색 모드
    if (isSearchMode) {
      if (isSearching) {
        return (
          <LoadingWrapper>
            <Spin size="small" />
          </LoadingWrapper>
        );
      }

      if (searchError) {
        return (
          <ErrorWrapper>
            <DataErrorState />
          </ErrorWrapper>
        );
      }

      return renderSearchResults();
    }

    // 트리 모드
    if (isLoadingRoot) {
      return (
        <LoadingWrapper>
          <Spin size="small" />
        </LoadingWrapper>
      );
    }

    if (hasRootError) {
      return (
        <ErrorWrapper>
          <DataErrorState />
        </ErrorWrapper>
      );
    }

    if (isEmptyRoot) {
      return (
        <EmptyWrapper>
          <Icon name="Folder" size={32} color="#d9d9d9" />
          <EmptyText>그룹이 없습니다.</EmptyText>
        </EmptyWrapper>
      );
    }

    return (
      <>
        <RootTreeRow>
          <RootIndent>
            <RootIndentBridge />
            <RootListIconWrapper>
              <Icon name="FormatListBulleted" color="#fff" size={18} />
            </RootListIconWrapper>
          </RootIndent>
          <RootText>전체</RootText>
        </RootTreeRow>

        {rootGroups?.map((group, index) => {
          const totalNodes = rootGroups.length + ungroupedAccounts.length;
          const position = getNodePosition(index, totalNodes);
          return renderGroup(group, 1, position, []);
        })}

        {ungroupedAccounts.map((account, index) => {
          const totalNodes = rootGroups.length + ungroupedAccounts.length;
          const position = getNodePosition(
            index + rootGroups.length,
            totalNodes,
          );
          return renderAccount(account, 1, position, []);
        })}

        {hasMoreUngrouped && (
          <InfiniteScrollSentinel
            onVisible={fetchNextUngroupedPage}
            isLoading={isLoadingMoreUngrouped}
          />
        )}

        {isLoadingMoreUngrouped && (
          <LoadingMoreWrapper>
            <Spin size="small" />
          </LoadingMoreWrapper>
        )}
      </>
    );
  };

  return (
    <Container>
      <SearchRow>
        <Input.Search
          name="search"
          placeholder={searchPlaceholder}
          autoComplete="off"
          width="100%"
          height={30}
          value={searchText}
          onChange={handleSearchChange}
          onSearch={onSearchSubmit}
          onClear={onSearchClear}
        />
      </SearchRow>

      <TreeWrapper $treeHeight={treeHeight}>{renderTreeContent()}</TreeWrapper>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const SearchRow = styled.div`
  margin-bottom: var(--group-tree-search-margin-bottom, 4px);
`;

const TreeWrapper = styled.div<{ $treeHeight?: number }>`
  flex: ${({ $treeHeight }) => ($treeHeight ? "0 0 auto" : "1")};
  height: ${({ $treeHeight }) => ($treeHeight ? `${$treeHeight}px` : "auto")};
  min-height: 0;
  overflow-y: auto;
  border: var(--group-tree-border, 1px solid #e9e9e9);
  border-radius: var(--group-tree-border-radius, 2px);
  background-color: var(--group-tree-background-color, #fff);
  padding: var(--group-tree-padding, 16px 14px);
  display: flex;
  flex-direction: column;
`;

const RootTreeRow = styled.div`
  display: flex;
  align-items: center;
  height: 24px;

  --tree-indent-size: 24px;
  --tree-leaf-size: 12px;
  --tree-leaf-border-color: #d6deee;
`;

const RootIndent = styled.div`
  min-width: var(--tree-indent-size);
  height: var(--tree-indent-size);
  position: relative;
`;

const RootIndentBridge = styled.div`
  position: absolute;
  left: var(--tree-leaf-size);
  border-left: 1px solid var(--tree-leaf-border-color);
  width: var(--tree-leaf-size);
  height: 100%;
`;

const RootListIconWrapper = styled.div`
  width: var(--tree-indent-size);
  height: var(--tree-indent-size);
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #37455e;
  border-radius: 2px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
`;

const RootText = styled.span`
  font-size: 12px;
  line-height: 24px;
  padding-left: 4px;
`;

const LoadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  height: 200px;
`;

const ErrorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const EmptyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  height: 200px;
`;

const EmptyText = styled.span`
  font-size: 14px;
  color: #8c8c8c;
`;

const SentinelDiv = styled.div`
  height: 1px;
  width: 100%;
`;

const LoadingMoreWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 0;
  height: 40px;
`;

const SearchSectionLabel = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #5f6368;
  padding: 8px 0 4px 0;
  margin-top: 8px;

  &:first-child {
    margin-top: 0;
  }
`;
