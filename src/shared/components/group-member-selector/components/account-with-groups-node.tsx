import { Tooltip } from "antd";
import styled from "styled-components";
import { Icon } from "xiilab-ui";

import type { AccountWithGroupsResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import type { NodePosition } from "@/shared/components/group-member-selector/types";
import {
  Indent,
  TreeContainer,
} from "@/shared/components/group-member-selector/utils/indent-styles";
import {
  renderAncestorIndents,
  renderCurrentLevelIndent,
} from "@/shared/components/group-member-selector/utils/indent-utils";

interface AccountWithGroupsNodeProps {
  account: AccountWithGroupsResponse;
  isSelected: boolean;
  depth: number;
  position: NodePosition;
  ancestorsHasNext: boolean[];
  onSelect: () => void;
  isSingleRoot?: boolean;
  isOnlyChild?: boolean;
  hasParentRow?: boolean;
}

function formatGroupsDisplay(groups: string[]): {
  displayText: string;
  hasMore: boolean;
} {
  if (groups.length === 0) {
    return { displayText: "", hasMore: false };
  }

  if (groups.length <= 2) {
    return { displayText: groups.join(", "), hasMore: false };
  }

  const visibleGroups = groups.slice(0, 2).join(", ");
  const remainingCount = groups.length - 2;
  return {
    displayText: `${visibleGroups} 외 ${remainingCount}개`,
    hasMore: true,
  };
}

export function AccountWithGroupsNode({
  account,
  isSelected,
  depth,
  position,
  ancestorsHasNext,
  onSelect,
  isSingleRoot = false,
  isOnlyChild = false,
  hasParentRow = false,
}: AccountWithGroupsNodeProps) {
  const ancestorIndents = renderAncestorIndents({
    ancestorsHasNext,
    isSingleRoot,
    nodeId: account.accountId,
  });

  const currentLevelChildren = renderCurrentLevelIndent({
    depth,
    position,
    isOnlyChild,
    hasParentRow,
    isSingleRoot,
  });

  const { displayText, hasMore } = formatGroupsDisplay(account.group);
  const hasGroups = account.group.length > 0;

  const accountButton = (
    <AccountButton
      type="button"
      onClick={onSelect}
      aria-pressed={isSelected}
      className={isSelected ? "active" : ""}
    >
      <IconWrapper>
        <Icon name="Person" color="#5F6368" size={16} />
      </IconWrapper>
      <AccountInfo>
        <AccountName>{account.accountName}</AccountName>
        {hasGroups && <GroupsText>({displayText})</GroupsText>}
      </AccountInfo>
    </AccountButton>
  );

  return (
    <TreeContainer>
      {ancestorIndents}
      <Indent key={`current-level-${account.accountId}-${depth}`}>
        {currentLevelChildren}
      </Indent>

      {hasMore ? (
        <Tooltip title={account.group.join(", ")} placement="top">
          {accountButton}
        </Tooltip>
      ) : (
        accountButton
      )}
    </TreeContainer>
  );
}

const AccountButton = styled.button`
  color: #000;
  font-size: 12px;
  line-height: 24px;
  font-weight: 400;
  flex: 1;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-radius: 2px;
  padding: 0px 3px;

  &:hover {
    background: rgba(0, 0, 0, 0.04);
  }

  &.active {
    background: #eef4ff;
    font-weight: 600;
  }
`;

const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  transition: all 0.3s;
`;

const AccountInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  overflow: hidden;
  white-space: nowrap;
`;

const AccountName = styled.span`
  flex-shrink: 0;
`;

const GroupsText = styled.span`
  color: #8c8c8c;
  overflow: hidden;
  text-overflow: ellipsis;
`;
