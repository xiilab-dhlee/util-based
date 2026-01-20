"use client";

import { useState } from "react";
import styled from "styled-components";
import { Icon, InfoModal } from "xiilab-ui";

import type { GetPrivateRegistryListImageSourceType } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { PrivateRegistryTypeCard } from "@/domain/private-registry/components/private-registry-type-card";
import { IMAGE_SOURCE_TYPE_OPTIONS } from "@/domain/private-registry/constants/private-registry.constant";
import { PRIVATE_REGISTRY_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish, useSubscribe } from "@/shared/hooks/use-pub-sub";

export function SelectPrivateRegistryTypeModal() {
  const [open, setOpen] = useState(false);
  const publish = usePublish();

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickType = (type: GetPrivateRegistryListImageSourceType) => {
    publish(PRIVATE_REGISTRY_EVENTS.sendPrivateRegistryType, type);
    handleClose();
  };

  useSubscribe(PRIVATE_REGISTRY_EVENTS.sendSelectPrivateRegistryType, () => {
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
          <PrivateRegistryTypeCard
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
