"use client";

import styled from "styled-components";
import { Icon, Label } from "xiilab-ui";

import type { ClusterNodeDetailResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { isNodeRunning } from "@/domain/node/utils/node.util";
import {
  DetailIntroCardBody,
  DetailIntroCardContainer,
  DetailIntroCardDescription,
  DetailIntroCardDescriptionRow,
  DetailIntroCardDescriptionRowBody,
  DetailIntroCardHeader,
  DetailIntroCardRow,
  DetailIntroCardRowIconWrapper,
  DetailIntroCardRowTitle,
  DetailIntroCardTitle,
} from "@/styles/layers/detail-page-intro-card.styled";

interface NodeInfoPanelProps {
  data?: ClusterNodeDetailResponse;
}

/**
 * NodeInfoPanel 컴포넌트
 *
 * 노드 상세 페이지의 정보 패널을 표시하는 컴포넌트입니다.
 * 부모 컴포넌트로부터 노드 데이터를 전달받아 노드의 실행 상태와
 * 상세 정보를 패널 형태로 표시합니다.
 *
 * @param data - 노드 상세 정보
 * @returns 노드 정보를 표시하는 패널 컴포넌트
 */
export function NodeInfoPanel({ data }: NodeInfoPanelProps) {
  // 노드 실행 상태 확인
  const isRunning = data?.nodeCondition
    ? isNodeRunning(data.nodeCondition)
    : false;

  return (
    <DetailIntroCardContainer>
      {/* 헤더 영역: 노드 상세 페이지 제목 */}
      <DetailIntroCardHeader>
        {/* 노드 상세 페이지 제목 표시 영역 */}
        <DetailIntroCardTitle>
          <span>노드 상세 정보 · 리소스 정보</span>
        </DetailIntroCardTitle>
      </DetailIntroCardHeader>
      <DetailIntroCardBody>
        {/* 노드 기본 정보 섹션 */}
        <DetailIntroCardRow>
          <DetailIntroCardDescriptionRowBody>
            <DetailIntroCardRowIconWrapper>
              <Icon name="SingleNode" color="var(--icon-fill)" size={22} />
            </DetailIntroCardRowIconWrapper>
            <DetailIntroCardRowTitle>
              {data?.nodeName || "-"}
              {/* 노드 실행 상태 라벨 */}
              {data?.nodeCondition && (
                <StatusLabel
                  variant={isRunning ? "green" : "red"}
                  size="large"
                  theme="light"
                >
                  {isRunning ? "실행중" : "중지됨"}
                </StatusLabel>
              )}
            </DetailIntroCardRowTitle>
          </DetailIntroCardDescriptionRowBody>
          <DetailIntroCardDescription>
            선택한 노드의 상세, 리소스 구성을 확인할 수 있는 페이지 입니다.
          </DetailIntroCardDescription>
        </DetailIntroCardRow>
        {/* 노드 상세 정보 설명 섹션 */}
        <DetailIntroCardDescriptionRow>
          <DetailIntroCardDescriptionRowBody>
            <DetailIntroCardRowIconWrapper>
              <Icon name="Description" color="var(--icon-fill)" size={20} />
            </DetailIntroCardRowIconWrapper>
            <DetailIntroCardRowTitle>설명</DetailIntroCardRowTitle>
          </DetailIntroCardDescriptionRowBody>
          <DetailIntroCardDescription>
            노드 내 Server, Node information 등 다양한 정보를 확인하는 페이지
            입니다.
          </DetailIntroCardDescription>
          <DetailIntroCardDescription>
            리소스 정보는 노드에 탑재된 GPU, 리소스 용량 등 시스템 정보를 한눈에
            확인할 수 있는 화면입니다.
          </DetailIntroCardDescription>
        </DetailIntroCardDescriptionRow>
      </DetailIntroCardBody>
    </DetailIntroCardContainer>
  );
}

/**
 * 노드 실행 상태 라벨 스타일
 * 노드가 실행 중일 때 표시되는 상태 라벨의 스타일입니다.
 */
const StatusLabel = styled(Label)`
  margin-left: 8px;
`;
