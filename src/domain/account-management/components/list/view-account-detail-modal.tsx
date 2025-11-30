"use client";

import { useState } from "react";
import styled from "styled-components";
import { Icon, Modal, Typography } from "xiilab-ui";

import type { AccountListType } from "@/domain/account-management/schemas/account.schema";
import { openViewAccountDetailModalAtom } from "@/domain/account-management/state/account.atom";
import { ACCOUNT_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { usePublish, useSubscribe } from "@/shared/hooks/use-pub-sub";
import { formatDateSafely } from "@/shared/utils/date.util";

/**
 * 계정 상세 정보 모달 컴포넌트
 */
export function ViewAccountDetailModal() {
  const { open, onOpen, onClose } = useGlobalModal(
    openViewAccountDetailModalAtom,
  );
  const [account, setAccount] = useState<AccountListType | null>(null);
  const publish = usePublish();

  useSubscribe<AccountListType>(
    ACCOUNT_EVENTS.sendViewAccountDetail,
    async (eventData) => {
      setAccount(eventData);
      onOpen();
    },
  );

  const handleUpdate = () => {
    if (account) {
      onClose();
      publish(ACCOUNT_EVENTS.sendUpdateAccount, account);
    }
  };

  return (
    <Modal
      type="primary"
      icon={<Icon name="Edit02" color="#fff" size={20} />}
      modalWidth={370}
      open={open}
      closable
      title="계정 상세 정보"
      showCancelButton
      cancelText="취소"
      onCancel={onClose}
      okText="수정"
      onOk={handleUpdate}
      centered
      showHeaderBorder
    >
      <Container>
        <DetailCard>
          <SectionTitle>상세 정보</SectionTitle>
          <DetailRow>
            <DetailLabel>이름</DetailLabel>
            <DetailValue>{account?.name || "-"}</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>아이디</DetailLabel>
            <DetailValue>{account?.email || "-"}</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>그룹</DetailLabel>
            <DetailValue>{account?.group || "-"}</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>상태</DetailLabel>
            <DetailValue>
              {account?.isEnabled != null
                ? account.isEnabled
                  ? "활성화"
                  : "비활성화"
                : "-"}
            </DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>권한</DetailLabel>
            <DetailValue>{account?.role || "-"}</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>가입일</DetailLabel>
            <DetailValue>{formatDateSafely(account?.createdAt)}</DetailValue>
          </DetailRow>

          <Divider />

          <SectionTitle>워크스페이스 정보</SectionTitle>
          <DetailRow>
            <DetailLabel>보유 개수</DetailLabel>
            <DetailValue>{account?.workspaceCount ?? 0}개</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>생성 제한 개수</DetailLabel>
            <DetailValue>{account?.workspaceLimitCount ?? 0}개</DetailValue>
          </DetailRow>
        </DetailCard>
      </Container>
    </Modal>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const DetailCard = styled.div`
  border-radius: 2px;
  border: 1px solid #e9e9e9;
  background: #fff;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  width: 100%;
`;

const SectionTitle = styled.div`

  font-weight: 600;
  font-size: 14px;
  line-height: 17px;
  color: #000;
`;

const DetailRow = styled.div`
  display: flex;
  align-items: center;
`;

const DetailLabel = styled(Typography.Text).attrs({
  variant: "body-2-2",
})`
  color: #484848;
  min-width: 82px;
  margin-right: 24px;
`;

const DetailValue = styled(Typography.Text).attrs({
  variant: "subtitle-2-3",
})`
  color: #000;
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: #e0e0e0;
  margin: 4px 0;
`;
