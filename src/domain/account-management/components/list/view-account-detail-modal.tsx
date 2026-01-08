"use client";

import { useState } from "react";
import styled from "styled-components";
import { Icon, Modal, Typography } from "xiilab-ui";

import { useGetAccountDetail } from "@/api/generated/admin-account/admin-account";
import { getAccountStatusLabelFromBoolean } from "@/domain/account-management/constants/account.constant";
import { openViewAccountDetailModalAtom } from "@/domain/account-management/state/account.atom";
import { ACCOUNT_EVENTS } from "@/shared/constants/pubsub.constant";
import { ACCOUNT_SELECTOR } from "@/shared/constants/selector.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { usePublish, useSubscribe } from "@/shared/hooks/use-pub-sub";
import { formatDateSafely } from "@/shared/utils/date.util";

export function ViewAccountDetailModal() {
  const { open, onOpen, onClose } = useGlobalModal(
    openViewAccountDetailModalAtom,
  );
  const [accountId, setAccountId] = useState<string>("");
  const publish = usePublish();

  const { data: accountDetail, isFetching: isFetchingAccountDetail } =
    useGetAccountDetail(accountId, {
      query: {
        enabled: open && !!accountId,
      },
    });

  useSubscribe<string>(
    ACCOUNT_EVENTS.sendViewAccountDetail,
    (nextAccountId) => {
      setAccountId(nextAccountId);
      onOpen();
    },
  );

  const handleClose = () => {
    onClose();
    setAccountId("");
  };

  const handleUpdate = () => {
    if (!accountId || isFetchingAccountDetail) return;
    handleClose();
    publish(ACCOUNT_EVENTS.sendUpdateAccount, accountId);
  };

  return (
    <Modal
      type="primary"
      icon={<Icon name="Description" color="#fff" size={20} />}
      modalWidth={370}
      open={open}
      closable
      title="계정 상세 정보"
      showCancelButton
      cancelText="취소"
      onCancel={handleClose}
      okText="수정"
      onOk={handleUpdate}
      centered
      showHeaderBorder
      okButtonProps={{ disabled: isFetchingAccountDetail || !accountDetail }}
    >
      <Container>
        <DetailCard>
          <SectionTitle>상세 정보</SectionTitle>
          <DetailRow>
            <DetailLabel>이름</DetailLabel>
            <DetailValue data-testid={ACCOUNT_SELECTOR.DETAIL_NAME}>
              {accountDetail?.accountName || "-"}
            </DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>이메일</DetailLabel>
            <DetailValue data-testid={ACCOUNT_SELECTOR.DETAIL_EMAIL}>
              {accountDetail?.email || "-"}
            </DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>그룹</DetailLabel>
            <DetailValue data-testid={ACCOUNT_SELECTOR.DETAIL_GROUP}>
              {accountDetail?.groupName?.length
                ? accountDetail.groupName.join(", ")
                : "-"}
            </DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>상태</DetailLabel>
            <DetailValue data-testid={ACCOUNT_SELECTOR.DETAIL_STATUS}>
              {accountDetail?.isEnabled != null
                ? getAccountStatusLabelFromBoolean(accountDetail.isEnabled)
                : "-"}
            </DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>권한</DetailLabel>
            <DetailValue data-testid={ACCOUNT_SELECTOR.DETAIL_ROLE}>
              {accountDetail?.accountRole || "-"}
            </DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>가입일</DetailLabel>
            <DetailValue data-testid={ACCOUNT_SELECTOR.DETAIL_CREATED_AT}>
              {formatDateSafely(accountDetail?.createdAt)}
            </DetailValue>
          </DetailRow>

          <Divider />

          <SectionTitle>워크스페이스 정보</SectionTitle>
          <DetailRow>
            <DetailLabel>보유 개수</DetailLabel>
            <DetailValue data-testid={ACCOUNT_SELECTOR.DETAIL_WORKSPACE_COUNT}>
              {(accountDetail?.workspaceCount ?? 0).toLocaleString()}개
            </DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>생성 제한 개수</DetailLabel>
            <DetailValue data-testid={ACCOUNT_SELECTOR.DETAIL_WORKSPACE_LIMIT}>
              {(accountDetail?.workspaceLimitCount ?? 0).toLocaleString()}개
            </DetailValue>
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
