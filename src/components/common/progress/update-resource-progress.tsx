"use client";

import type { InputNumberProps } from "antd";
import { Slider } from "antd";
import type { Dispatch, SetStateAction } from "react";
import styled, { css } from "styled-components";
import { Icon, InputNumber } from "xiilab-ui";

interface UpdateResourceProgressProps {
  min: number;
  max: number;
  value: number;
  setValue: Dispatch<SetStateAction<number>>;
  resourceColor: string;
  disabled?: boolean;
}

export function UpdateResourceProgress({
  min,
  max,
  value,
  setValue,
  resourceColor,
  disabled = false,
}: UpdateResourceProgressProps) {
  const onChange: InputNumberProps["onChange"] = (newValue) => {
    setValue(newValue as number);
  };

  const handleMinus = () => {
    setValue((prev) => Math.max(prev - 1, min));
  };

  const handlePlus = () => {
    setValue((prev) => Math.min(prev + 1, max));
  };

  return (
    <Container>
      <Body>
        {!disabled && (
          <IconWrapper onClick={handleMinus}>
            <Icon name="Minus" color="#404040" size={16} />
          </IconWrapper>
        )}
        <SliderWrapper $disabled={disabled}>
          <Slider
            min={2}
            max={max}
            onChange={onChange}
            value={value}
            style={{
              margin: "0",
              width: "100%",
            }}
            trackStyle={{
              background: resourceColor,
            }}
            disabled={disabled}
          />
          <Total>{max}</Total>
        </SliderWrapper>
        {!disabled && (
          <IconWrapper onClick={handlePlus}>
            <Icon name="Plus" color="#404040" size={16} />
          </IconWrapper>
        )}
      </Body>
      <InputNumber height="36px" value={value} readOnly />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 6px;
`;

const Body = styled.div`
  flex: 1;
  padding: 9px 0;
  border: 1px solid #eeeeee;
  background-color: #fafafa;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 2px;
`;

const IconWrapper = styled.button`
  width: 16px;
  height: 16px;
  margin: 0 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;

  --icon-fill: #404040;

  &:hover {
    background-color: #f0f0f0;
    border-radius: 50%;

    --icon-fill: #1890ff;
  }

  &:active {
    background-color: #e6f7ff;
    transform: scale(0.95);
  }
`;

const SliderWrapper = styled.div<{ $disabled: boolean }>`
  flex: 1;
  padding: 0 7px;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  ${({ $disabled }) =>
    !$disabled &&
    css`
      border-left: 1px solid #e9e9e9;
      border-right: 1px solid #e9e9e9;
    `}
`;

const Total = styled.div`
  font-weight: 400;
  font-size: 11px;
  line-height: 13px;
  text-align: center;
  color: #555555;
  margin-left: 6px;
`;
