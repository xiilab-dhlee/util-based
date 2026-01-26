"use client";

import styled from "styled-components";
import { Button, Card, Typography } from "xiilab-ui";

import type { StorageResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { STORAGE_CARD_HEIGHT } from "@/domain/storage/constants/storage.constant";
import { STORAGE_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import { formatDateSafely } from "@/shared/utils/date.util";

type StorageCardProps = StorageResponse;

/**
 * 스토리지 카드 컴포넌트
 *
 * 스토리지 이름, IP, 등록자, 등록일을 표시하는 카드
 */
export function StorageCard({
  storageId,
  storageName,
  storageIp,
  creatorName,
  createdAt,
}: StorageCardProps) {
  const publish = usePublish();

  const handleClick = () => {
    publish(STORAGE_EVENTS.openDetailModal, {
      id: storageId,
    });
  };

  const handleClickDelete = (e: React.MouseEvent) => {
    e.stopPropagation();

    publish(STORAGE_EVENTS.openDeleteModal, {
      id: storageId,
    });
  };

  return (
    <Card
      title={storageName}
      actionElement={<Button icon="Delete" onClick={handleClickDelete} />}
      height={STORAGE_CARD_HEIGHT}
      showHeader={true}
      onClick={handleClick}
    >
      <Container>
        <InfoRow>
          <Label>IP</Label>
          <Value>{storageIp}</Value>
        </InfoRow>
        <InfoRow>
          <Label>등록자</Label>
          <Value>{creatorName}</Value>
        </InfoRow>
        <InfoRow>
          <Label>등록일</Label>
          <Value>{formatDateSafely(createdAt)}</Value>
        </InfoRow>
      </Container>
    </Card>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  padding: 3px 4px;
  overflow: hidden;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Label = styled(Typography.Text).attrs({
  variant: "body-4-2",
  as: "span",
})`
  min-width: 40px;
  color: #484848;
`;

const Value = styled(Typography.Text).attrs({
  variant: "body-2-4",
  as: "span",
})`
  color: #191b26;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
