"use client";

import styled from "styled-components";
import { Icon, InfoModal } from "xiilab-ui";

import { VolumeStorageCard } from "@/domain/volume/components/volume-storage-card";
import { VOLUME_STORAGE_OPTIONS } from "@/domain/volume/constants/volume.constant";
import type { VolumeStorageType } from "@/domain/volume/schemas/volume.schema";
import { openSelectVolumeModalAtom } from "@/domain/volume/state/volume.atom";
import { VOLUME_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { usePublish } from "@/shared/hooks/use-pub-sub";

export function SelectVolumeTypeModal() {
  const publish = usePublish();

  const { open, onClose } = useGlobalModal(openSelectVolumeModalAtom);

  const handleClickStorageType = (type: string) => {
    publish(VOLUME_EVENTS.sendStorageType, type);
    onClose();
  };

  return (
    <InfoModal
      modalWidth={580}
      type="primary"
      icon={<Icon name="Folder" color="#fff" size={18} />}
      open={open}
      closable
      title="볼륨 선택"
      onClose={onClose}
      showHeaderBorder
      centered
    >
      <Container>
        {VOLUME_STORAGE_OPTIONS.map((item) => (
          <VolumeStorageCard
            key={item.value}
            storageType={item.value as VolumeStorageType}
            onClick={handleClickStorageType}
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
