"use client";

import { usePathname } from "next/navigation";
import styled from "styled-components";
import { Icon, Tag } from "xiilab-ui";

import { WorkloadStatusText } from "@/components/common/text/workload-status-text";
import { WORKLOAD_EVENTS } from "@/constants/common/pubsub.constant";
import { usePublish } from "@/hooks/common/use-pub-sub";
import type { WorkloadDetailType } from "@/schemas/workload.schema";
import {
  DetailIntroCardBody,
  DetailIntroCardContainer,
  DetailIntroCardDescription,
  DetailIntroCardDescriptionRow,
  DetailIntroCardDescriptionRowBody,
  DetailIntroCardHeader,
  DetailIntroCardRow,
  DetailIntroCardRowBody,
  DetailIntroCardRowIconWrapper,
  DetailIntroCardRowTitle,
  DetailIntroCardTitle,
} from "@/styles/layers/detail-page-intro-card.styled";
import { customScrollbar } from "@/styles/mixins/scrollbar";
import { isUserMode } from "@/utils/common/router.util";

/**
 * Props for WorkloadIntroCard component
 */
interface WorkloadIntroCardProps extends WorkloadDetailType {}

/**
 * 워크로드 상세 페이지의 소개 카드 컴포넌트
 *
 */
export function WorkloadIntroCard({
  id,
  workloadName,
  status,
  description,
  labels,
  workspaceId,
}: WorkloadIntroCardProps) {
  // Pub/Sub 시스템을 통한 이벤트 발행 훅
  const publish = usePublish();
  const pathname = usePathname();

  const isStandard = isUserMode(pathname);

  /**
   * 워크로드 수정 모달을 열기 위한 핸들러
   * Pub/Sub 시스템을 통해 워크로드 수정 이벤트를 발행합니다.
   */
  const handleModify = () => {
    publish(WORKLOAD_EVENTS.sendUpdateWorkload, {
      id,
      workspaceId,
      workloadName,
      description,
    });
  };

  /**
   * 워크로드 전원 제어 핸들러
   * 현재는 준비 중 메시지를 표시합니다.
   * TODO: 실제 전원 제어 기능 구현 필요
   */
  const handleClickPower = () => {
    alert("준비 중입니다.");
  };

  return (
    <DetailIntroCardContainer>
      {/* 헤더 영역: 워크로드 이름과 도구 버튼들 */}
      <DetailIntroCardHeader>
        {/* 워크로드 이름 표시 영역 */}
        <DetailIntroCardTitle>
          <span className="truncate">{workloadName}</span>
        </DetailIntroCardTitle>
        {/* 도구 버튼 영역 */}
        <ToolBox>
          {/* 워크로드 수정 버튼 */}
          {isStandard && (
            <IconWrapper onClick={handleModify}>
              <Icon name="Edit02" color="var(--icon-fill)" size={24} />
              <span className="sr-only">워크로드 설명, 라벨 수정</span>
            </IconWrapper>
          )}
          {/* 워크로드 전원 제어 버튼 */}
          <IconWrapper onClick={handleClickPower}>
            <Icon name="Power" color="var(--icon-fill)" size={24} />
            <span className="sr-only">워크로드 전원 On/Off</span>
          </IconWrapper>
        </ToolBox>
      </DetailIntroCardHeader>

      {/* 본문 영역: 워크로드 상세 정보 */}
      <DetailIntroCardBody>
        {/* 워크로드 상태 정보 행 */}
        <DetailIntroCardRow>
          <DetailIntroCardRowBody>
            <DetailIntroCardRowIconWrapper>
              <Icon name="Info" color="var(--icon-fill)" size={24} />
            </DetailIntroCardRowIconWrapper>
            <DetailIntroCardRowTitle>
              <WorkloadStatusTitle>워크로드 상태</WorkloadStatusTitle>
              <WorkloadStatusText status={status} />
            </DetailIntroCardRowTitle>
          </DetailIntroCardRowBody>
        </DetailIntroCardRow>

        {/* 워크로드 설명 정보 행 (확장 가능) */}
        <DetailIntroCardDescriptionRow>
          <DetailIntroCardDescriptionRowBody>
            <DetailIntroCardRowIconWrapper>
              <Icon name="Description" color="var(--icon-fill)" size={22} />
            </DetailIntroCardRowIconWrapper>
            <DetailIntroCardRowTitle>워크로드 설명</DetailIntroCardRowTitle>
          </DetailIntroCardDescriptionRowBody>
          {/* 워크로드 설명 텍스트 (스크롤 가능) */}
          <DetailIntroCardDescription>{description}</DetailIntroCardDescription>
        </DetailIntroCardDescriptionRow>

        {/* 워크로드 라벨 정보 행 */}
        {/* TODO: 라벨 UI 정책 설정 필요 */}
        <DetailIntroCardRow>
          <DetailIntroCardRowBody>
            <DetailIntroCardRowIconWrapper>
              <Icon name="Label" color="var(--icon-fill)" size={24} />
            </DetailIntroCardRowIconWrapper>
            <LabelTitle>라벨</LabelTitle>
            {/* 라벨 태그 목록 (스크롤 가능) */}
            <Labels>
              {labels.map((label) => (
                <Tag
                  key={label}
                  variant="green"
                  theme="dark"
                  style={{ height: 30 }}
                >
                  {label}
                </Tag>
              ))}
            </Labels>
          </DetailIntroCardRowBody>
        </DetailIntroCardRow>
      </DetailIntroCardBody>
    </DetailIntroCardContainer>
  );
}


// ============================================================================
// Styled Components
// ============================================================================

/**
 * 라벨 제목 영역
 * 라벨 섹션의 제목을 표시 (우측 여백 추가)
 */
const LabelTitle = styled(DetailIntroCardRowTitle)`
  margin-right: 20px;
`;

/**
 * 워크로드 상태 제목
 * 상태 섹션의 제목을 표시 (우측 여백 추가)
 */
const WorkloadStatusTitle = styled.span`
  margin-right: 10px;
`;

/**
 * 도구 버튼 컨테이너
 * 수정, 전원 제어 등의 액션 버튼들을 배치
 */
const ToolBox = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 6px;
`;

/**
 * 아이콘 버튼 래퍼
 * 헤더의 액션 버튼들을 위한 스타일링
 */
const IconWrapper = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #343c50;
  width: 30px;
  height: 30px;
  border-radius: 2px;
  background-color: transparent;

  --icon-fill: #ced5db;
`;

/**
 * 라벨 태그 컨테이너
 * 라벨 태그들을 배치하고 스크롤 처리
 */
const Labels = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
  max-height: 50px;
  overflow-y: auto;
  flex: 1;

  ${customScrollbar("#2A3041")}
`;
