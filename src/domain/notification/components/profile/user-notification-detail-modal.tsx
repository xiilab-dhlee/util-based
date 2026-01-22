"use client";

import { Icon, InfoModal } from "xiilab-ui";

import type { NotificationItemResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  ContentText,
  ContentWrapper,
  DetailLabel,
  DetailRow,
  DetailValue,
} from "@/domain/notification/components/profile/notification-detail-modal.styles";
import { DataErrorState } from "@/shared/components/feedback/data-error-state";
import { formatDateTimeSafely } from "@/shared/utils/date.util";

interface UserNotificationDetailModalProps {
  open: boolean;
  item: NotificationItemResponse | null;
  onClose: () => void;
}

export function UserNotificationDetailModal({
  open,
  item,
  onClose,
}: UserNotificationDetailModalProps) {
  if (!item) {
    return (
      <InfoModal
        variant="success"
        icon={<Icon name="Noti" color="#fff" size={20} />}
        modalWidth={400}
        open={open}
        closable
        onClose={onClose}
        title="알림 상세 정보"
        centered
      >
        <DataErrorState />
      </InfoModal>
    );
  }

  return (
    <InfoModal
      variant="success"
      icon={<Icon name="Noti" color="#fff" size={20} />}
      modalWidth={400}
      open={open}
      closable
      onClose={onClose}
      title="알림 상세 정보"
      centered
    >
      <ContentWrapper>
        <DetailRow>
          <DetailLabel>발생일시</DetailLabel>
          <DetailValue>{formatDateTimeSafely(item.createdAt)}</DetailValue>
        </DetailRow>
        <DetailRow>
          <DetailLabel>내용</DetailLabel>
        </DetailRow>
        <ContentText>{item.notificationContent}</ContentText>
      </ContentWrapper>
    </InfoModal>
  );
}
