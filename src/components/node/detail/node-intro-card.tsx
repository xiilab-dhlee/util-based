"use client";

import { useParams } from "next/navigation";
import styled from "styled-components";
import { Icon, Label } from "xiilab-ui";

import { useGetNode } from "@/hooks/node/use-get-node";
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
import { isNodeRunning } from "@/utils/node/node.util";

/**
 * NodeIntroCard 컴포넌트
 *
 * 노드 상세 페이지의 소개 카드를 표시하는 컴포넌트입니다.
 * URL 파라미터에서 노드 이름을 가져와 해당 노드의 정보를 조회하고,
 * 노드의 실행 상태와 상세 정보를 카드 형태로 표시합니다.
 *
 * @returns 노드 소개 정보를 표시하는 카드 컴포넌트
 */
export function NodeIntroCard() {
  // URL 파라미터에서 노드 이름 추출
  const { name } = useParams();

  // 노드 정보 조회
  const { data } = useGetNode(String(name));

  // 노드 실행 상태 확인
  let isRunning = false;
  if (data?.nodeCondition) {
    isRunning = isNodeRunning(data.nodeCondition);
  }

  return (
    <DetailIntroCardContainer>
      {/* 헤더 영역: 노드 상세 페이지 제목 */}
      <DetailIntroCardHeader>
        {/* 노드 상세 페이지 제목 표시 영역 */}
        <DetailIntroCardTitle>
          <span>노드 자원 상세정보 · 리소스 정보</span>
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
              {name}
              {/* 노드가 실행 중일 때 상태 라벨 표시 */}
              {isRunning && (
                <StatusLabel variant="green" size="large" theme="light">
                  실행중
                </StatusLabel>
              )}
            </DetailIntroCardRowTitle>
          </DetailIntroCardDescriptionRowBody>
          <DetailIntroCardDescription>
            선택한 노드의 상세, 리소스 구성, 로그를 확인할 수 있는 페이지
            입니다.
          </DetailIntroCardDescription>
        </DetailIntroCardRow>
        {/* 노드 상세 정보 설명 섹션 */}
        <DetailIntroCardDescriptionRow>
          <DetailIntroCardDescriptionRowBody>
            <DetailIntroCardRowIconWrapper>
              <Icon name="Description" color="var(--icon-fill)" size={20} />
            </DetailIntroCardRowIconWrapper>
            <DetailIntroCardRowTitle>
              노드 자원 상세정보 · 리소스 정보
            </DetailIntroCardRowTitle>
          </DetailIntroCardDescriptionRowBody>
          <DetailIntroCardDescription>
            노드의 전원 작동과 노드 내 Server, Node information 등 다양한 정보를
            확인하는 페이지 입니다.
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
