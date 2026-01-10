"use client";

import { Icon, Modal } from "xiilab-ui";

import { openOwnerTransferRequiredModalAtom } from "@/domain/workspace/state/workspace.atom";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";

export function OwnerTransferRequiredModal() {
  const { open, onClose } = useGlobalModal(openOwnerTransferRequiredModalAtom);

  return (
    <Modal
      variant="confirm"
      type="danger"
      modalWidth={340}
      icon={<Icon name="Error" color="#fff" size={18} />}
      open={open}
      closable
      onOk={onClose}
      title="권한 부여 필요"
      okText="확인"
      centered
    >
      워크스페이스를 나가기 위해서는 다른 구성원에게
      <br />
      Owner 권한을 부여해야 합니다.
    </Modal>
  );
}
