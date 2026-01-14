import { Spin } from "antd";
import type { ChangeEvent } from "react";
import { Fragment, useState } from "react";
import styled from "styled-components";
import { Icon, Input } from "xiilab-ui";

import type {
  GroupMemberResponse,
  GroupSummaryResponse,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { DataErrorState } from "@/shared/components/feedback/data-error-state";
import { AccountNodeLazy } from "@/shared/components/group-member-selector/components/account-node-lazy";
import { GroupNodeLazy } from "@/shared/components/group-member-selector/components/group-node-lazy";
import { useGroupTreeLoader } from "@/shared/components/group-member-selector/hooks/use-group-tree-loader";
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
  treeHeight?: number;
}

export function GroupTreeSelector({
  selectedAccountIds,
  selectedGroupIds,
  onSelectMember,
  treeHeight,
}: GroupTreeSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const {
    rootGroups,
    getGroupChildren,
    isLoadingRoot,
    rootError,
    toggleGroup,
    isGroupExpanded,
    isGroupLoading,
  } = useGroupTreeLoader();

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
    setSearchQuery(e.target.value);
  };

  const handleSelectGroup = (group: GroupSummaryResponse) => {
    onSelectMember({ type: ITEM_TYPES.GROUP, data: group });
  };

  const handleSelectAccount = (account: GroupMemberResponse) => {
    onSelectMember({ type: ITEM_TYPES.ACCOUNT, data: account });
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

  const hasRootError = Boolean(rootError);
  const isEmptyRoot =
    !isLoadingRoot && !hasRootError && rootGroups.length === 0;

  const renderTreeContent = () => {
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
          const position = getNodePosition(index, rootGroups.length);
          return renderGroup(group, 1, position, []);
        })}
      </>
    );
  };

  return (
    <Container>
      <SearchRow>
        <Input.Search
          name="search"
          placeholder="계정 이름 또는 그룹 이름을 입력해 주세요."
          autoComplete="off"
          width="100%"
          height={30}
          value={searchQuery}
          onChange={handleSearchChange}
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
  margin-bottom: 4px;
`;

const TreeWrapper = styled.div<{ $treeHeight?: number }>`
  flex: ${({ $treeHeight }) => ($treeHeight ? "0 0 auto" : "1")};
  height: ${({ $treeHeight }) => ($treeHeight ? `${$treeHeight}px` : "auto")};
  min-height: 0;
  overflow-y: auto;
  border: 1px solid #e9e9e9;
  border-radius: 2px;
  background-color: #fff;
  padding: 16px 14px;
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
