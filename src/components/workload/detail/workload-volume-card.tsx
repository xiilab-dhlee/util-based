"use client";
import type { PropsWithChildren } from "react";
import styled from "styled-components";
import { Tag } from "xiilab-ui";

import { MyIcon } from "@/components/common/icons";
import type { WorkloadVolumeType } from "@/schemas/workload.schema";
import {
  LikeCompactCardBody,
  LikeCompactCardContainer,
  LikeCompactCardHeader,
  LikeCompactCardKey,
  LikeCompactCardRecord,
  LikeCompactCardTitle,
  LikeCompactCardValue,
} from "@/styles/layers/like-card-layers.styled";

interface WorkloadVolumeCardProps extends WorkloadVolumeType {}

export function WorkloadVolumeCard({
  title,
  storage,
  path,
  volumeSize,
  labels,
}: PropsWithChildren<WorkloadVolumeCardProps>) {
  return (
    <Container>
      <Header>
        <IconWrapper>
          <MyIcon name="astrago" />
        </IconWrapper>
        <LikeCompactCardTitle className="truncate">
          {title}
        </LikeCompactCardTitle>
      </Header>
      <Body>
        <BodyContent>
          <LikeCompactCardRecord>
            <LikeCompactCardKey>스토리지 :</LikeCompactCardKey>
            <LikeCompactCardValue className="truncate">
              {storage}
            </LikeCompactCardValue>
          </LikeCompactCardRecord>
          <LikeCompactCardRecord>
            <LikeCompactCardKey>경로 :</LikeCompactCardKey>
            <LikeCompactCardValue className="truncate">
              {path}
            </LikeCompactCardValue>
          </LikeCompactCardRecord>
          <LikeCompactCardRecord>
            <LikeCompactCardKey>볼륨 크기 :</LikeCompactCardKey>
            <LikeCompactCardValue>{volumeSize} Bytes</LikeCompactCardValue>
          </LikeCompactCardRecord>
        </BodyContent>
        <BodyFooter>
          <Labels>
            {labels.map((label) => (
              <Tag key={label} variant="purple">
                {label}
              </Tag>
            ))}
          </Labels>
        </BodyFooter>
      </Body>
    </Container>
  );
}

const Container = styled(LikeCompactCardContainer)`
  & + & {
    margin-top: 10px;
  }
`;

const Header = styled(LikeCompactCardHeader)`
  gap: 5px;
`;

const Body = styled(LikeCompactCardBody)`
  padding: 10px;
`;

const BodyContent = styled.div`
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid #e9ebee;
  padding-bottom: 8px;
  margin-bottom: 8px;
  gap: 6px;
`;

const BodyFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Labels = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
  width: 100%;
  flex-wrap: wrap;
  gap: 4px;
`;

const IconWrapper = styled.div`
  width: 18px;
  height: 18px;
  display: flex;
  justify-content: center;
  align-items: center;

  --icon-fill: #5b29c7;
`;
