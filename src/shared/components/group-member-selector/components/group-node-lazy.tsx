import { Spin } from "antd";
import classNames from "classnames";
import styled from "styled-components";
import { Icon } from "xiilab-ui";

import type { GroupSummaryResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  Indent,
  TreeContainer,
} from "@/shared/components/group-member-selector/utils/indent-styles";
import {
  renderAncestorIndents,
  renderCurrentLevelIndent,
} from "@/shared/components/group-member-selector/utils/indent-utils";
import type { NodePosition } from "../types";

interface GroupNodeLazyProps {
  group: GroupSummaryResponse;
  isExpanded: boolean;
  isLoading: boolean;
  isSelected: boolean;
  depth: number;
  position: NodePosition;
  ancestorsHasNext: boolean[];
  onToggle: () => void;
  onSelect: () => void;
  isSingleRoot?: boolean;
  isOnlyChild?: boolean;
  hasParentRow?: boolean;
}

export function GroupNodeLazy({
  group,
  isExpanded,
  isLoading,
  isSelected,
  depth,
  position,
  ancestorsHasNext,
  onToggle,
  onSelect,
  isSingleRoot = false,
  isOnlyChild = false,
  hasParentRow = false,
}: GroupNodeLazyProps) {
  const ancestorIndents = renderAncestorIndents({
    ancestorsHasNext,
    isSingleRoot,
    nodeId: group.groupId,
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
      <Indent key={`current-level-${group.groupId}-${depth}`}>
        {currentLevelChildren}
      </Indent>

      <ExpandButton
        type="button"
        onClick={onToggle}
        disabled={isLoading}
        aria-expanded={isExpanded}
        className={classNames({ rotated: isExpanded })}
      >
        {isLoading ? (
          <Spin size="small" />
        ) : (
          <Icon name="CaretDown" color="var(--icon-fill)" size={16} />
        )}
      </ExpandButton>

      <GroupButton
        type="button"
        onClick={onSelect}
        className={classNames({ active: isSelected })}
      >
        {group.groupName}
      </GroupButton>
    </TreeContainer>
  );
}

const ExpandButton = styled.button`
  width: var(--tree-indent-size);
  height: var(--tree-indent-size);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.3s;
  flex-shrink: 0;

  --icon-fill: #9da6bc;

  &:hover:not(:disabled) {
    --icon-fill: #000;
  }

  &.rotated {
    transform: rotate(180deg);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const GroupButton = styled.button`
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
