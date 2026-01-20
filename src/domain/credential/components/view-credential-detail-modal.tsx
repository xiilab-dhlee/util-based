"use client";

import { useState } from "react";
import styled from "styled-components";
import { Icon, InfoModal, Typography } from "xiilab-ui";

import { useGetCredentialDetail } from "@/api/generated/credential/credential";
import { getCredentialTypeInfo } from "@/domain/credential/constants/credential.constant";
import { DataErrorState } from "@/shared/components/feedback/data-error-state";
import { CREDENTIAL_EVENTS } from "@/shared/constants/pubsub.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";
import { formatDateSafely } from "@/shared/utils/date.util";

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
        <Container>
          <DetailCard>
            {/* 기본 정보 */}
            <SectionTitle>기본 정보</SectionTitle>
            <DetailRow>
              <DetailLabel>타입</DetailLabel>
              <DetailValue>
                {getCredentialTypeInfo(data?.credentialType).label}
              </DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>이름</DetailLabel>
              <DetailValue>{data?.credentialName || "-"}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>설명</DetailLabel>
              <DetailValue>{data?.description || "-"}</DetailValue>
            </DetailRow>

            <Divider />

            {/* 설정 내용 */}
            <SectionTitle>설정 내용</SectionTitle>
            <DetailRow>
              <DetailLabel>아이디</DetailLabel>
              <DetailValue>{data?.credentialAccountId || "-"}</DetailValue>
            </DetailRow>

            <Divider />

            {/* 생성 정보 */}
            <SectionTitle>생성 정보</SectionTitle>
            <DetailRow>
              <DetailLabel>생성자</DetailLabel>
              <DetailValue>{data?.creatorName || "-"}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>생성일</DetailLabel>
              <DetailValue>
                {formatDateSafely(data?.createDateTime)}
              </DetailValue>
            </DetailRow>
          </DetailCard>
        </Container>
      )}
    </InfoModal>
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
  word-break: break-all;
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: #e0e0e0;
  margin: 4px 0;
`;
