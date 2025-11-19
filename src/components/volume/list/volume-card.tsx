"use client";

import { format } from "date-fns";
import { useSetAtom } from "jotai";
import styled from "styled-components";
import { Card } from "xiilab-ui";

import { volumeSelectedAtom } from "@/atoms/volume.atom";
import { AstragoIcon } from "@/components/common/icon/astrago-icon";
import { StorageIcon } from "@/components/common/icon/storage-icon";
import { PreviewTag } from "@/components/common/tag/preview-tag";
import type { VolumeListType } from "@/schemas/volume.schema";

interface VolumeCardProps extends VolumeListType {
  isSelected: boolean;
}

/**
 * 볼륨 카드 컴포넌트의 실제 구현부
 *
 * 볼륨 정보를 카드 형태로 표시하며, 클릭 시 상세 페이지로 이동합니다.
 * 보안 취약점 정보와 태그를 포함한 볼륨의 주요 정보를 시각적으로
 */
export function VolumeCard({
  uid,
  name,
  creatorName,
  creatorDate,
  storageType,
  mountPath,
  labels,
  isSelected,
}: VolumeCardProps) {
  const setSelectedVolume = useSetAtom(volumeSelectedAtom);
  // 카드 클릭 핸들러 - 선택 볼륨 상태 변경
  const handleClickCard = () => {
    setSelectedVolume(uid);
  };

  /**
   * 체크박스 클릭 핸들러 (현재 미구현)
   */
  const handleClickCheckbox = () => {
    // TODO: 체크박스 선택 로직 구현 필요
  };

  return (
    <Card
      contentVariant="default"
      height={156}
      onCheckboxChange={handleClickCheckbox}
      onClick={handleClickCard}
      // subtitle="Optional subtitle"
      title={name}
      showCheckBox
      // 스토리지 타입에 따라 아이콘 변경
      icon={
        storageType.toLowerCase() === "astrago" ? (
          <AstragoIcon />
        ) : storageType.toLowerCase() === "storage" ? (
          <StorageIcon />
        ) : null
      }
      // 선택된 볼륨 카드 스타일
      style={{ borderColor: isSelected ? "#366BFF" : "" }}
    >
      <Container>
        {/* 카드 본문: 볼륨 정보 표시 */}
        <Body>
          {/* 왼쪽: 정보 라벨 */}
          <CardLeft>
            <CardKey>생성자</CardKey>
            <CardKey>생성일</CardKey>
            <CardKey>취약점</CardKey>
            <CardKey>경 로</CardKey>
          </CardLeft>
          {/* 오른쪽: 정보 값 */}
          <CardRight>
            <CardValue>{creatorName}</CardValue>
            <CardValue>{format(creatorDate, "yyyy-MM-dd")}</CardValue>
            {/* 보안 취약점 정보 */}
            <CardValue>
              <div>
                <SecurityLabel className="critical">심각</SecurityLabel>
                <SecurityUnit>7,777개</SecurityUnit>
              </div>
              <div>
                <SecurityLabel className="high">높음</SecurityLabel>
                <SecurityUnit>7,777개</SecurityUnit>
              </div>
              <div>
                <SecurityLabel className="low">낮음</SecurityLabel>
                <SecurityUnit>7,777개</SecurityUnit>
              </div>
            </CardValue>
            {/* 볼륨 경로 정보 */}
            <CardValue>
              <CardPath>{mountPath || "-"}</CardPath>
            </CardValue>
          </CardRight>
        </Body>
        {/* 카드 하단: 태그 및 액션 버튼 */}
        <Footer>
          <PreviewTag labels={labels} height={20} />
        </Footer>
      </Container>
    </Card>
  );
}

/**
 * 카드 컨테이너 스타일
 * 전체 카드 내용을 감싸고 flexbox 레이아웃을 구성
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
 * 카드 본문 스타일
 * 정보 표시 영역을 담당하며 flexbox로 좌우 배치
 */
const Body = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex: 1;
`;

/**
 * 카드 하단 스타일
 * 태그와 액션 버튼을 가로로 배치
 */
const Footer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 4px;
  width: 100%;
`;

/**
 * 왼쪽 정보 라벨 영역 스타일
 * 오른쪽 경계선과 함께 세로 배치
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
 * 굵은 폰트와 작은 크기로 라벨 표시
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
 * 유연한 너비와 세로 배치로 정보 표시
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
 * 가로 배치와 오버플로우 처리
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
  gap: 14px;
`;

/**
 * 볼륨 경로 텍스트 스타일
 * 긴 경로를 말줄임표로 처리하고 회색 텍스트 사용
 */
const CardPath = styled.span`
  font-weight: 400;
  font-size: 12px;
  line-height: 1;
  color: #707070;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  display: inline-block;
  width: 100%;
`;

/**
 * 보안 취약점 라벨 스타일
 * 심각도별 색상 구분 (심각: 빨강, 높음: 주황, 낮음: 초록)
 */
const SecurityLabel = styled.span`
  font-weight: 600;
  font-size: 10px;
  margin-right: 2px;

  &.critical {
    color: #e85a5a; /* 심각: 빨간색 */
  }

  &.low {
    color: #00911d; /* 낮음: 초록색 */
  }

  &.high {
    color: #ffa052; /* 높음: 주황색 */
  }
`;

/**
 * 보안 취약점 개수 단위 스타일
 * 기본 스타일만 정의 (추가 스타일링 필요시 확장)
 */
const SecurityUnit = styled.span``;
