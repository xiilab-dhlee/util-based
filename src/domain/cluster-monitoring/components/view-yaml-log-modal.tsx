import { Icon, InfoModal } from "xiilab-ui";

import { openYamlLogModalAtom } from "@/domain/monitoring/state/monitoring.atom";
import { WorkloadLogBody } from "@/domain/workload/components/log/workload-log-body";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";

export function ViewYamlLogModal() {
  // 모달 상태 관리
  const { open, onClose } = useGlobalModal(openYamlLogModalAtom);

  return (
    <InfoModal
      modalWidth={800}
      title="YAML"
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
