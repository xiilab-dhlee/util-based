"use client";

import { Icon, InfoModal } from "xiilab-ui";

interface GroupHasMembersModalProps {
  open: boolean;
  onClose: () => void;
}

/**
 * 그룹에 멤버가 존재하여 삭제할 수 없을 때 표시되는 모달
 */
export function GroupHasMembersModal({
  open,
  onClose,
}: GroupHasMembersModalProps) {
  return (
    <InfoModal
      type="danger"
      icon={<Icon name="Error" color="#fff" size={20} />}
      modalWidth={300}
      open={open}
      onClose={onClose}
      title="그룹 삭제 불가"
      centered
    >
      해당 그룹에 속한 사용자들이 존재합니다.
      <br />
      사용자들을 먼저 다른 그룹으로 이동해 주세요.
    </InfoModal>
  );
}
