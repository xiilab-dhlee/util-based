"use client";

import { useState } from "react";
import { Icon, InfoModal } from "xiilab-ui";

import { WorkloadLogBody } from "@/domain/workload/components/log/workload-log-body";
import { REGISTRY_EVENTS } from "@/shared/constants/pubsub.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

export function ViewRegistryLogModal() {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  useSubscribe<void>(REGISTRY_EVENTS.openLogModal, () => {
    setOpen(true);
  });

  return (
    <InfoModal
      modalWidth={800}
      title="로그"
      icon={<Icon name="SourceCode" color="#fff" size={20} />}
      open={open}
      closable
      onClose={handleClose}
      centered
    >
      <div style={{ height: 600 }}>
        <WorkloadLogBody />
      </div>
    </InfoModal>
  );
}
