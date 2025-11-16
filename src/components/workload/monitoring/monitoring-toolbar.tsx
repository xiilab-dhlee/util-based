"use client";
/**
 * @fileoverview ?�크로드 모니?�링 ?�이지???�바 컴포?�트
 * 모니?�링 ?�어�??�한 ?�시?��?/?�생 버튼�??�재 ?�태 ?�보�??�시?�니??
 *
 * @author XiiLab
 * @since 2024
 */

"use client";

import styled from "styled-components";
import {} from "xiilab-ui";

import { MyIcon } from "@/components/common/icon";

/**
 * 모니?�링 ?�바 컴포?�트??Props ?�터?�이??
 */
interface MonitoringToolbarProps {
  /** ?�시?��?/?�생 ?�태 */
  isPaused?: boolean;
  /** ?�벨 ?�스??*/
  level?: string;
  /** ?�간 ?�스??*/
  time?: string;
  /** ?�시?��?/?�생 버튼 ?�릭 ?�들??*/
  onTogglePause?: () => void;
}

/**
 * ?�크로드 모니?�링 ?�이지???�바 컴포?�트
 *
 * 모니?�링 ?�시?��?/?�생 버튼�??�재 ?�벨, ?�간 ?�보�??�시?�니??
 *
 * @param isPaused - ?�시?��? ?�태 (기본�? false)
 * @param level - ?�벨 ?�시 ?�스??(기본�? "LEVE")
 * @param time - ?�간 ?�시 ?�스??(기본�? "16:01:08")
 * @param onTogglePause - ?�시?��?/?�생 버튼 ?�릭 ?�들??
 */
export function MonitoringToolbar({
  isPaused = false,
  level = "LEVE",
  time = "16:01:08",
  onTogglePause,
}: MonitoringToolbarProps) {
  return (
    <Container>
      {/* ?�쪽 ?�역: ?�시?��?/?�생 버튼 */}
      <Left onClick={onTogglePause}>
        <MyIcon
          name={isPaused ? "Play" : "Pause"}
          color="var(--icon-fill)"
          size={24}
        />
      </Left>
      {/* ?�른�??�역: ?�벨�??�간 ?�보 */}
      <Right>
        <Badge>{level}</Badge>
        <Time>{time}</Time>
      </Right>
    </Container>
  );
}

/**
 * ?�바 컨테?�너
 * ?�체 ?�바???�기?� ?�이?�웃???�의
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
 * ?�쪽 ?�역 (?�시?��?/?�생 버튼)
 * ?�릭 가?�한 ?�이�?버튼 ?�역
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
 * ?�른�??�역 (?�벨�??�간 ?�보)
 * ?�벨 배�??� ?�간 ?�보�??�시?�는 ?�역
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
 * ?�벨 배�?
 * ?�재 모니?�링 ?�벨???�시?�는 ?��? 배�?
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
 * ?�간 ?�시
 * ?�재 모니?�링 ?�간???�시?�는 ?�스??
 */
const Time = styled.time`
  font-weight: 400;
  font-size: 12px;
  line-height: 1;
  color: #000;
`;
