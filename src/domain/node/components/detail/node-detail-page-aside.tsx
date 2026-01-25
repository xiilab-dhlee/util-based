"use client";

import styled from "styled-components";
import { Card } from "xiilab-ui";

import type { ClusterNodeDetailResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { NodeConditionCard } from "@/domain/node/components/detail/node-condition-card";
import { NodeInfoPanel } from "@/domain/node/components/detail/node-info-panel";
import { EmptyState } from "@/shared/components/empty-state/empty-state";
import { AsideFillCard } from "@/shared/components/layouts/aside-fill-card";
import { DetailPageAside } from "@/styles/layers/detail-page-layers.styled";

const SKELETON_COUNT = 4;
const SKELETON_HEIGHT = 141;

interface NodeDetailPageAsideProps {
  data?: ClusterNodeDetailResponse;
  isLoading?: boolean;
  isError?: boolean;
}

/**
 * NodeDetailPageAside 컴포넌트
 *
 * 노드 상세 페이지의 사이드바 영역을 구성하는 컴포넌트입니다.
 * 노드의 기본 정보를 표시하는 NodeInfoPanel과 노드 상태 정보를 표시하는
 * Conditions 카드를 포함합니다.
 *
 * @param data - 노드 상세 정보
 * @param isLoading - 로딩 상태
 * @param isError - 에러 상태
 * @returns 노드 상세 페이지의 사이드바 컴포넌트
 */
export function NodeDetailPageAside({
  data,
  isLoading,
  isError,
}: NodeDetailPageAsideProps) {
  /**
   * Conditions 카드 내용 렌더링
   */
  const renderConditions = () => {
    if (isLoading) {
      return (
        <CardWrapper>
          {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
            <Card key={index} height={SKELETON_HEIGHT} loading />
          ))}
        </CardWrapper>
      );
    }

    if (isError) {
      return (
        <StateWrapper>
          <EmptyState
            title="상태 정보를 불러올 수 없습니다"
            content="잠시 후 다시 시도해 주세요."
          />
        </StateWrapper>
      );
    }

    if (!data?.nodeCondition || data.nodeCondition.length === 0) {
      return (
        <StateWrapper>
          <EmptyState title="상태 정보가 없습니다" />
        </StateWrapper>
      );
    }

    return (
      <CardWrapper>
        {data.nodeCondition.map((condition) => (
          <NodeConditionCard key={condition.conditionName} {...condition} />
        ))}
      </CardWrapper>
    );
  };

  return (
    <DetailPageAside>
      {/* 노드의 기본 정보를 표시하는 패널 */}
      <NodeInfoPanel data={data} />
      {/* 노드 상태 정보 */}
      <AsideFillCard title="Conditions">{renderConditions()}</AsideFillCard>
    </DetailPageAside>
  );
}

const CardWrapper = styled.div`
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StateWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;
