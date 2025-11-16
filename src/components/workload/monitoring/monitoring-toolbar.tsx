"use client";

import styled from "styled-components";

import { MyIcon } from "@/components/common/icon";

/**
 * 모니터링 툴바 컴포넌트의 Props 인터페이스
 */
interface MonitoringToolbarProps {
  /** 일시정지/재생 상태 */
  isPaused?: boolean;
  /** 레벨 텍스트 */
  level?: string;
  /** 시간 텍스트 */
  time?: string;
  /** 일시정지/재생 버튼 클릭 핸들러 */
  onTogglePause?: () => void;
}

/**
 * 워크로드 모니터링 페이지의 툴바 컴포넌트
 *
 * 모니터링 일시정지/재생 버튼과 현재 레벨, 시간 정보를 표시합니다.
 *
 * @param isPaused - 일시정지 상태 (기본값: false)
 * @param level - 레벨 표시 텍스트 (기본값: "LEVE")
 * @param time - 시간 표시 텍스트 (기본값: "16:01:08")
 * @param onTogglePause - 일시정지/재생 버튼 클릭 핸들러
 */
export function MonitoringToolbar({
  isPaused = false,
  level = "LEVE",
  time = "16:01:08",
  onTogglePause,
}: MonitoringToolbarProps) {
  return (
    <Container>
      {/* 왼쪽 영역: 일시정지/재생 버튼 */}
      <Left onClick={onTogglePause}>
        <MyIcon
          name={isPaused ? "Play" : "Pause"}
          color="var(--icon-fill)"
          size={24}
        />
      </Left>
      {/* 오른쪽 영역: 레벨과 시간 정보 */}
      <Right>
        <Badge>{level}</Badge>
        <Time>{time}</Time>
      </Right>
    </Container>
  );
}

/**
 * 툴바 컨테이너
 * 전체 툴바의 크기와 레이아웃을 정의
 */
const Container = styled.div`
  width: 142px;
  border: 1px solid var(--monitoring-toolbar-border-color);
  border-radius: 2px;
  height: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;

  --monitoring-toolbar-border-color: #b9bec3;
`;

/**
 * 왼쪽 영역 (일시정지/재생 버튼)
 * 클릭 가능한 아이콘 버튼 영역
 */
const Left = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  border-right: 1px solid var(--monitoring-toolbar-border-color);
  background-color: #f1f1f1;
  cursor: pointer;

  --icon-fill: #4c5055;

  &:hover {
    background-color: #e8e8e8;
  }
`;

/**
 * 오른쪽 영역 (레벨과 시간 정보)
 * 레벨 배지와 시간 정보를 표시하는 영역
 */
const Right = styled.div`
  flex: 1;
  background-color: #fafafa;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
`;

/**
 * 레벨 배지
 * 현재 모니터링 레벨을 표시하는 작은 배지
 */
const Badge = styled.div`
  padding: 4px 6px;
  border-radius: 10px;
  border: 1px solid #beb9ff;
  background-color: #f2f1ff;
  height: 20px;
  font-weight: 500;
  font-size: 10px;
  line-height: 1;
`;

/**
 * 시간 표시
 * 현재 모니터링 시간을 표시하는 텍스트
 */
const Time = styled.time`
  font-weight: 400;
  font-size: 12px;
  line-height: 1;
  color: #000;
`;
