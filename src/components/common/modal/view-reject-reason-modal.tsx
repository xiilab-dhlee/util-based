"use client";

import { useState } from "react";
import { Icon, InfoModal } from "xiilab-ui";
import { COMMON_EVENTS } from "@/constants/common/pubsub.constant";

import { openViewRejectReasonModalAtom } from "@/atoms/common/modal.atom";
import { COMMON_EVENTS } from "@/constants/common/pubsub.constant";

import { useGlobalModal } from "@/hooks/common/use-global-modal";
import { useSubscribe } from "@/hooks/common/use-pub-sub";
import { ModalDisplayReason } from "@/styles/layers/modal-layers.styled";
import { COMMON_EVENTS } from "@/constants/common/pubsub.constant";

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

