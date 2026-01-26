"use client";

import { Icon, InfoModal } from "xiilab-ui";

import type { AdminNotificationItemResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  ContentText,
  ContentWrapper,
  DetailLabel,
  DetailRow,
  DetailValue,
} from "@/domain/notification/components/profile/notification-detail-modal.styles";
import { DataErrorState } from "@/shared/components/feedback/data-error-state";
import {
  getAdminNotificationSetLabel,
  getNotificationTypeLabel,
} from "@/shared/constants/notification";
import { formatDateTimeSafely } from "@/shared/utils/date.util";

interface AdminNotificationDetailModalProps {
  open: boolean;
  item: AdminNotificationItemResponse | null;
  onClose: () => void;
}

export function AdminNotificationDetailModal({
  open,
  item,
  onClose,
}: AdminNotificationDetailModalProps) {
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
          <DetailLabel>알림 유형</DetailLabel>
          <DetailValue>
            {getNotificationTypeLabel(item.notificationType)}
          </DetailValue>
        </DetailRow>
        <DetailRow>
          <DetailLabel>발생일시</DetailLabel>
          <DetailValue>{formatDateTimeSafely(item.createdAt)}</DetailValue>
        </DetailRow>
        <DetailRow>
          <DetailLabel>알림 이름</DetailLabel>
          <DetailValue>
            {getAdminNotificationSetLabel(item.notificationSetName)}
          </DetailValue>
        </DetailRow>
        <DetailRow>
          <DetailLabel>내용</DetailLabel>
        </DetailRow>
        <ContentText>{item.notificationContent}</ContentText>
      </ContentWrapper>
    </InfoModal>
  );
}
