"use client";

import { useAtom } from "jotai";
import { useParams, useRouter } from "next/navigation";
import styled from "styled-components";
import { Card, Icon } from "xiilab-ui";

import type { VolumeListResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { volumeCheckedListAtom } from "@/domain/volume/state/volume.atom";
import { getVolumeStorageTypeInfo } from "@/domain/volume/utils/volume.util";
import { ROUTES } from "@/shared/constants/routes.constant";
import { SELECTOR } from "@/shared/constants/selector.constant";

interface VolumeCardProps extends VolumeListResponse {}

/**
 * 볼륨 카드 컴포넌트
 *
 * 볼륨 정보를 카드 형태로 표시하며, 클릭 시 상세 페이지로 이동합니다.
 * Hub 패턴과 동일하게 URL 기반으로 선택 상태를 관리합니다.
 */
export function VolumeCard({
  volumeId,
  volumeName,
  creatorName,
  volumeType,
  mountPath,
  isPublic,
}: VolumeCardProps) {
  const router = useRouter();
  const params = useParams<{ id?: string }>();

  const [checkedList, setCheckedList] = useAtom(volumeCheckedListAtom);

  const { text } = getVolumeStorageTypeInfo(volumeType);
  const isChecked = checkedList.has(volumeId);

  // URL 파라미터에서 현재 선택된 볼륨 ID 확인
  const parsedId = params.id ? Number(params.id) : Number.NaN;
  const selectedVolumeId = Number.isNaN(parsedId) ? -1 : parsedId;
  const isSelected = selectedVolumeId === volumeId;

  /**
   * 카드 클릭 핸들러
   * 해당 볼륨 상세 페이지로 이동
   */
  const handleClickCard = () => {
    if (isSelected) return;

    router.push(ROUTES.USER_VOLUME_DETAIL(volumeId));
  };

  /**
   * 체크박스 클릭 핸들러 - 체크 상태 토글
   */
  const handleClickCheckbox = (checked: boolean) => {
    setCheckedList((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(volumeId);
      } else {
        next.delete(volumeId);
      }
      return next;
    });
  };

  return (
    <Card
      contentVariant="default"
      onCheckboxChange={handleClickCheckbox}
      onClick={handleClickCard}
      title={volumeName}
      showCheckBox
      checked={isChecked}
      icon={!isPublic ? <Icon name="Lock" size={24} color="#464B51" /> : null}
      selected={isSelected}
      data-testid={SELECTOR.LIST_CARD}
      data-volume-id={volumeId}
      data-selected={isSelected}
    >
      <Container>
        <Body>
          <CardLeft>
            <CardKey>스토리지 타입</CardKey>
            <CardKey>Mount Path</CardKey>
            <CardKey>생성자</CardKey>
          </CardLeft>
          <CardRight>
            <CardValue>{text}</CardValue>
            <CardValue>
              <div className="truncate">{mountPath || "-"}</div>
            </CardValue>
            <CardValue>{creatorName}</CardValue>
          </CardRight>
        </Body>
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
