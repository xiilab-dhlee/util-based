"use client";

import { useState } from "react";
import { Icon, InfoModal } from "xiilab-ui";

import { COMMON_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";
import { openViewRequestReasonModalAtom } from "@/shared/state/modal.atom";
import { ModalDisplayReason } from "@/styles/layers/modal-layers.styled";

export function ViewRequestReasonModal() {
  const { open, onOpen, onClose } = useGlobalModal(
    openViewRequestReasonModalAtom,
  );

  const [reason, setReason] = useState<string>("");

  useSubscribe<string>(COMMON_EVENTS.sendRequestReason, (reason) => {
    setReason(reason);
    onOpen();
  });

  return (
    <InfoModal
      type="primary"
      modalWidth={300}
      icon={<Icon name="AllowRequest" color="#fff" size={20} />}
      open={open}
      closable
      onClose={onClose}
      title="요청 사유"
      centered
    >
      <ModalDisplayReason>{reason}</ModalDisplayReason>
    </InfoModal>
  );
}
