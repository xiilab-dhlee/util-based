"use client";

import { Drawer } from "antd";
import { useAtom } from "jotai";
import styled from "styled-components";

import { WorkloadMonitoringCard } from "@/domain/workload/components/detail/workload-monitoring-card";
import { openViewWorkloadMonitoringDrawerAtom } from "@/domain/workload/state/workload.atom";
import { DrawerCloseButton } from "../button/drawer-close-button";

/**
 * 워크로드 모니터링 정보를 표시하는 우측 드로어 컴포넌트
 *
 *
 * @description
 * - 우측에서 슬라이드되어 나타나는 모니터링 패널
 * - CPU와 메모리 사용량을 실시간으로 모니터링
 * - 마스크 없이 표시되며 고정된 너비(480px)를 가짐
 * - 헤더에 제목과 닫기 버튼이 포함됨
 */
export function MonitoringDrawer() {
  const [open, setOpen] = useAtom(openViewWorkloadMonitoringDrawerAtom);
  /**
   * 드로어를 닫는 핸들러 함수
   * 부모 컴포넌트에서 전달받은 onClose 콜백을 호출합니다.
   */
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Drawer
      placement="right" // 우측에서 슬라이드
      closable={false} // 기본 닫기 버튼 비활성화 (커스텀 헤더 사용)
      open={open} // 드로어 표시 여부
      getContainer={false} // DOM에 직접 렌더링
      mask={false} // 배경 마스크 비활성화
      width={480} // 고정 너비 480px
      zIndex={1000} // 높은 z-index로 다른 요소 위에 표시
      styles={{
        body: {
          overflow: "hidden", // 스크롤바 숨김
        },
      }}
      title={
        <Header>
          <Title className="truncate">모니터링</Title>
          <DrawerCloseButton onClick={handleClose} />
        </Header>
      }
    >
      <Container>
        <Body>
          {/* 메모리 사용량 모니터링 카드 */}
          <WorkloadMonitoringCard type="memory-usage" />
          {/* CPU 사용량 모니터링 카드 */}
          <WorkloadMonitoringCard type="cpu-usage" />
        </Body>
      </Container>
    </Drawer>
  );
}

/**
 * 드로어 내부 컨테이너 스타일
 * 전체 높이를 사용하며 세로 방향 레이아웃을 구성합니다.
 */
const Container = styled.div`
  height: 100%;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  overflow: auto;
  padding: 20px 22px; // 좌우 여백 22px, 상하 여백 20px
`;

/**
 * 드로어 헤더 스타일
 * 제목과 닫기 버튼을 가로로 배치하며 고정 높이를 가집니다.
 */
const Header = styled.div`
  width: 100%;
  height: 49px; // 고정 헤더 높이
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px; // 제목과 닫기 버튼 사이 간격
`;

/**
 * 드로어 본문 스타일
 * 모니터링 카드들을 세로로 배치하며 스크롤 가능합니다.
 */
const Body = styled.div`
  flex: 1; // 남은 공간 모두 차지
  display: flex;
  flex-direction: column;
  gap: 14px; // 카드 간 간격
  overflow: auto; // 내용이 넘칠 경우 스크롤
`;

/**
 * 드로어 제목 스타일
 * 텍스트가 길 경우 말줄임표로 처리되며 중앙 정렬됩니다.
 */
const Title = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: 16px;
  color: #000;
  overflow: hidden; // 넘치는 텍스트 숨김
  flex: 1; // 남은 공간 차지
`;
