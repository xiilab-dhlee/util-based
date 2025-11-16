import { Icon, InfoModal } from "xiilab-ui";

import { openPrivateRegistryImageTagLogModalAtom } from "@/atoms/private-registry-image/private-registry-image.atom";
import { WorkloadLogBody } from "@/components/workload/log/workload-log-body";
import { useGlobalModal } from "@/hooks/common/use-global-modal";

export function ViewPrivateRegistryImageTagLogModal() {
  const { open, onClose } = useGlobalModal(
    openPrivateRegistryImageTagLogModalAtom,
  );

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
