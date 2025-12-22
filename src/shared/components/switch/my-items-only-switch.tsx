"use client";

import styled from "styled-components";
import { Switch } from "xiilab-ui";

import { SELECTOR } from "@/shared/constants/selector.constant";

interface MyItemsOnlySwitchProps {
  /** 스위치 체크 상태 */
  checked: boolean;
  /** 스위치 상태 변경 핸들러 */
  onChange?: (checked: boolean) => void;
  /** 비활성화 상태 */
  disabled?: boolean;
}

/**
 * "내 항목만 보기" 스위치 컴포넌트
 *
 * 목록 필터에서 내 항목만 필터링할 때 사용하는 공통 스위치 컴포넌트입니다.
 *
 * @example
 * <MyItemsOnlySwitch
 *   checked={showMyItemsOnly}
 *   onChange={setShowMyItemsOnly}
 * />
 */
export function MyItemsOnlySwitch({
  checked,
  onChange,
  disabled,
}: MyItemsOnlySwitchProps) {
  return (
    <Container>
      <SwitchLabel>내 항목만 보기</SwitchLabel>
      <Switch
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        data-testid={SELECTOR.MY_ITEMS_ONLY_SWITCH}
      />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SwitchLabel = styled.span`
  padding-left: 0;
  line-height: 16px;
  font-weight: 400;
  font-size: 12px;
  color: #333;
`;
