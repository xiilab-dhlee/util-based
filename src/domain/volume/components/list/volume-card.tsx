"use client";

import { useAtom } from "jotai";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import styled from "styled-components";
import { Card, Icon } from "xiilab-ui";

import type { VolumeListResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { volumeCheckedListAtom } from "@/domain/volume/state/volume.atom";
import type { VolumeMode } from "@/domain/volume/types/volume.type";
import { getVolumeStorageTypeInfo } from "@/domain/volume/utils/volume.util";
import { ROUTES } from "@/shared/constants/routes.constant";
import { SELECTOR } from "@/shared/constants/selector.constant";
import { getSessionAccountId } from "@/shared/utils/auth.util";

interface VolumeCardProps extends VolumeListResponse {
  mode: VolumeMode;
}

export function VolumeCard({
  volumeId,
  volumeName,
  creatorId,
  creatorName,
  volumeType,
  mountPath,
  isPublic,
  mode,
}: VolumeCardProps) {
  const router = useRouter();
  const params = useParams<{ id?: string }>();
  const { data: session } = useSession();

  const [checkedList, setCheckedList] = useAtom(volumeCheckedListAtom);

  const isUserMode = mode === "user";
  const { text } = getVolumeStorageTypeInfo(volumeType);
  const isChecked = checkedList.has(volumeId);

  // 체크박스 활성화 조건 (삭제 권한)
  // - 사용자 모드: 생성자만 삭제 가능
  // - 관리자 모드: 항상 삭제 가능
  const currentAccountId = getSessionAccountId(session);
  const isCreator = Boolean(
    creatorId && currentAccountId && currentAccountId === creatorId,
  );
  const canCheck = isUserMode ? isCreator : true;

  const parsedId = params.id ? Number(params.id) : Number.NaN;
  const selectedVolumeId = Number.isNaN(parsedId) ? -1 : parsedId;
  const isSelected = selectedVolumeId === volumeId;

  const handleClickCard = () => {
    if (isSelected) return;
    const detailRoute = isUserMode
      ? ROUTES.USER_VOLUME_DETAIL(volumeId)
      : ROUTES.ADMIN_VOLUME_DETAIL(volumeId);
    router.push(detailRoute);
  };

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
      showCheckBox={canCheck}
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

const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 2px 6px;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
`;

const Body = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex: 1;
`;

const CardLeft = styled.div`
  width: 65px;
  border-right: 1px solid #e9ebee;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

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

const CardRight = styled.div`
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-left: 10px;
`;

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
