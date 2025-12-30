"use client";

import styled from "styled-components";
import { Card, Icon, Tag } from "xiilab-ui";

import { getSourcecodeTypeInfo } from "@/domain/sourcecode/utils/sourcecode.util";
import type { WorkloadSourcecodeType } from "@/domain/workload/schemas/workload.schema";
import { WORKLOAD_SELECTOR } from "@/shared/constants/selector.constant";
import {
  LikeCompactCardKey,
  LikeCompactCardRecord,
  LikeCompactCardValue,
} from "@/styles/layers/like-card-layers.styled";

interface WorkloadSourcecodeCardProps extends WorkloadSourcecodeType {
  onDelete?: () => void;
}

/**
 * 소스 코드 카드 컴포넌트
 */
export function WorkloadSourcecodeCard({
  status,
  name,
  path,
  url,
  type,
  onDelete,
}: WorkloadSourcecodeCardProps) {
  const { text, tag } = getSourcecodeTypeInfo(type);

  return (
    <CardWrapper data-testid={WORKLOAD_SELECTOR.SOURCECODE_CARD}>
      <Card
        contentVariant="compact"
        title={name}
        icon={status === "PRIVATE" ? <Icon name="Lock" /> : undefined}
        actionElement={
          onDelete ? (
            <IconWrapper onClick={onDelete}>
              <Icon name="Close" size={16} color="#484848" />
              <span className="sr-only">워크로드 소스코드 삭제</span>
            </IconWrapper>
          ) : undefined
        }
      >
        <Body>
          <LikeCompactCardRecord>
            <LikeCompactCardKey>Git URL :</LikeCompactCardKey>
            <LikeCompactCardValue
              className="truncate"
              data-testid={WORKLOAD_SELECTOR.SOURCECODE_URL}
            >
              {url}
            </LikeCompactCardValue>
          </LikeCompactCardRecord>
          <LikeCompactCardRecord>
            <LikeCompactCardKey>경로 :</LikeCompactCardKey>
            <LikeCompactCardValue
              className="truncate"
              data-testid={WORKLOAD_SELECTOR.SOURCECODE_PATH}
            >
              {path}
            </LikeCompactCardValue>
          </LikeCompactCardRecord>
          <LikeCompactCardRecord>
            <LikeCompactCardKey>타입 :</LikeCompactCardKey>
            <LikeCompactCardValue
              data-testid={WORKLOAD_SELECTOR.sourcecodeType(type)}
            >
              <Tag variant={tag}>{text}</Tag>
            </LikeCompactCardValue>
          </LikeCompactCardRecord>
        </Body>
      </Card>
    </CardWrapper>
  );
}

const CardWrapper = styled.div``;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 8px;
`;

const IconWrapper = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 26px;
  height: 26px;
  background: #FAFAFA;
  border-radius: 2px;
  border: 1px solid #CED2D6;
`;
