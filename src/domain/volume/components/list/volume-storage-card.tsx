"use client";

import classNames from "classnames";
import styled from "styled-components";

import type { VolumeStorageType } from "@/domain/volume/schemas/volume.schema";
import { AstragoIcon } from "@/shared/components/icon/astrago-icon";
import { StorageIcon } from "@/shared/components/icon/storage-icon";

/**
 * 볼륨 스토리지 타입 선택을 위한 카드 컴포넌트
 *
 * 사용자가 볼륨을 생성할 때 스토리지 타입을 선택할 수 있는 인터랙티브 카드입니다.
 * AstraGo Storage와 On-premise Storage 두 가지 옵션을 제공합니다.
 */
interface VolumeStorageCardProps {
  /** 선택할 스토리지 타입 (ASTRAGO 또는 LOCAL) */
  storageType: VolumeStorageType;
  /** 스토리지 타입 선택 시 호출되는 콜백 함수 */
  onClick: (storageType: VolumeStorageType) => void;
  /** 선택 여부 */
  isSelected: boolean;
}

/**
 * VolumeStorageCard 컴포넌트
 *
 * 스토리지 타입에 따라 다른 UI와 설명을 표시하는 카드 컴포넌트입니다.
 * 클릭 시 해당 스토리지 타입이 선택되고 부모 컴포넌트에 알림이 전달됩니다.
 *
 * @param storageType - 표시할 스토리지 타입
 * @param onClick - 스토리지 타입 선택 시 호출되는 콜백
 * @param isSelected - 선택 여부
 * @returns 스토리지 타입 선택 카드 JSX
 */
export function VolumeStorageCard({
  storageType,
  onClick,
  isSelected,
}: VolumeStorageCardProps) {
  // 스토리지 타입별 UI 데이터 초기화
  let from: string; // 출처 표시 텍스트
  let storageName: string; // 스토리지 이름
  let icon: React.ReactNode; // 스토리지 아이콘
  let iconClassName: string; // 아이콘 스타일링을 위한 CSS 클래스명
  let description: React.ReactNode; // 스토리지 설명

  // AstraGo Storage 타입 처리
  if (storageType === "ASTRAGO") {
    from = "Local";
    storageName = "AstraGo Storage";
    icon = <AstragoIcon />;
    iconClassName = "astrago";
    description = (
      <>
        <div>AstraGo로 관리되어지는 File 스토리지에</div>
        <div>데이터가 업로드 됩니다.</div>
      </>
    );
  }
  // On-premise Storage 타입 처리
  else if (storageType === "LOCAL") {
    from = "External Data Source";
    storageName = "On-premise Storage";
    icon = <StorageIcon />;
    iconClassName = "on-premise";
    description = (
      <>
        <div>On-premise 환경의 사용자 스토리지(NFS)</div>
        <div>를 연결하여 파일을 업로드 됩니다.</div>
      </>
    );
  }
  // 잘못된 스토리지 타입 처리
  else {
    throw new Error(`Invalid storage type: ${storageType}`);
  }

  return (
    <Container
      type="button"
      className={classNames({ active: isSelected })}
      onClick={() => onClick(storageType)}
    >
      {/* 카드 헤더: 출처, 제목, 아이콘 */}
      <Header>
        <HeaderLeft>
          <HeaderFrom>From {from}</HeaderFrom>
          <HeaderTitle>{storageName} Storage</HeaderTitle>
        </HeaderLeft>
        <IconWrapper className={iconClassName}>{icon}</IconWrapper>
      </Header>

      {/* 카드 본문: 스토리지 설명 */}
      <Body>{description}</Body>
    </Container>
  );
}

// ===== Styled Components =====

/**
 * 스토리지 카드의 메인 컨테이너
 *
 * 버튼 형태로 구현되어 클릭 가능하며, 호버 시 테두리 색상이 변경됩니다.
 * 카드 레이아웃과 스타일링을 담당합니다.
 */
const Container = styled.button`
  flex: 1;
  border-radius: 4px;
  border: 1px solid #e0e5f0;
  background: #fff;

  height: 140px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: left;

  /* 호버 및 활성 효과: 테두리 색상 변경 */
  &:hover,
  &.active {
    border-color: #1f5bff;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.15);
  }
`;

/**
 * 카드 헤더 영역
 *
 * 출처, 제목, 아이콘을 가로로 배치하는 컨테이너입니다.
 */
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

/**
 * 헤더 왼쪽 영역
 *
 * 출처와 제목을 세로로 배치하는 컨테이너입니다.
 */
const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  color: #000;
  gap: 2px;
`;

/**
 * 스토리지 제목
 *
 * 스토리지 타입의 이름을 표시하는 텍스트입니다.
 */
const HeaderTitle = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: #000;
  line-height: 17px;
`;

/**
 * 스토리지 출처
 *
 * 스토리지의 출처를 표시하는 작은 텍스트입니다.
 */
const HeaderFrom = styled.div`
  font-weight: 400;
  font-size: 10px;
  color: #000;
  line-height: 12px;
`;

/**
 * 스토리지 아이콘 래퍼
 *
 * 스토리지 타입별 아이콘을 표시하는 컨테이너입니다.
 * 스토리지 타입에 따라 다른 스타일과 크기가 적용됩니다.
 */
const IconWrapper = styled.div`
  border: 1px solid #e0e5f0;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 42px;
  height: 42px;

  /* AstraGo 스토리지 아이콘 스타일 */
  &.astrago {
    --icon-fill: #5b29c7;
  }

  /* On-premise 스토리지 아이콘 스타일 */
  &.on-premise {
    --icon-fill: rgba(0, 20, 197, 60%);
  }

  /* AstraGo 아이콘 크기 설정 */
  &.astrago svg {
    width: 32px;
    height: 32px;
  }

  /* On-premise 아이콘 크기 설정 */
  &.on-premise svg {
    width: 24px;
    height: 24px;
  }
`;

/**
 * 카드 본문 영역
 *
 * 스토리지에 대한 상세 설명을 표시하는 영역입니다.
 * 연한 배경색과 테두리를 가진 컨테이너입니다.
 */
const Body = styled.div`
  flex: 1;
  border: 1px solid #e0e0e0;
  border-radius: 2px;
  background: #fdfeff;
  padding: 9px 10px;

  font-weight: 400;
  font-size: 11px;
  line-height: 16px;
  color: #000;
`;
