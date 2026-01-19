"use client";

import { useState } from "react";
import styled from "styled-components";
import { Icon, Modal, Typography } from "xiilab-ui";

import type { ImageTagListResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { useGetPrivateImageTagDetail } from "@/api/generated/private-registry/private-registry";
import { openViewPrivateRegistryTagDetailModalAtom } from "@/domain/private-registry/state/private-registry-tag.atom";
import { ScanStatusText } from "@/shared/components/text/scan-status-text";
import { VulnerabilityTooltip } from "@/shared/components/tooltip/vulnerability-tooltip";
import { PRIVATE_REGISTRY_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";
import { formatDateTimeSafely } from "@/shared/utils/date.util";
import { formatFileSize } from "@/shared/utils/file.util";

interface TagDetailEventData extends ImageTagListResponse {
  harborImageName: string;
}

export function ViewPrivateRegistryTagDetailModal() {
  const { open, onOpen, onClose } = useGlobalModal(
    openViewPrivateRegistryTagDetailModalAtom,
  );
  const [payload, setPayload] = useState<TagDetailEventData | null>(null);

  const { data, isFetching } = useGetPrivateImageTagDetail(
    {
      harborImageName: payload?.harborImageName ?? "",
      tagName: payload?.imageTagName ?? "",
    },
    {
      query: {
        enabled: open && !!payload?.harborImageName && !!payload?.imageTagName,
      },
    },
  );

  const handleClose = () => {
    onClose();
    setPayload(null);
  };

  useSubscribe<TagDetailEventData>(
    PRIVATE_REGISTRY_EVENTS.sendViewTagDetail,
    (data) => {
      setPayload(data);
      onOpen();
    },
  );

  return (
    <Modal
      type="primary"
      icon={<Icon name="Description" color="#fff" size={20} />}
      modalWidth={400}
      open={open}
      closable
      title="태그 상세 정보"
      showCancelButton
      okText="확인"
      onOk={handleClose}
      onCancel={handleClose}
      centered
      showHeaderBorder
      loading={isFetching}
    >
      <Container>
        <DetailCard>
          <SectionTitle>기본 정보</SectionTitle>
          <DetailRow>
            <DetailLabel>태그명</DetailLabel>
            <DetailValue>{data?.imageTagName || "-"}</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>이미지 크기</DetailLabel>
            <DetailValue>
              {data?.imageSizeByte
                ? formatFileSize(data.imageSizeByte).formatted
                : "-"}
            </DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>생성자</DetailLabel>
            <DetailValue>{data?.creatorName || "-"}</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>생성일시</DetailLabel>
            <DetailValue>{formatDateTimeSafely(data?.createdAt)}</DetailValue>
          </DetailRow>

          <Divider />

          <SectionTitle>보안 검사 정보</SectionTitle>
          <DetailRow>
            <DetailLabel>검사 상태</DetailLabel>
            <DetailValue>
              <ScanStatusText status={data?.scanStatus} />
            </DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>검사 결과</DetailLabel>
            <DetailValue>
              {data?.vulnerability ? (
                <VulnerabilityTooltip
                  critical={data.vulnerability.criticalCount ?? 0}
                  high={data.vulnerability.highCount ?? 0}
                  medium={data.vulnerability.mediumCount ?? 0}
                  low={data.vulnerability.lowCount ?? 0}
                />
              ) : (
                "-"
              )}
            </DetailValue>
          </DetailRow>
          {/* <DetailRow>
            <DetailLabel>최근 검사일시</DetailLabel>
            <DetailValue>{formatDateTimeSafely(data?.createdAt)}</DetailValue>
          </DetailRow> */}
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
  min-width: 100px;
  margin-right: 16px;
`;

const DetailValue = styled(Typography.Text).attrs({
  variant: "subtitle-2-3",
})`
  color: #000;
  flex: 1;
  word-break: break-all;
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: #e0e0e0;
  margin: 4px 0;
`;
