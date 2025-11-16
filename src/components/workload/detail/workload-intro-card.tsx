"use client";

import { usePathname } from "next/navigation";
import styled from "styled-components";
import { Tag } from "xiilab-ui";

import { MyIcon } from "@/components/common/icon";
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
 * ?�크로드 ?�세 ?�이지???�개 카드 컴포?�트
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
  // Pub/Sub ?�스?�을 ?�한 ?�벤??발행 ??
  const publish = usePublish();
  const pathname = usePathname();

  const isStandard = isUserMode(pathname);

  /**
   * ?�크로드 ?�정 모달???�기 ?�한 ?�들??
   * Pub/Sub ?�스?�을 ?�해 ?�크로드 ?�정 ?�벤?��? 발행?�니??
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
   * ?�크로드 ?�원 ?�어 ?�들??
   * ?�재??준�?�?메시지�??�시?�니??
   * TODO: ?�제 ?�원 ?�어 기능 구현 ?�요
   */
  const handleClickPower = () => {
    alert("준�?중입?�다.");
  };

  return (
    <DetailIntroCardContainer>
      {/* ?�더 ?�역: ?�크로드 ?�름�??�구 버튼??*/}
      <DetailIntroCardHeader>
        {/* ?�크로드 ?�름 ?�시 ?�역 */}
        <DetailIntroCardTitle>
          <span className="truncate">{workloadName}</span>
        </DetailIntroCardTitle>
        {/* ?�구 버튼 ?�역 */}
        <ToolBox>
          {/* ?�크로드 ?�정 버튼 */}
          {isStandard && (
            <IconWrapper onClick={handleModify}>
              <MyIcon name="Edit02" color="var(--icon-fill)" size={24} />
              <span className="sr-only">?�크로드 ?�명, ?�벨 ?�정</span>
            </IconWrapper>
          )}
          {/* ?�크로드 ?�원 ?�어 버튼 */}
          <IconWrapper onClick={handleClickPower}>
            <MyIcon name="Power" color="var(--icon-fill)" size={24} />
            <span className="sr-only">?�크로드 ?�원 On/Off</span>
          </IconWrapper>
        </ToolBox>
      </DetailIntroCardHeader>

      {/* 본문 ?�역: ?�크로드 ?�세 ?�보 */}
      <DetailIntroCardBody>
        {/* ?�크로드 ?�태 ?�보 ??*/}
        <DetailIntroCardRow>
          <DetailIntroCardRowBody>
            <DetailIntroCardRowIconWrapper>
              <MyIcon name="Info" color="var(--icon-fill)" size={24} />
            </DetailIntroCardRowIconWrapper>
            <DetailIntroCardRowTitle>
              <WorkloadStatusTitle>?�크로드 ?�태</WorkloadStatusTitle>
              <WorkloadStatusText status={status} />
            </DetailIntroCardRowTitle>
          </DetailIntroCardRowBody>
        </DetailIntroCardRow>

        {/* ?�크로드 ?�명 ?�보 ??(?�장 가?? */}
        <DetailIntroCardDescriptionRow>
          <DetailIntroCardDescriptionRowBody>
            <DetailIntroCardRowIconWrapper>
              <MyIcon name="Description" color="var(--icon-fill)" size={22} />
            </DetailIntroCardRowIconWrapper>
            <DetailIntroCardRowTitle>?�크로드 ?�명</DetailIntroCardRowTitle>
          </DetailIntroCardDescriptionRowBody>
          {/* ?�크로드 ?�명 ?�스??(?�크�?가?? */}
          <DetailIntroCardDescription>{description}</DetailIntroCardDescription>
        </DetailIntroCardDescriptionRow>

        {/* ?�크로드 ?�벨 ?�보 ??*/}
        {/* TODO: ?�벨 UI ?�책 ?�정 ?�요 */}
        <DetailIntroCardRow>
          <DetailIntroCardRowBody>
            <DetailIntroCardRowIconWrapper>
              <MyIcon name="Label" color="var(--icon-fill)" size={24} />
            </DetailIntroCardRowIconWrapper>
            <LabelTitle>?�벨</LabelTitle>
            {/* ?�벨 ?�그 목록 (?�크�?가?? */}
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
 * ?�벨 ?�목 ?�역
 * ?�벨 ?�션???�목???�시 (?�측 ?�백 추�?)
 */
const LabelTitle = styled(DetailIntroCardRowTitle)`
  margin-right: 20px;
`;

/**
 * ?�크로드 ?�태 ?�목
 * ?�태 ?�션???�목???�시 (?�측 ?�백 추�?)
 */
const WorkloadStatusTitle = styled.span`
  margin-right: 10px;
`;

/**
 * ?�구 버튼 컨테?�너
 * ?�정, ?�원 ?�어 ?�의 ?�션 버튼?�을 배치
 */
const ToolBox = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 6px;
`;

/**
 * ?�이�?버튼 ?�퍼
 * ?�더???�션 버튼?�을 ?�한 ?��??�링
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
 * ?�벨 ?�그 컨테?�너
 * ?�벨 ?�그?�을 배치?�고 ?�크�?처리
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
