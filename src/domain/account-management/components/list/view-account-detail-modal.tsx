"use client";

import { useState } from "react";
import { Icon, Modal } from "xiilab-ui";

import { useGetAccountDetail } from "@/api/generated/admin-account-management/admin-account-management";
import { getAccountStatusLabelFromBoolean } from "@/domain/account-management/constants/account.constant";
import { openViewAccountDetailModalAtom } from "@/domain/account-management/state/account.atom";
import { ACCOUNT_EVENTS } from "@/shared/constants/pubsub.constant";
import { ACCOUNT_SELECTOR } from "@/shared/constants/selector.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { usePublish, useSubscribe } from "@/shared/hooks/use-pub-sub";
import { formatDateSafely } from "@/shared/utils/date.util";
import {
  ModalDetailCard,
  ModalDetailContainer,
  ModalDetailDivider,
  ModalDetailLabel,
  ModalDetailRow,
  ModalDetailSectionTitle,
  ModalDetailValue,
} from "@/styles/layers/modal-detail-layers.styled";

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
      <ModalDetailContainer>
        <ModalDetailCard>
          <ModalDetailSectionTitle>상세 정보</ModalDetailSectionTitle>
          <ModalDetailRow>
            <ModalDetailLabel>이름</ModalDetailLabel>
            <ModalDetailValue data-testid={ACCOUNT_SELECTOR.DETAIL_NAME}>
              {accountDetail?.accountName || "-"}
            </ModalDetailValue>
          </ModalDetailRow>
          <ModalDetailRow>
            <ModalDetailLabel>이메일</ModalDetailLabel>
            <ModalDetailValue data-testid={ACCOUNT_SELECTOR.DETAIL_EMAIL}>
              {accountDetail?.email || "-"}
            </ModalDetailValue>
          </ModalDetailRow>
          <ModalDetailRow>
            <ModalDetailLabel>그룹</ModalDetailLabel>
            <ModalDetailValue data-testid={ACCOUNT_SELECTOR.DETAIL_GROUP}>
              {accountDetail?.groupName?.length
                ? accountDetail.groupName.join(", ")
                : "-"}
            </ModalDetailValue>
          </ModalDetailRow>
          <ModalDetailRow>
            <ModalDetailLabel>상태</ModalDetailLabel>
            <ModalDetailValue data-testid={ACCOUNT_SELECTOR.DETAIL_STATUS}>
              {accountDetail?.isEnabled != null
                ? getAccountStatusLabelFromBoolean(accountDetail.isEnabled)
                : "-"}
            </ModalDetailValue>
          </ModalDetailRow>
          <ModalDetailRow>
            <ModalDetailLabel>권한</ModalDetailLabel>
            <ModalDetailValue data-testid={ACCOUNT_SELECTOR.DETAIL_ROLE}>
              {accountDetail?.accountRole || "-"}
            </ModalDetailValue>
          </ModalDetailRow>
          <ModalDetailRow>
            <ModalDetailLabel>가입일</ModalDetailLabel>
            <ModalDetailValue data-testid={ACCOUNT_SELECTOR.DETAIL_CREATED_AT}>
              {formatDateSafely(accountDetail?.createdAt)}
            </ModalDetailValue>
          </ModalDetailRow>

          <ModalDetailDivider />

          <ModalDetailSectionTitle>워크스페이스 정보</ModalDetailSectionTitle>
          <ModalDetailRow>
            <ModalDetailLabel>생성 개수</ModalDetailLabel>
            <ModalDetailValue
              data-testid={ACCOUNT_SELECTOR.DETAIL_WORKSPACE_COUNT}
            >
              {(accountDetail?.workspaceCount ?? 0).toLocaleString()}개
            </ModalDetailValue>
          </ModalDetailRow>
          <ModalDetailRow>
            <ModalDetailLabel>생성 제한 개수</ModalDetailLabel>
            <ModalDetailValue
              data-testid={ACCOUNT_SELECTOR.DETAIL_WORKSPACE_LIMIT}
            >
              {(accountDetail?.workspaceLimitCount ?? 0).toLocaleString()}개
            </ModalDetailValue>
          </ModalDetailRow>
        </ModalDetailCard>
      </ModalDetailContainer>
    </Modal>
  );
}
