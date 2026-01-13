"use client";

import styled from "styled-components";
import { Icon, InfoModal } from "xiilab-ui";

import { PrivateRegistryTypeCard } from "@/domain/private-registry/components/private-registry-type-card";
import {
  PRIVATE_REGISTRY_TYPE_OPTIONS,
  type PrivateRegistryType,
} from "@/domain/private-registry/constants/private-registry.constant";
import { openSelectPrivateRegistryTypeModalAtom } from "@/domain/private-registry/state/private-registry.atom";
import { PRIVATE_REGISTRY_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { usePublish } from "@/shared/hooks/use-pub-sub";

export function SelectPrivateRegistryTypeModal() {
  const publish = usePublish();

  const { open, onClose } = useGlobalModal(
    openSelectPrivateRegistryTypeModalAtom,
  );

  const handleClickType = (type: PrivateRegistryType) => {
    publish(PRIVATE_REGISTRY_EVENTS.sendType, type);
    onClose();
  };

  return (
    <InfoModal
      modalWidth={580}
      type="primary"
      icon={<Icon name="Plus" color="#fff" size={18} />}
      open={open}
      closable
      title="컨테이너 이미지 유형 선택"
      onClose={onClose}
      showHeaderBorder
      centered
    >
      <Container>
        {PRIVATE_REGISTRY_TYPE_OPTIONS.map((item) => (
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
`;
