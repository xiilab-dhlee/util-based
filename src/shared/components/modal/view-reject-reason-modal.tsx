"use client";

import { useState } from "react";
import { Icon, InfoModal } from "xiilab-ui";

import { COMMON_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";
import { openViewRejectReasonModalAtom } from "@/shared/state/modal.atom";
import { ModalDisplayReason } from "@/styles/layers/modal-layers.styled";

export function ViewRejectReasonModal() {
  const { open, onOpen, onClose } = useGlobalModal(
    openViewRejectReasonModalAtom,
  );

  const [reason, setReason] = useState<string>("");

  useSubscribe<string>(COMMON_EVENTS.sendRejectReason, (reason) => {
    setReason(reason);
    onOpen();
  });

  return (
    <InfoModal
      type="danger"
      modalWidth={300}
      icon={<Icon name="AllowRequest" color="#fff" size={18} />}
      open={open}
      closable
      onClose={onClose}
      title="반려 사유"
      centered
    >
      <ModalDisplayReason>{reason}</ModalDisplayReason>
    </InfoModal>
  );
}
