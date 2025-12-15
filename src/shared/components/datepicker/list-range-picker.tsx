"use client";

import { format, parse } from "date-fns";
import styled from "styled-components";
import { DateRange } from "xiilab-ui";

interface ListRangePickerProps {
  /** 시작 날짜 값 */
  startDate: string;
  /** 종료 날짜 값 */
  endDate: string;
  /** 날짜 변경 시 호출되는 콜백 함수 */
  onChange: (startDate: string, endDate: string) => void;
  /** 시작 날짜 라벨 */
  startLabel?: string;
  /** 종료 날짜 라벨 */
  endLabel?: string;
  /** placeholder */
  placeholder?: string;
  /** width */
  width?: string;
  /** height */
  height?: string;
}

/**
 * 목록 페이지용 날짜 범위 선택 컴포넌트
 *
 * 날짜 범위를 선택하고 전역 상태로 관리하는 재사용 가능한 컴포넌트입니다.
 * 날짜는 "yyyy-MM-dd HH:mm:ss" 형식의 문자열로 저장됩니다.
 *
 * @param props - ListRangePickerProps
 * @returns DateRange 컴포넌트
 */
export function ListRangePicker({
  startDate,
  endDate,
  onChange,
  startLabel = "시작일시",
  endLabel = "종료일시",
  placeholder = "기간을 선택해 주세요.",
  width = "250px",
  height = "30px",
}: ListRangePickerProps) {
  /**
   * 날짜 범위 변경 핸들러
   * 날짜를 포맷팅하여 onChange 콜백으로 전달
   */
  const handleChangeDate = (start: Date | null, end: Date | null) => {
    const now = new Date();

    // 현재 시간 이후로 설정하려는 경우 현재 시간으로 제한
    if (start && start > now) {
      start = now;
    }
    if (end && end > now) {
      end = now;
    }

    // 날짜 변경 이벤트 전달
    const formattedStart = start ? format(start, "yyyy-MM-dd HH:mm:ss") : "";
    const formattedEnd = end ? format(end, "yyyy-MM-dd HH:mm:ss") : "";
    onChange(formattedStart, formattedEnd);
  };

  // 문자열을 Date 객체로 변환
  const startDateObj = startDate
    ? parse(startDate, "yyyy-MM-dd HH:mm:ss", new Date())
    : null;
  const endDateObj = endDate
    ? parse(endDate, "yyyy-MM-dd HH:mm:ss", new Date())
    : null;

  return (
    <Container>
      <DateRange
        startDate={startDateObj}
        endDate={endDateObj}
        endLabel={endLabel}
        height={height}
        onChange={handleChangeDate}
        placeholder={placeholder}
        startLabel={startLabel}
        width={width}
        withTime
        maxDate={new Date()}
      />
    </Container>
  );
}

const Container = styled.div`
  & input {
    background-color: #fafafa !important;
    border-color: #b9bec3 !important;
  }
`;
