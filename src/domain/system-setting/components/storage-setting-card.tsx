"use client";

import styled from "styled-components";
import { Button, Card, Typography } from "xiilab-ui";

import type {
  StorageSettingIdType,
  StorageSettingListType,
} from "@/domain/system-setting/schemas/storage-setting.schema";
import { formatDateSafely } from "@/shared/utils/date.util";

interface StorageSettingCardProps extends Partial<StorageSettingListType> {
  /** 카드 클릭 핸들러 */
  onClick?: (id: StorageSettingIdType) => void;
  /** 삭제 버튼 클릭 핸들러 */
  onDelete?: (id: StorageSettingIdType) => void;
  /** 로딩 상태 */
  loading?: boolean;
}

/**
 * 스토리지 설정 카드 컴포넌트
 *
 * 스토리지 이름, IP, 등록자, 등록일을 표시하는 카드
 */
export function StorageSettingCard({
  id,
  storageName,
  ip,
  creatorName,
  creatorDate,
  onClick,
  onDelete,
  loading,
}: StorageSettingCardProps) {
  const handleClick = () => {
    if (id && !loading) onClick?.(id);
  };

  const handleClickDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (id) onDelete?.(id);
  };

  return (
    <Card
      title={storageName}
      actionElement={
        !loading && <Button icon="Delete" onClick={handleClickDelete} />
      }
      height={102}
      showHeader={true}
      loading={loading}
      onClick={handleClick}
    >
      <Container>
        <InfoRow>
          <Label>IP</Label>
          <Value>{ip}</Value>
        </InfoRow>
        <InfoRow>
          <Label>등록자</Label>
          <Value>{creatorName}</Value>
        </InfoRow>
        <InfoRow>
          <Label>등록일</Label>
          <Value>{formatDateSafely(creatorDate)}</Value>
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
