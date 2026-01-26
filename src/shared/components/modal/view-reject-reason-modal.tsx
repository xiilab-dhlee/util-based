"use client";

import { useState } from "react";
import { Icon, InfoModal } from "xiilab-ui";

import { COMMON_EVENTS } from "@/shared/constants/pubsub.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";
import { ModalDisplayReason } from "@/styles/layers/modal-layers.styled";

interface RejectReasonPayload {
  reason?: string;
}

export function ViewRejectReasonModal() {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<string>("");

  const handleClose = () => {
    setOpen(false);
  };

  useSubscribe<RejectReasonPayload>(
    COMMON_EVENTS.openRejectReasonModal,
    (payload) => {
      setReason(payload.reason || "");
      setOpen(true);
    },
  );

  return (
    <InfoModal
      type="danger"
      modalWidth={300}
      icon={<Icon name="AllowRequest" color="#fff" size={18} />}
      open={open}
      closable
      onClose={handleClose}
      title="반려 사유"
      centered
    >
      <ModalDisplayReason>{reason || "-"}</ModalDisplayReason>
    </InfoModal>
  );
}
