"use client";

import classNames from "classnames";
import { useState } from "react";
import styled from "styled-components";

import { MyIcon } from "../icon";
import { CompactCardKey, CompactCardValue } from "./compact-card-layer.styled";

interface CompactCardCollapseKeyValueProps {
  title: string;
  description: string;
}

export function CompactCardCollapseRow({
  title,
  description,
}: CompactCardCollapseKeyValueProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Container type="button" onClick={() => setIsOpen(!isOpen)}>
      <Key>{title}</Key>
      <Description
        className={classNames({
          truncate: !isOpen,
        })}
        $isOpen={isOpen}
      >
        {description}
      </Description>
      <IconWrapper
        className={classNames({
          active: isOpen,
        })}
      >
        <MyIcon name="Dropdown" size={20} color="#404040" />
        <span className="sr-only">
          {isOpen ? "메시지 접기" : "메시지 펼치기"}
        </span>
      </IconWrapper>
    </Container>
  );
}

const Container = styled.button`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
`;

const Key = styled(CompactCardKey)`
  width: 48px;
  position: relative;
  line-height: 20px;
  text-align: left;
  padding-top: 1px;

  &::after {
    position: absolute;
    content: ":";
    line-height: 12px;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
  }
`;

const Description = styled(CompactCardValue)<{ $isOpen: boolean }>`
  color: #707070;
  text-align: left;
  max-height: ${({ $isOpen }) => ($isOpen ? "500px" : "20px")};
  transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding-top: 3px;
  overflow-wrap: break-word;
`;

const IconWrapper = styled.span`
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 10px;

  --icon-fill: #404040;

  &.active {
    transform: rotate(180deg);
  }

  & svg {
    width: 14px;
    height: 14px;
  }
`;
