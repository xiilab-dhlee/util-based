import { InfoModal } from "xiilab-ui";

import { openYamlLogModalAtom } from "@/atoms/monitoring/cluster-monitoring.atom";
import { WorkloadLogBody } from "@/components/workload/log/workload-log-body";
import { useGlobalModal } from "@/hooks/common/use-global-modal";
import { MyIcon } from "../common/icon";

export function ViewYamlLogModal() {
  // 모달 상태 관리
  const { open, onClose } = useGlobalModal(openYamlLogModalAtom);

  return (
    <InfoModal
      modalWidth={800}
      title="YAML"
      icon={<MyIcon name="Terminal" color="#fff" size={20} />}
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
