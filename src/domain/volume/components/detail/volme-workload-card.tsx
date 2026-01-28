"use client";

import Link from "next/link";
import styled from "styled-components";

import { WorkloadStatusText } from "@/shared/components/text/workload-status-text";
import { formatDateSafely } from "@/shared/utils/date.util";
import { statusColorStyle } from "@/styles/mixins/color";

type VolumeWorkloadCardProps = {};

export function VolumeWorkloadCard(props: VolumeWorkloadCardProps) {
  return (
    <Container href={`/standard/workload/`}>
      <Left className="green">
        <Title className="truncate">워크로드 이름</Title>
        <Description>AstraGo팀-Workspace</Description>
        <Description>
          <span>{formatDateSafely(new Date())}</span>
          <span>홍길동</span>
        </Description>
      </Left>

      {/* 오른쪽 영역: 워크로드 상태 표시 */}
      <Right>
        <WorkloadStatusText status="RUNNING" />
      </Right>
    </Container>
  );
}

/**
 * VolumeWorkloadCard의 메인 컨테이너 스타일
 * - 테두리와 배경색 적용
 * - flexbox를 사용한 좌우 정렬
 * - 고정 높이와 패딩 설정
 */
const Container = styled(Link)`
  border: 1px solid #d9d9d9;
  background-color: #f5f5f5;
  height: 66px;
  padding: 10px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
  border-radius: 4px;
  text-decoration: none;
`;

/**
 * 왼쪽 영역 스타일
 * - statusColorStyle 믹스인으로 상태별 색상 적용
 * - flex: 1로 남은 공간 모두 차지
 * - 세로 방향 flexbox로 제목과 설명 배치
 * - 왼쪽 테두리로 상태 색상 강조
 */
const Left = styled.div`
  ${statusColorStyle}

  flex: 1;
  height: 100%;
  display: flex;
  border-left: 1px solid var(--status-text-color);
  padding: 0 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
`;

/**
 * 워크로드 제목 스타일
 * - 중간 굵기 폰트
 * - 작은 폰트 크기
 * - 검은색 텍스트
 */
const Title = styled.div`
  font-weight: 500;
  font-size: 12px;
  color: #000;
  letter-spacing: 0;
`;

/**
 * 워크로드 설명 영역 스타일
 * - 생성일과 사용자명을 가로로 배치
 * - 작은 폰트 크기와 투명도 적용
 * - gap으로 요소 간 간격 조정
 */
const Description = styled.div`
  font-weight: 400;
  font-size: 10px;
  line-height: 1;
  color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 4px;
`;

/**
 * 오른쪽 영역 스타일
 * - 워크로드 상태 텍스트를 우상단에 배치
 * - 높이 100%로 전체 영역 차지
 */
const Right = styled.div`
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
`;
