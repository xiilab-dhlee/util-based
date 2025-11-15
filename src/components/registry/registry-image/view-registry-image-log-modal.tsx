import { Icon, InfoModal } from "xiilab-ui";

import { openRegistryImageLogModalAtom } from "@/atoms/private-registry-image/admin-private-registry-image.atom";
import { WorkloadLogBody } from "@/components/workload/log/workload-log-body";
import { useGlobalModal } from "@/hooks/common/use-global-modal";

export function ViewRegistryImageLogModal() {
  // 모달 상태 관리
  const { open, onClose } = useGlobalModal(openRegistryImageLogModalAtom);

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
