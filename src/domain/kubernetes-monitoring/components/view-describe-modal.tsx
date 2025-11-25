import { Icon, InfoModal } from "xiilab-ui";

import { openKubernetesDescribeModalAtom } from "@/domain/kubernetes-monitoring/atom/kubernetes-monitoring.atom";
import { WorkloadLogBody } from "@/domain/workload/components/log/workload-log-body";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";

export function ViewDescribeModal() {
  const { open, onClose } = useGlobalModal(openKubernetesDescribeModalAtom);

  return (
    <InfoModal
      modalWidth={800}
      title="Describe"
      icon={<Icon name="Terminal" color="#fff" size={20} />}
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
