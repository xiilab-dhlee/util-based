import styled from "styled-components";
import { Icon } from "xiilab-ui";

import type { GroupMemberResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  Indent,
  TreeContainer,
} from "@/shared/components/group-member-selector/utils/indent-styles";
import {
  renderAncestorIndents,
  renderCurrentLevelIndent,
} from "@/shared/components/group-member-selector/utils/indent-utils";
import type { NodePosition } from "../types";

interface AccountNodeLazyProps {
  account: GroupMemberResponse;
  isSelected: boolean;
  depth: number;
  position: NodePosition;
  ancestorsHasNext: boolean[];
  onSelect: () => void;
  isSingleRoot?: boolean;
  isOnlyChild?: boolean;
  hasParentRow?: boolean;
}

export function AccountNodeLazy({
  account,
  isSelected,
  depth,
  position,
  ancestorsHasNext,
  onSelect,
  isSingleRoot = false,
  isOnlyChild = false,
  hasParentRow = false,
}: AccountNodeLazyProps) {
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

  return (
    <TreeContainer>
      {ancestorIndents}
      <Indent key={`current-level-${account.accountId}-${depth}`}>
        {currentLevelChildren}
      </Indent>

      <AccountButton
        type="button"
        onClick={onSelect}
        aria-pressed={isSelected}
        className={isSelected ? "active" : ""}
      >
        <IconWrapper>
          <Icon name="Person" color="#5F6368" size={16} />
        </IconWrapper>
        {account.accountName}
      </AccountButton>
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
  white-space: nowrap;
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
  transition: all 0.3s;

`;
