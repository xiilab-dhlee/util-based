"use client";

import { useState } from "react";
import styled from "styled-components";
import { Icon, InfoModal } from "xiilab-ui";

import {
  GetPrivateRegistryListImageSourceType,
  type GetPrivateRegistryListImageSourceType as ImageSourceType,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { RegistryTypeCard } from "@/domain/registry/components/registry-type-card";
import { IMAGE_SOURCE_TYPE_OPTIONS } from "@/domain/registry/constants/registry-list.constant";
import { REGISTRY_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish, useSubscribe } from "@/shared/hooks/use-pub-sub";

export function SelectRegistryTypeModal() {
  const [open, setOpen] = useState(false);
  const publish = usePublish();

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickType = (type: ImageSourceType) => {
    handleClose();

    if (type === GetPrivateRegistryListImageSourceType.SNAPSHOT) {
      publish(REGISTRY_EVENTS.openCreateSnapshotModal);
    } else {
      publish(REGISTRY_EVENTS.openCreateModal);
    }
  };

  useSubscribe<void>(REGISTRY_EVENTS.openSelectTypeModal, () => {
    setOpen(true);
  });

  return (
    <InfoModal
      modalWidth={580}
      type="primary"
      icon={<Icon name="Plus" color="#fff" size={18} />}
      open={open}
      closable
      title="컨테이너 이미지 유형 선택"
      onClose={handleClose}
      showHeaderBorder
      centered
    >
      <Container>
        {IMAGE_SOURCE_TYPE_OPTIONS.map((item) => (
          <RegistryTypeCard
            key={item.value}
            type={item.value}
            onClick={() => handleClickType(item.value)}
          />
        ))}
      </Container>
    </InfoModal>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
`;
