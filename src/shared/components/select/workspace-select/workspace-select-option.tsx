import classNames from "classnames";
import styled from "styled-components";
import { Icon } from "xiilab-ui";

import type { WorkspaceResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";

interface WorkspaceSelectOptionProps {
  workspace: WorkspaceResponse;
  isSelected: boolean;
  onSelect: (workspace: WorkspaceResponse) => void;
  onPinToggle: (e: React.MouseEvent, workspace: WorkspaceResponse) => void;
}

export function WorkspaceSelectOption({
  workspace,
  isSelected,
  onSelect,
  onPinToggle,
}: WorkspaceSelectOptionProps) {
  return (
    <Option
      className={classNames({ active: isSelected })}
      onClick={() => onSelect(workspace)}
    >
      <OptionContent>
        {workspace.isDefault && <Badge>Default</Badge>}
        <span>{workspace.workspaceName}</span>
      </OptionContent>
      <PinIconWrapper onClick={(e) => onPinToggle(e, workspace)}>
        <Icon
          name={workspace.isPinned ? "PinFilled" : "Pin"}
          size={18}
          color="#fff"
        />
      </PinIconWrapper>
    </Option>
  );
}

const Option = styled.div`
  width: 100%;
  height: 30px;
  color: #f5f5f5;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 4px 8px 10px;
  border-radius: 2px;
  cursor: pointer;

  &:hover,
  &.active {
    background-color: #544ad8;
  }

  &.active {
    font-weight: 600;
  }
`;

const Badge = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 4px 7px;
  background-color: #1c325e;
  border-radius: 2px;
  font-weight: 500;
  color: #f5f5f5;
  margin-right: 4px;
`;

const OptionContent = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  overflow: hidden;

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const PinIconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
`;
