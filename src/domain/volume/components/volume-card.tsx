"use client";

import { useAtom, useSetAtom } from "jotai";
import styled from "styled-components";
import { Card, Icon } from "xiilab-ui";

import type { VolumeListType } from "@/domain/volume/schemas/volume.schema";
import {
  volumeCheckedListAtom,
  volumeSelectedAtom,
} from "@/domain/volume/state/volume.atom";
import {
  getVolumeStatusInfo,
  getVolumeStorageTypeInfo,
} from "@/domain/volume/utils/volume.util";
import { SecurityLevelText } from "@/shared/components/text/security-status-text";

// import { PreviewTag } from "@/shared/components/tag/preview-tag";

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
  storageType,
  path,
  status,
  isSelected,
}: VolumeCardProps) {
  const setSelectedVolume = useSetAtom(volumeSelectedAtom);
  const [checkedList, setCheckedList] = useAtom(volumeCheckedListAtom);

  const { text } = getVolumeStorageTypeInfo(storageType);
  const { icon } = getVolumeStatusInfo(status);
  const isChecked = checkedList.has(uid);

  // 카드 클릭 핸들러 - 선택 볼륨 상태 변경
  const handleClickCard = () => {
    setSelectedVolume(uid);
  };

  /**
   * 체크박스 클릭 핸들러 - 체크 상태 토글
   */
  const handleClickCheckbox = (checked: boolean) => {
    setCheckedList((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(uid);
      } else {
        next.delete(uid);
      }
      return next;
    });
  };

  return (
    <Card
      contentVariant="default"
      onCheckboxChange={handleClickCheckbox}
      onClick={handleClickCard}
      // subtitle="Optional subtitle"
      title={name}
      showCheckBox
      checked={isChecked}
      // 스토리지 타입에 따라 아이콘 변경
      icon={icon ? <Icon name={icon} size={24} color="#464B51" /> : null}
      // 선택된 볼륨 카드 스타일
      style={{ borderColor: isSelected ? "#366BFF" : "" }}
    >
      <Container>
        {/* 카드 본문: 볼륨 정보 표시 */}
        <Body>
          {/* 왼쪽: 정보 라벨 */}
          <CardLeft>
            <CardKey>스토리지 타입</CardKey>
            <MultiLineKey>취약점 결과</MultiLineKey>
            <CardKey>Mount Path</CardKey>
            <CardKey>생성자</CardKey>
          </CardLeft>
          {/* 오른쪽: 정보 값 */}
          <CardRight>
            <CardValue>{text}</CardValue>
            <CardGrid>
              <CardGridItem>
                <SecurityLevelText type="engText" status="CRITICAL">
                  <SecurityCount>77,777개</SecurityCount>
                </SecurityLevelText>
              </CardGridItem>
              <CardGridItem>
                <SecurityLevelText type="engText" status="HIGH">
                  <SecurityCount>77,777개</SecurityCount>
                </SecurityLevelText>
              </CardGridItem>
              <CardGridItem>
                <SecurityLevelText type="engText" status="MEDIUM">
                  <SecurityCount>77,777개</SecurityCount>
                </SecurityLevelText>
              </CardGridItem>
              <CardGridItem>
                <SecurityLevelText type="engText" status="LOW">
                  <SecurityCount>77,777개</SecurityCount>
                </SecurityLevelText>
              </CardGridItem>
            </CardGrid>
            {/* 볼륨 경로 정보 */}
            <CardValue>
              <div className="truncate">{path || "-"}</div>
            </CardValue>
            <CardValue>{creatorName}</CardValue>
          </CardRight>
        </Body>
        {/* 카드 하단: 태그 및 액션 버튼 */}
        {/* <Footer>
          <PreviewTag labels={labels} height={20} />
        </Footer> */}
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
// const Footer = styled.div`
//   display: flex;
//   justify-content: flex-start;
//   align-items: center;
//   gap: 4px;
//   width: 100%;
// `;

/**
 * 왼쪽 정보 라벨 영역 스타일
 * 오른쪽 경계선과 함께 세로 배치
 */
const CardLeft = styled.div`
  width: 65px;
  border-right: 1px solid #e9ebee;
  display: flex;
  flex-direction: column;
  gap: 6px;
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
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
`;

const MultiLineKey = styled(CardKey)`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  height: 34px;
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
  gap: 6px;
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
  flex: 1;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2px;
`;

const CardGridItem = styled.div`
  grid-column: span 1;
`;

/**
 * 보안 취약점 개수 단위 스타일
 * 기본 스타일만 정의 (추가 스타일링 필요시 확장)
 */
const SecurityCount = styled.span`
  color: #000;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px; 
  padding-left: 4px;
`;
