"use client";

import { useRouter } from "next/navigation";
import styled from "styled-components";
import { Card, Icon } from "xiilab-ui";

import type { WorkloadListType } from "@/schemas/workload.schema";

interface DashboardRunningWorkloadCardProps extends WorkloadListType {}

/**
 * 대시보드 실행 중 워크로드 카드 컴포넌트의 실제 구현부
 *
 * 실행 중인 워크로드 정보를 카드 형태로 표시합니다.
 * GPU 할당량, 사용률, 보안 취약점 정보와 태그를 포함한 워크로드의 주요 정보를 시각적으로 표현합니다.
 *
 * 주요 기능:
 * - 워크로드 기본 정보 표시 (이름, 타입)
 * - GPU 할당량 및 사용률 정보 표시
 * - 보안 취약점 정보 표시 (심각도별 색상 구분)
 * - 인터랙티브 태그 및 액션 버튼
 * - 클릭 시 상세 페이지 이동 (현재 비활성화)
 *
 * @param workloadName - 워크로드 이름
 * @returns 실행 중인 워크로드 정보를 담은 카드 컴포넌트
 */
export function DashboardRunningWorkloadCard({
  id,
  workloadName,
  workspaceId,
}: DashboardRunningWorkloadCardProps) {
  const router = useRouter();
  // 카드 클릭 핸들러 - 워크로드 상세 페이지 이동 (현재 비활성화)
  const handleClickCard = () => {
    // TODO: 워크로드 상세 페이지로 이동하는 로직 구현
    router.push(`/admin/workspace/workload/${id}?workspaceId=${workspaceId}`);
  };

  return (
    <Card
      contentVariant="default"
      height={148}
      onClick={handleClickCard}
      subtitle="Interactive Job"
      title={workloadName}
    >
      <Container>
        {/* 카드 본문: 워크로드 정보 표시 */}
        <Body>
          {/* 왼쪽: 정보 라벨 */}
          <CardLeft>
            <CardKey>G P U</CardKey>
            <CardKey>할당량</CardKey>
            <CardKey>사용률</CardKey>
          </CardLeft>
          {/* 오른쪽: 정보 값 */}
          <CardRight>
            <CardValue>A100</CardValue>
            <CardValue>
              <CardResource>GPU</CardResource>
              <span>2개&nbsp;</span>
              <CardResource>CPU</CardResource>
              <span>34Core&nbsp;</span>
              <CardResource>MEM</CardResource>
              <span>32GB&nbsp;</span>
            </CardValue>
            {/* 보안 취약점 정보 (심각도별 색상 구분) */}
            <CardValue>
              <CardResource>GPU</CardResource>
              <span>100%&nbsp;</span>
              <CardResource>CPU</CardResource>
              <span>100%&nbsp;</span>
              <CardResource>MEM</CardResource>
              <span>100%&nbsp;</span>
            </CardValue>
          </CardRight>
        </Body>
        {/* 카드 하단: 태그 및 액션 버튼 */}
        <Footer>
          <FooterItem>
            <Icon name="PersonFilled" size={10} />
            <span>홍길동</span>
          </FooterItem>
          <FooterItem>
            <Icon name="SingleNode" size={10} />
            <span>worker-1</span>
          </FooterItem>
        </Footer>
      </Container>
    </Card>
  );
}

// ===== Styled Components =====

/**
 * 워크로드 카드 컨테이너 스타일
 *
 * 전체 카드 내용을 감싸고 세로 방향 flexbox 레이아웃을 구성합니다.
 * 카드 내부의 본문과 하단 영역을 분리하여 배치합니다.
 */
const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 2px 6px;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
`;

/**
 * 워크로드 카드 본문 스타일
 *
 * 워크로드 정보 표시 영역을 담당하며 좌우 배치로 구성됩니다.
 * 왼쪽에는 라벨, 오른쪽에는 값이 표시됩니다.
 */
const Body = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex: 1;
`;

/**
 * 워크로드 카드 하단 스타일
 *
 * 태그와 액션 버튼을 가로로 배치하는 영역입니다.
 * 인터랙티브 태그, 경고 태그, 추가 태그 개수를 포함합니다.
 */
const Footer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 4px;
  width: 100%;
  border-top: 1px solid #e1e4e7;
  padding: 10px 0;
`;

/**
 * 왼쪽 정보 라벨 영역 스타일
 *
 * GPU, 할당량, 사용률 등의 라벨을 세로로 배치합니다.
 * 오른쪽 경계선으로 값 영역과 구분됩니다.
 */
const CardLeft = styled.div`
  width: 36px;
  border-right: 1px solid #e9ebee;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

/**
 * 정보 라벨 텍스트 스타일
 *
 * 굵은 폰트와 작은 크기로 라벨을 표시합니다.
 * 단어 간격을 조정하여 가독성을 향상시킵니다.
 */
const CardKey = styled.div`
  font-weight: 600;
  font-size: 10px;
  line-height: 12px;
  color: #484848;
  word-spacing: 0.1px;
`;

/**
 * 오른쪽 정보 값 영역 스타일
 *
 * 워크로드의 실제 값들을 세로로 배치합니다.
 * 유연한 너비를 가지며 오버플로우를 처리합니다.
 */
const CardRight = styled.div`
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-left: 10px;
`;

/**
 * 정보 값 텍스트 스타일
 *
 * 워크로드의 값들을 가로로 배치합니다.
 * 보안 취약점 정보의 경우 여러 항목을 나란히 표시합니다.
 */
const CardValue = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 1;
  color: #000;
  overflow: hidden;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const CardResource = styled.div`
  font-weight: 600;
  font-size: 12px;
  line-height: 1;
  color: #000;
  margin-right: 2px;
`;

const FooterItem = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 10px;
  gap: 5px;
  font-weight: 400;
  font-size: 12px;
  color: #171b26;

  & + & {
    margin-left: 9px;
    padding-left: 9px;
    border-left: 1px solid #969a9f;
  }

  & svg {
    transform: scale(1.5);
  }
`;
