"use client";

import styled from "styled-components";
import { Card, Icon, Tag } from "xiilab-ui";

import type { WorkloadSourceCodeDetail } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { getSourcecodeTypeInfo } from "@/domain/sourcecode/utils/sourcecode.util";
import { WORKLOAD_SELECTOR } from "@/shared/constants/selector.constant";
import {
  LikeCompactCardKey,
  LikeCompactCardRecord,
  LikeCompactCardValue,
} from "@/styles/layers/like-card-layers.styled";

interface WorkloadSourcecodeCardProps
  extends Pick<
    WorkloadSourceCodeDetail,
    | "sourceCodeId"
    | "sourceCodeName"
    | "gitUrl"
    | "mountPath"
    | "sourceCodeType"
  > {
  onDelete?: () => void;
}

/**
 * 소스 코드 카드 컴포넌트
 */
/**
 * 워크로드 소스코드 카드 컴포넌트
 *
 * 워크로드에 연결된 소스코드 정보를 표시합니다.
 */
export function WorkloadSourcecodeCard({
  sourceCodeName,
  mountPath,
  gitUrl,
  sourceCodeType,
  onDelete,
}: WorkloadSourcecodeCardProps) {
  const { text, tag } = getSourcecodeTypeInfo(sourceCodeType);

  return (
    <CardWrapper data-testid={WORKLOAD_SELECTOR.SOURCECODE_CARD}>
      <Card
        contentVariant="compact"
        title={sourceCodeName}
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
              {gitUrl}
            </LikeCompactCardValue>
          </LikeCompactCardRecord>
          <LikeCompactCardRecord>
            <LikeCompactCardKey>경로 :</LikeCompactCardKey>
            <LikeCompactCardValue
              className="truncate"
              data-testid={WORKLOAD_SELECTOR.SOURCECODE_PATH}
            >
              {mountPath}
            </LikeCompactCardValue>
          </LikeCompactCardRecord>
          <LikeCompactCardRecord>
            <LikeCompactCardKey>타입 :</LikeCompactCardKey>
            <LikeCompactCardValue
              data-testid={WORKLOAD_SELECTOR.sourcecodeType(sourceCodeType)}
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
