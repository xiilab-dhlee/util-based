"use client";

import { useState } from "react";
import styled from "styled-components";
import { Icon, InfoModal } from "xiilab-ui";

import { VolumeStorageCard } from "@/domain/volume/components/list/volume-storage-card";
import { VOLUME_STORAGE_OPTIONS } from "@/domain/volume/constants/volume.constant";
import { VOLUME_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish, useSubscribe } from "@/shared/hooks/use-pub-sub";

export function SelectVolumeTypeModal() {
  const publish = usePublish();
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickStorageType = (type: string) => {
    handleClose();
    if (type === "ASTRAGO") {
      publish(VOLUME_EVENTS.openCreateAstragoModal);
    } else if (type === "ON_PREMISE") {
      publish(VOLUME_EVENTS.openCreateOnPremModal);
    }
  };

  useSubscribe(VOLUME_EVENTS.openSelectStorageTypeModal, () => {
    setOpen(true);
  });

  return (
    <InfoModal
      modalWidth={580}
      type="primary"
      icon={<Icon name="Volume" color="#fff" size={18} />}
      open={open}
      closable
      title="스토리지 타입 선택"
      onClose={handleClose}
      showHeaderBorder
      centered
    >
      <Container>
        {VOLUME_STORAGE_OPTIONS.map((item) => (
          <VolumeStorageCard
            key={item.value}
            storageType={item.value as string}
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
