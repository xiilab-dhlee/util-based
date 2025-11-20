"use client";

import styled from "styled-components";
import { Tag } from "xiilab-ui";

import type { WorkloadSourcecodeType } from "@/domain/workload/schemas/workload.schema";
import {
  LikeCompactCardBody,
  LikeCompactCardContainer,
  LikeCompactCardHeader,
  LikeCompactCardKey,
  LikeCompactCardRecord,
  LikeCompactCardTitle,
  LikeCompactCardValue,
} from "@/styles/layers/like-card-layers.styled";

/**
 * 소스 코드 카드 컴포넌트의 props 인터페이스
 */
interface WorkloadSourcecodeCardProps extends WorkloadSourcecodeType {}

/**
 * 소스 코드 카드 컴포넌트
 */
export function WorkloadSourcecodeCard({
  title,
  path,
}: WorkloadSourcecodeCardProps) {
  return (
    <Container>
      <LikeCompactCardHeader>
        <LikeCompactCardTitle className="truncate">
          {title}
        </LikeCompactCardTitle>
      </LikeCompactCardHeader>
      <Body>
        <BodyContent>
          <LikeCompactCardRecord>
            <LikeCompactCardKey>경로 :</LikeCompactCardKey>
            <LikeCompactCardValue className="truncate">
              {path}
            </LikeCompactCardValue>
            <Type>
              <LikeCompactCardKey>타입 :</LikeCompactCardKey>
              <Tag variant="yellow" style={{ height: 20 }}>
                Github
              </Tag>
            </Type>
          </LikeCompactCardRecord>
        </BodyContent>
      </Body>
    </Container>
  );
}

const Container = styled(LikeCompactCardContainer)`
  & + & {
    margin-top: 10px;
  }
`;

const Body = styled(LikeCompactCardBody)`
  border: 1px solid #e9ebee;
  border-radius: 4px;
  background-color: #fff;
  width: 100%;
  overflow: hidden;
  padding: 10px;
`;

const BodyContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const Type = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 4px;
`;
