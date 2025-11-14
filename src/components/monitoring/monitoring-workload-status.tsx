import styled from "styled-components";
import { Icon } from "xiilab-ui";

import { ALL_OPTION } from "@/constants/common/core.constant";
import type { WorkloadStatusType } from "@/schemas/workload.schema";
import { getWorkloadStatusInfo } from "@/utils/workload/workload.util";

interface DashboardWorkloadStatusProps {
  status: WorkloadStatusType;
  total: number;
}

/**
 * DashboardWorkloadStatus 컴포넌트
 *
 * 대시보드에서 워크로드 상태별 통계를 표시하는 컴포넌트입니다.
 * 각 상태별로 색상과 아이콘이 다르게 표시되며, 총 개수와 증감률을 보여줍니다.
 *
 * @param status - 워크로드 상태 (ALL, RUNNING, PENDING, FAILED 등)
 * @param total - 총 개수
 */
export function MonitoringWorkloadStatus({
  status,
  total,
}: DashboardWorkloadStatusProps) {
  // 상태에 따른 텍스트와 아이콘 정보 가져오기
  const { label, icon } =
    status === ALL_OPTION.value ? ALL_OPTION : getWorkloadStatusInfo(status);

  return (
    <Container>
      <Header>
        <Title>{label}</Title>
        <IconWrapper className={status}>
          <Icon name={icon} color="var(--icon-fill)" size={18} />
        </IconWrapper>
      </Header>
      <Body>
        <BodyLeft>
          <Total>{total.toLocaleString()}</Total>
          <TotalUnit>개</TotalUnit>
        </BodyLeft>
      </Body>
    </Container>
  );
}

/**
 * 워크로드 상태 카드의 메인 컨테이너
 *
 * 워크로드 상태별 통계를 표시하는 카드 형태의 컨테이너입니다.
 * 고정 높이(86px)를 가지며 세로 방향으로 레이아웃이 구성됩니다.
 * 연한 회색 배경과 그림자 효과로 카드 느낌을 제공합니다.
 */
const Container = styled.div`
  flex: 1;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 8px 10px 0px 10px;
  box-shadow: 0px 4px 4px 0px rgba(171, 171, 171, 0.15);
  background-color: #f7f9fb;
  height: 86px;
  display: flex;
  flex-direction: column;
`;

/**
 * 카드 헤더 영역
 *
 * 제목과 상태 아이콘을 포함하는 상단 영역입니다.
 * 하단 테두리로 본문과 구분되며, 좌우 정렬로 구성됩니다.
 */
const Header = styled.div`
  height: 31px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 9px;
`;

/**
 * 상태 아이콘 래퍼
 *
 * 헤더 우측에 위치하는 원형 아이콘 컨테이너입니다.
 * 상태별로 다른 색상과 테두리를 가지며, 아이콘을 중앙에 배치합니다.
 */
const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 1px solid var(--border-color);

  /* 전체 상태 테마 (보라색) */
  &.${ALL_OPTION.value} {
    --icon-fill: #aa00ff;
    --border-color: #ded0ff;
  }

  /* 실행 중 상태 테마 (파란색) */
  &.RUNNING {
    --icon-fill: #1f5bff;
    --border-color: #c7d3e8;
  }

  /* 대기 중 상태 테마 (초록색) */
  &.PENDING {
    --icon-fill: #2dc598;
    --border-color: #84d681;
  }

  /* 실패 상태 테마 (빨간색) */
  &.FAILED {
    --icon-fill: #ff5858;
    --border-color: #ffd0dd;
  }
`;

/**
 * 상태 제목 텍스트
 *
 * 헤더 좌측에 표시되는 상태명 텍스트입니다.
 * 굵은 폰트와 검은색으로 주요 정보를 강조합니다.
 */
const Title = styled.div`
  font-weight: 600;
  font-size: 14px;
  line-height: 16px;
  color: #000;
`;

/**
 * 카드 본문 영역
 *
 * 총 개수와 증감 정보를 포함하는 하단 영역입니다.
 * 좌우 정렬로 구성되며 남은 공간을 모두 차지합니다.
 */
const Body = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

/**
 * 본문 왼쪽 영역
 *
 * 총 개수와 단위를 표시하는 영역입니다.
 * 좌측 정렬로 배치되며 작은 간격으로 구성됩니다.
 */
const BodyLeft = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 4px;
`;

/**
 * 총 개수 텍스트
 *
 * 워크로드의 총 개수를 표시하는 큰 텍스트입니다.
 * 굵은 폰트와 큰 크기로 주요 수치를 강조합니다.
 */
const Total = styled.div`
  font-weight: 600;
  font-size: 18px;
  line-height: 100%;
  color: #000;
`;

/**
 * 총 개수 단위 텍스트
 *
 * 총 개수 옆에 표시되는 단위 텍스트입니다.
 * 중간 굵기의 폰트로 보조 정보를 제공합니다.
 */
const TotalUnit = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: #000;
`;
