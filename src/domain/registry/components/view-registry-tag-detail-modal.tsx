"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { Icon, Modal } from "xiilab-ui";

import type { ImageTagListResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
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
import {
  ModalDetailCard,
  ModalDetailContainer,
  ModalDetailDivider,
  ModalDetailLabel,
  ModalDetailRow,
  ModalDetailSectionTitle,
  ModalDetailValue,
} from "@/styles/layers/modal-detail-layers.styled";

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
      <ModalDetailContainer>
        <ModalDetailCard>
          <ModalDetailSectionTitle>기본 정보</ModalDetailSectionTitle>
          <ModalDetailRow>
            <ModalDetailLabel $minWidth="100px">태그명</ModalDetailLabel>
            <ModalDetailValue>{data?.imageTagName || "-"}</ModalDetailValue>
          </ModalDetailRow>
          <ModalDetailRow>
            <ModalDetailLabel $minWidth="100px">이미지 크기</ModalDetailLabel>
            <ModalDetailValue>
              {data?.imageSizeByte
                ? formatFileSize(data.imageSizeByte).formatted
                : "-"}
            </ModalDetailValue>
          </ModalDetailRow>
          <ModalDetailRow>
            <ModalDetailLabel $minWidth="100px">설명</ModalDetailLabel>
            <ModalDetailValue>{data?.description || "-"}</ModalDetailValue>
          </ModalDetailRow>
          <ModalDetailRow>
            <ModalDetailLabel $minWidth="100px">생성자</ModalDetailLabel>
            <ModalDetailValue>{data?.creatorName || "-"}</ModalDetailValue>
          </ModalDetailRow>
          <ModalDetailRow>
            <ModalDetailLabel $minWidth="100px">생성일시</ModalDetailLabel>
            <ModalDetailValue>
              {formatDateTimeSafely(data?.createdAt)}
            </ModalDetailValue>
          </ModalDetailRow>

          <ModalDetailDivider />

          <ModalDetailSectionTitle>보안 검사 정보</ModalDetailSectionTitle>
          <ModalDetailRow>
            <ModalDetailLabel $minWidth="100px">검사 상태</ModalDetailLabel>
            <ModalDetailValue>
              <ScanStatusText status={data?.scanStatus} />
            </ModalDetailValue>
          </ModalDetailRow>
          <ModalDetailRow>
            <ModalDetailLabel $minWidth="100px">검사 결과</ModalDetailLabel>
            <ModalDetailValue>
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
            </ModalDetailValue>
          </ModalDetailRow>
        </ModalDetailCard>
      </ModalDetailContainer>
    </Modal>
  );
}
