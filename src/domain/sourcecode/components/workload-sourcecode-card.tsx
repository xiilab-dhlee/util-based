"use client";

import styled from "styled-components";
import { Card, Icon, Tag, type TagProps } from "xiilab-ui";

import type { WorkloadSourcecodeType } from "@/domain/workload/schemas/workload.schema";
import {
  LikeCompactCardKey,
  LikeCompactCardRecord,
  LikeCompactCardValue,
} from "@/styles/layers/like-card-layers.styled";
import { getSourcecodeTypeInfo } from "../utils/sourcecode.util";

/**
 * 소스 코드 카드 컴포넌트의 props 인터페이스
 */
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
    <Card
      contentVariant="compact"
      title={name}
      icon={status === "PRIVATE" ? <Icon name="Lock" /> : undefined}
      actionElement={
        onDelete ? (
          <IconWrapper onClick={onDelete}>
            <Icon name="Close" size={16} color="#484848" />
          </IconWrapper>
        ) : undefined
      }
    >
      <Body>
        <LikeCompactCardRecord>
          <LikeCompactCardKey>Git URL :</LikeCompactCardKey>
          <LikeCompactCardValue className="truncate">
            {url}
          </LikeCompactCardValue>
        </LikeCompactCardRecord>
        <LikeCompactCardRecord>
          <LikeCompactCardKey>경로 :</LikeCompactCardKey>
          <LikeCompactCardValue className="truncate">
            {path || "-"}
          </LikeCompactCardValue>
        </LikeCompactCardRecord>
        <LikeCompactCardRecord>
          <LikeCompactCardKey>타입 :</LikeCompactCardKey>
          <LikeCompactCardValue>
            <Tag variant={tag as TagProps["variant"]} style={{ height: 20 }}>
              {text}
            </Tag>
          </LikeCompactCardValue>
        </LikeCompactCardRecord>
      </Body>
    </Card>
  );
}

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
