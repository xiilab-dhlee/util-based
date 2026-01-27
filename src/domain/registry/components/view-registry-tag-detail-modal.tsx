"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import styled from "styled-components";
import { Icon, Modal } from "xiilab-ui";

import type { ImageTagListResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  DetailLabel,
  DetailRow,
  DetailValue,
} from "@/domain/registry/components/shared/detail-row.styles";
import { useGetRegistryTagDetailByMode } from "@/domain/registry/hooks/use-get-registry-tag-detail-by-mode";
import type { RegistryMode } from "@/domain/registry/types/registry.type";
import { ScanStatusText } from "@/shared/components/text/scan-status-text";
import { VulnerabilityTooltip } from "@/shared/components/tooltip/vulnerability-tooltip";
import { REGISTRY_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish, useSubscribe } from "@/shared/hooks/use-pub-sub";
import {
  checkIsSuperAdmin,
  getSessionAccountId,
} from "@/shared/utils/auth.util";
import { formatDateTimeSafely } from "@/shared/utils/date.util";
import { formatFileSize } from "@/shared/utils/file.util";

interface TagDetailPayload extends ImageTagListResponse {
  harborImageName: string;
}

interface ViewRegistryTagDetailModalProps {
  mode: RegistryMode;
}

export function ViewRegistryTagDetailModal({
  mode,
}: ViewRegistryTagDetailModalProps) {
  const { data: session } = useSession();
  const publish = usePublish();

  const [open, setOpen] = useState(false);
  const [payload, setPayload] = useState<TagDetailPayload | null>(null);

  const { data, isFetching } = useGetRegistryTagDetailByMode(
    mode,
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

  // 생성자 또는 슈퍼 관리자인 경우 수정 가능
  const sessionAccountId = getSessionAccountId(session);
  const isOwner = data?.creatorId === sessionAccountId;
  const isSuperAdmin = checkIsSuperAdmin(session);
  const canEdit = !!session && (isOwner || isSuperAdmin);

  const handleClose = () => {
    setOpen(false);
    setPayload(null);
  };

  const handleOk = () => {
    if (canEdit && data) {
      // 수정 모달 열기
      publish(REGISTRY_EVENTS.openEditTagModal, {
        tagId: data.imageTagId,
        tagName: data.imageTagName,
        harborImageName: payload?.harborImageName,
        description: data.description,
      });
    }
    handleClose();
  };

  useSubscribe<TagDetailPayload>(
    REGISTRY_EVENTS.openTagDetailModal,
    (eventData) => {
      setPayload(eventData);
      setOpen(true);
    },
  );

  return (
    <Modal
      type="primary"
      icon={<Icon name="Description" color="#fff" size={20} />}
      modalWidth={400}
      open={open}
      closable
      title="컨테이너 이미지 태그 상세 정보"
      showCancelButton
      okText={canEdit ? "수정" : "확인"}
      onOk={handleOk}
      onCancel={handleClose}
      centered
      showHeaderBorder
      loading={isFetching}
    >
      <Container>
        <DetailCard>
          <SectionTitle>기본 정보</SectionTitle>
          <DetailRow>
            <DetailLabel $minWidth="100px">태그명</DetailLabel>
            <DetailValue>{data?.imageTagName || "-"}</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel $minWidth="100px">이미지 크기</DetailLabel>
            <DetailValue>
              {data?.imageSizeByte
                ? formatFileSize(data.imageSizeByte).formatted
                : "-"}
            </DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel $minWidth="100px">설명</DetailLabel>
            <DetailValue>{data?.description || "-"}</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel $minWidth="100px">생성자</DetailLabel>
            <DetailValue>{data?.creatorName || "-"}</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel $minWidth="100px">생성일시</DetailLabel>
            <DetailValue>{formatDateTimeSafely(data?.createdAt)}</DetailValue>
          </DetailRow>

          <Divider />

          <SectionTitle>보안 검사 정보</SectionTitle>
          <DetailRow>
            <DetailLabel $minWidth="100px">검사 상태</DetailLabel>
            <DetailValue>
              <ScanStatusText status={data?.scanStatus} />
            </DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel $minWidth="100px">검사 결과</DetailLabel>
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

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: #e0e0e0;
  margin: 4px 0;
`;
