"use client";

import { useState } from "react";
import { Icon, InfoModal } from "xiilab-ui";

import { COMMON_EVENTS } from "@/shared/constants/pubsub.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";
import { ModalDisplayReason } from "@/styles/layers/modal-layers.styled";

interface RequestReasonPayload {
  reason?: string;
}

export function ViewRequestReasonModal() {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<string>("");

  const handleClose = () => {
    setOpen(false);
  };

  useSubscribe<RequestReasonPayload>(
    COMMON_EVENTS.openRequestReasonModal,
    (payload) => {
      setReason(payload.reason || "");
      setOpen(true);
    },
  );

  return (
    <InfoModal
      type="primary"
      modalWidth={300}
      icon={<Icon name="AllowRequest" color="#fff" size={20} />}
      open={open}
      closable
      onClose={handleClose}
      title="요청 사유"
      centered
    >
      <ModalDisplayReason>{reason || "-"}</ModalDisplayReason>
    </InfoModal>
  );
}
