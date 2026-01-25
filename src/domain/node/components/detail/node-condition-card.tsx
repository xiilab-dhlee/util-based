"use client";

import styled from "styled-components";
import { Card, Label } from "xiilab-ui";

import type { NodeConditionResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { CompactCardCollapseRow } from "@/shared/components/card/compact-card-collapse-row";
import {
  CompactCardKey,
  CompactCardKeyValueRow,
  CompactCardValue,
} from "@/shared/components/card/compact-card-layer.styled";
import { formatDateSafely } from "@/shared/utils/date.util";

/**
 * NodeConditionCard 컴포넌트의 Props 인터페이스
 */
type NodeConditionCardProps = NodeConditionResponse;

/**
 * 노드 상태 타입에 따른 Label 색상을 결정하는 함수
 * - Ready 상태: True일 때 정상 (green)
 * - MemoryPressure, DiskPressure, PIDPressure 등: False일 때 정상 (green)
 *
 * @param conditionName - 노드 상태 타입
 * @param status - 상태값 (True/False)
 * @returns Label variant (green 또는 red)
 */
function getConditionVariant(
  conditionName: string,
  status: string,
): "green" | "red" {
  const isHealthyWhenTrue = conditionName === "Ready";
  const isHealthy = isHealthyWhenTrue ? status === "True" : status === "False";
  return isHealthy ? "green" : "red";
}

/**
 * NodeConditionCard 컴포넌트
 *
 * 노드의 상태 정보를 카드 형태로 표시하는 컴포넌트입니다.
 * 노드의 상태 타입, 상태값, 이유, 메시지, 마지막 하트비트 시간을 표시합니다.
 *
 * @param conditionName - 노드 상태의 타입 (예: Ready, MemoryPressure, DiskPressure 등)
 * @param status - 노드 상태값 (True/False)
 * @param reason - 상태가 발생한 이유
 * @param message - 상태에 대한 상세 메시지
 * @param lastHeartbeatTime - 마지막 하트비트 시간
 *
 * @returns 노드 상태 정보를 표시하는 카드 컴포넌트
 */
export function NodeConditionCard({
  conditionName,
  status,
  reason,
  message,
  lastHeartbeatTime,
}: NodeConditionCardProps) {
  return (
    <Card
      contentVariant="compact"
      actionElement={
        <Label
          size="medium"
          theme="light"
          variant={getConditionVariant(conditionName, status)}
        >
          {status}
        </Label>
      }
      title={conditionName}
    >
      <Body>
        <CompactCardKeyValueRow>
          <CompactCardKey>Reason :</CompactCardKey>
          <CompactCardValue>{reason || "-"}</CompactCardValue>
        </CompactCardKeyValueRow>
        <CompactCardKeyValueRow>
          <CompactCardKey>L.H.B.T :</CompactCardKey>
          <CompactCardValue>
            {formatDateSafely(lastHeartbeatTime)}
          </CompactCardValue>
        </CompactCardKeyValueRow>
      </Body>
      {/* 노드 상태의 상세 메시지를 접을 수 있는 형태로 표시하는 영역 */}
      <Footer>
        <CompactCardCollapseRow title="메 세 지" description={message || "-"} />
      </Footer>
    </Card>
  );
}

/**
 * 노드 상태 카드의 본문 영역 스타일
 * 상태의 기본 정보(이유, 마지막 하트비트 시간)를 표시하는 영역입니다.
 */
const Body = styled.div`
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid #e9ebee;
  padding-bottom: 6px;
  margin-bottom: 4px;
  width: 100%;
`;

/**
 * 노드 상태 카드의 푸터 영역 스타일
 * 상태의 상세 메시지를 접을 수 있는 형태로 표시하는 영역입니다.
 */
const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 2px;
  width: 100%;
`;
