"use client";

import { format } from "date-fns";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { DateRange, Icon } from "xiilab-ui";

import type { MonitoringDateMode } from "@/shared/types/monitoring.type";

export interface ChartDateRangeValue {
  start: Date;
  end: Date;
}

interface ChartDateRangeProps {
  /** 현재 모드: live | history */
  mode: MonitoringDateMode;
  /** 현재 선택된 날짜 범위 */
  value: ChartDateRangeValue;
  /** 모드 토글 (아이콘 클릭 시 호출) */
  onToggleMode: () => void;
  /** 날짜 범위 변경 (history 모드에서 DateRange onChange 연결) */
  onChangeRange: (startDate: Date | null, endDate: Date | null) => void;

  /** DateRange 프롭 패스스루 (history 모드용) */
  height?: number;
  width?: number;
  withTime?: boolean;
  maxDate?: Date;
}

/**
 * 차트 상단에 사용하는 라이브/히스토리 날짜 범위 컴포넌트
 *
 * - live 모드: 아이콘 + LIVE 배지 + 현재 시간(HH:mm:ss) 표시
 * - history 모드: 아이콘 + DateRange (기간 선택)
 */
export function ChartDateRange({
  mode,
  value,
  onToggleMode,
  onChangeRange,
  height = 30,
  width = 250,
  withTime = true,
  maxDate,
}: ChartDateRangeProps) {
  const isLiveMode = mode === "live";
  const [liveNow, setLiveNow] = useState<Date>(() => new Date());

  useEffect(() => {
    if (!isLiveMode) return;

    const intervalId = window.setInterval(() => {
      setLiveNow(new Date());
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isLiveMode]);

  const now = new Date();
  const effectiveMaxDate = maxDate ?? now;

  if (isLiveMode) {
    const displayDate = liveNow;
    const timeLabel = format(displayDate, "HH:mm:ss");

    return (
      <LiveContainer>
        <LiveButton type="button" onClick={onToggleMode}>
          <Icon name="Pause" color="#4C5055" size={20} />
        </LiveButton>
        <LiveCenter>
          <LiveBadge>LIVE</LiveBadge>
          <LiveTime>{timeLabel}</LiveTime>
        </LiveCenter>
      </LiveContainer>
    );
  }

  return (
    <HistoryContainer>
      <HistoryIconButton type="button" onClick={onToggleMode}>
        <Icon name="Play" color="#4042D5" size={20} />
      </HistoryIconButton>
      <DateRange
        height={height}
        width={width}
        startDate={value.start}
        endDate={value.end}
        withTime={withTime}
        onChange={onChangeRange}
        maxDate={effectiveMaxDate}
      />
    </HistoryContainer>
  );
}

const LiveContainer = styled.div`
  display: flex;
  align-items: center;
  height: 30px;
  gap: 9px;
  background-color: #F3F5F7;
  border: 1px solid #ced2d6;
  padding-right: 14px;
`;

const LiveButton = styled.button`
  display: flex;
  width: 30px;
  height: 100%;
  justify-content: center;
  align-items: center;
  border-right: 1px solid #ced2d6;

  border-top-left-radius: 2px;
  border-bottom-left-radius: 2px;
  background-color: #ffffff;
  cursor: pointer;
`;

const LiveCenter = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const LiveBadge = styled.div`
  width: 40px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  border: 2px solid #BEB9FF;
  background-color: #F2F1FF;
  font-size: 10px;
  font-weight: 500;
  color: #22212A;
`;

const LiveTime = styled.div`
  font-size: 12px;
  line-height: 12px;
  font-weight: 500;
  color: #111111;  
  font-variant-numeric: tabular-nums; 
  width: 46px;
`;

const HistoryContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background-color: #f2f7ff;

  & input {
    border-top-left-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
  }
`;

const HistoryIconButton = styled.button`
  display: flex;
  width: 30px;
  height: 30px;
  justify-content: center;
  align-items: center;
  border: 1px solid #ced2d6;
  border-right-width: 0;
  border-top-left-radius: 2px;
  border-bottom-left-radius: 2px;
  background-color: #ffffff;
  cursor: pointer;
`;
