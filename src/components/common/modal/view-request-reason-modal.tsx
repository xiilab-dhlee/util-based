"use client";

import { useState } from "react";
import { Icon, InfoModal } from "xiilab-ui";

import { openViewRequestReasonModalAtom } from "@/atoms/common/modal.atom";
import pubsubConstants from "@/constants/common/pubsub.constant";
import { useGlobalModal } from "@/hooks/common/use-global-modal";
import { useSubscribe } from "@/hooks/common/use-pub-sub";
import { ModalDisplayReason } from "@/styles/layers/modal-layers.styled";

export function ViewRequestReasonModal() {
  const { open, onOpen, onClose } = useGlobalModal(
    openViewRequestReasonModalAtom,
  );

  const [reason, setReason] = useState<string>("");

  useSubscribe<string>(pubsubConstants.common.sendRequestReason, (reason) => {
    setReason(reason);
    onOpen();
  });

  return (
    <InfoModal
      type="primary"
      modalWidth={300}
      icon={<Icon name="AllowRequest" color="#fff" size={18} />}
      open={open}
      closable
      onClose={onClose}
      title="신청 사유"
      centered
    >
      <ModalDisplayReason>{reason}</ModalDisplayReason>
    </InfoModal>
  );
}

