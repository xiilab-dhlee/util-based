"use client";

import { useState } from "react";
import { Icon, InfoModal } from "xiilab-ui";

import { useGetCredentialDetail } from "@/api/generated/credential/credential";
import { getCredentialTypeInfo } from "@/domain/credential/constants/credential.constant";
import { DataErrorState } from "@/shared/components/feedback/data-error-state";
import { CREDENTIAL_EVENTS } from "@/shared/constants/pubsub.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";
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

interface Payload {
  accountId: string;
  credentialId: number;
}

export function ViewCredentialDetailModal() {
  const [open, setOpen] = useState(false);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [credentialId, setCredentialId] = useState<number | null>(null);

  const { data, isLoading, isError, refetch } = useGetCredentialDetail(
    accountId ?? "",
    credentialId ?? 0,
    {
      query: {
        enabled: Boolean(accountId) && credentialId !== null,
      },
    },
  );

  const handleClose = () => {
    setOpen(false);
    setAccountId(null);
    setCredentialId(null);
  };

  useSubscribe<Payload>(CREDENTIAL_EVENTS.openDetailModal, (payload) => {
    setAccountId(payload.accountId);
    setCredentialId(payload.credentialId);
    setOpen(true);
  });

  return (
    <InfoModal
      title="크리덴셜 상세"
      type="primary"
      open={open}
      onClose={handleClose}
      modalWidth={370}
      loading={isLoading}
      centered
      showHeaderBorder
      icon={<Icon name="Information" color="#fff" size={20} />}
    >
      {isError ? (
        <DataErrorState onRetry={refetch} />
      ) : (
        <ModalDetailContainer>
          <ModalDetailCard>
            {/* 기본 정보 */}
            <ModalDetailSectionTitle>기본 정보</ModalDetailSectionTitle>
            <ModalDetailRow>
              <ModalDetailLabel>타입</ModalDetailLabel>
              <ModalDetailValue>
                {getCredentialTypeInfo(data?.credentialType).label}
              </ModalDetailValue>
            </ModalDetailRow>
            <ModalDetailRow>
              <ModalDetailLabel>이름</ModalDetailLabel>
              <ModalDetailValue>{data?.credentialName || "-"}</ModalDetailValue>
            </ModalDetailRow>
            <ModalDetailRow>
              <ModalDetailLabel>설명</ModalDetailLabel>
              <ModalDetailValue>{data?.description || "-"}</ModalDetailValue>
            </ModalDetailRow>

            <ModalDetailDivider />

            {/* 설정 내용 */}
            <ModalDetailSectionTitle>설정 내용</ModalDetailSectionTitle>
            <ModalDetailRow>
              <ModalDetailLabel>아이디</ModalDetailLabel>
              <ModalDetailValue>
                {data?.credentialAccountId || "-"}
              </ModalDetailValue>
            </ModalDetailRow>

            <ModalDetailDivider />

            {/* 생성 정보 */}
            <ModalDetailSectionTitle>생성 정보</ModalDetailSectionTitle>
            <ModalDetailRow>
              <ModalDetailLabel>생성자</ModalDetailLabel>
              <ModalDetailValue>{data?.creatorName || "-"}</ModalDetailValue>
            </ModalDetailRow>
            <ModalDetailRow>
              <ModalDetailLabel>생성일</ModalDetailLabel>
              <ModalDetailValue>
                {formatDateSafely(data?.createdAt)}
              </ModalDetailValue>
            </ModalDetailRow>
          </ModalDetailCard>
        </ModalDetailContainer>
      )}
    </InfoModal>
  );
}
