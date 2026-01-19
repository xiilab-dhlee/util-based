import { Icon, InfoModal } from "xiilab-ui";

import { openPrivateRegistryLogModalAtom } from "@/domain/private-registry/state/private-registry.atom";
import { WorkloadLogBody } from "@/domain/workload/components/log/workload-log-body";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";

export function ViewPrivateRegistryLogModal() {
  const { open, onClose } = useGlobalModal(openPrivateRegistryLogModalAtom);

  return (
    <InfoModal
      modalWidth={800}
      title="로그"
      icon={<Icon name="SourceCode" color="#fff" size={20} />}
      open={open}
      closable
      onClose={onClose}
      centered
    >
      <div style={{ height: 600 }}>
        <WorkloadLogBody />
      </div>
    </InfoModal>
  );
}
