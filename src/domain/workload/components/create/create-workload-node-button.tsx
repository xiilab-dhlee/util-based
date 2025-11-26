"use client";

import classNames from "classnames";
import { useAtom } from "jotai";
import styled from "styled-components";
import { Icon, Tooltip, Typography } from "xiilab-ui";

import { nodeModeAtom } from "@/domain/workload/state/create-workload.atom";
import { MultiNodeTooltipTitle } from "@/shared/components/tooltip-title/multi-node-tooltip-title";
import { SingleNodeTooltipTitle } from "@/shared/components/tooltip-title/single-node-tooltip-title";

interface CreateWorkloadNodeButtonProps {
  type: "single" | "multi";
  disabled?: boolean;
}

export function CreateWorkloadNodeButton({
  type,
  disabled = false,
}: CreateWorkloadNodeButtonProps) {
  const [nodeMode, setNodeMode] = useAtom(nodeModeAtom);

  const handleClick = () => {
    setNodeMode(type);
  };

  let buttonText = "";
  let tooltipTitle = null;
  let iconName = "";
  if (type === "single") {
    buttonText = "Single Node";
    tooltipTitle = <SingleNodeTooltipTitle />;
    iconName = "SingleNode";
  } else if (type === "multi") {
    buttonText = "Multi Node";
    tooltipTitle = <MultiNodeTooltipTitle />;
    iconName = "MultiNode";
  }

  return (
    <Container
      type="button"
      className={classNames({
        active: nodeMode === type,
      })}
      onClick={handleClick}
      disabled={disabled}
    >
      <ButtonContent>
        <Icon name={iconName} size={20} color="var(--icon-fill)" />
        <Typography.Text variant={nodeMode === type ? "body-2-2" : "body-2-3"}>
          {buttonText}
        </Typography.Text>
        <Tooltip title={tooltipTitle}>
          <IconWrapper>
            <Icon name="Tooltip" size={16} color="#5F6368" />
          </IconWrapper>
        </Tooltip>
      </ButtonContent>
    </Container>
  );
}

const Container = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 7px 12px;
  border-radius: 2px;
  border: 1px solid #B9BEC3;
  background-color: #FAFAFA;
  cursor: pointer;
  flex: 1;
  height: 34px;
  color: #000;

  --icon-fill: #404040;

  &:not(:disabled).active {
    background-color: rgba(54, 107, 255, 0.1);
    border-color: #3D3FDF;
    color: #00144B;
    outline: 1px solid rgba(54, 107, 255, 0.1);
    --icon-fill: #154FED;
  }


  &:not(:disabled):hover {
    border-color: #3d3fdf;
  }

  &:disabled {
    background-color: var(--color-gray-11);
    border-color: var(--color-gray-09);
    cursor: not-allowed;
  }
`;

const ButtonContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  position: relative;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: help;
`;
