"use client";

import { useMemo } from "react";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";

import type { MonitoringNotificationSettingType } from "@/domain/monitoring-notification/schemas/monitoring-notification.schema";

interface ReadOnlyMonitoringNotificationSettingProps {
  settings: MonitoringNotificationSettingType[];
}

export function ReadOnlyMonitoringNotificationSetting({
  settings,
}: ReadOnlyMonitoringNotificationSettingProps) {
  // parameters 배열에서 key와 value를 각각 분리하여 별도 배열로 생성
  // useMemo를 사용하여 parameters가 변경될 때만 재계산하도록 최적화
  const { items, operators, thresholds, durations } = useMemo(() => {
    const items = settings.map((param) => param.item);
    const operators = settings.map((param) => param.operator);
    const thresholds = settings.map((param) => param.threshold);
    const durations = settings.map((param) => param.duration);
    return { items, operators, thresholds, durations };
  }, [settings]);

  return (
    <Container>
      {/* 헤더: 키와 값 컬럼의 제목 표시 */}
      <Header>
        <Row>
          <Title>항목</Title>
        </Row>
        <Row>
          <Title>연산자</Title>
        </Row>
        <Row>
          <Title>임계값</Title>
        </Row>
        <Row>
          <Title>지속시간</Title>
        </Row>
      </Header>

      {/* 본문: 파라미터 키와 값을 좌우로 분리하여 표시 */}
      <Body>
        <BodyRow>
          {/* 왼쪽 컬럼: 파라미터 키들을 세로로 나열 */}
          <KeyColumn>
            {items.map((item) => (
              <Value key={uuidv4()} className="truncate" title={item}>
                {item}
              </Value>
            ))}
          </KeyColumn>
          {/* 오른쪽 컬럼: 파라미터 값들을 세로로 나열 */}
          <ValueColumn>
            {operators.map((v) => (
              <Value key={uuidv4()} className="truncate" title={v}>
                {v}
              </Value>
            ))}
          </ValueColumn>
          <ValueColumn>
            {thresholds.map((v) => (
              <Value key={uuidv4()} className="truncate" title={v}>
                {v}
              </Value>
            ))}
          </ValueColumn>
          <ValueColumn>
            {durations.map((v) => (
              <Value key={uuidv4()} className="truncate" title={v}>
                {v}
              </Value>
            ))}
          </ValueColumn>
        </BodyRow>
      </Body>
    </Container>
  );
}

// ===== Styled Components =====

/**
 * 전체 컨테이너 스타일
 * - 테두리와 배경색 적용
 * - 세로 방향 flex 레이아웃
 */
const Container = styled.div`
  border: 1px solid #c1c7ce;
  border-radius: 4px;
  background-color: #f3f5f7;
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 12px 0;
`;

/**
 * 헤더 영역 스타일
 * - 키와 값 컬럼의 제목을 좌우로 배치
 * - 하단 여백으로 본문과 구분
 */
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
`;

/**
 * 본문 영역 스타일
 * - 키와 값 컬럼을 좌우로 배치
 * - 오버플로우 숨김으로 레이아웃 유지
 */
const Body = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
`;

/**
 * 기본 행 스타일
 * - flex: 1로 균등한 공간 분배
 * - 세로 방향 flex 레이아웃
 * - 좌우 패딩으로 여백 확보
 */
const Row = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0 12px;
  overflow: hidden;
`;

/**
 * 본문 행 스타일
 * - 키와 값 컬럼을 가로로 배치
 * - 전체 너비 사용
 */
const BodyRow = styled.div`
  display: flex;
  width: 100%;
`;

/**
 * 키 컬럼 스타일
 * - Row 스타일 상속
 * - 오른쪽 테두리로 값 컬럼과 구분
 */
const KeyColumn = styled(Row)`
  flex: 1;
  border-right: 1px solid #e0e0e0;
`;

/**
 * 값 컬럼 스타일
 * - Row 스타일 상속
 * - 키 컬럼과 동일한 공간 차지
 */
const ValueColumn = styled(Row)`
  flex: 1;
`;

/**
 * 제목 텍스트 스타일
 * - 작은 폰트 크기와 굵기
 * - 검은색 텍스트
 */
const Title = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 1;
  color: #000;
`;

/**
 * 값 텍스트 스타일
 * - 작은 폰트 크기
 * - 하단 패딩으로 항목 간 간격 확보
 * - 연속된 항목 사이에 점선 구분선 추가
 * - truncate 클래스로 긴 텍스트 처리
 */
const Value = styled.div`
  font-weight: 400;
  font-size: 10px;
  line-height: 1;
  color: #000;
  padding-bottom: 6px;

  & + & {
    border-top: 1px dashed #dbe1e6;
    padding-top: 6px;
  }
`;
