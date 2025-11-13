"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { Modal } from "xiilab-ui";

import {
  closeCredentialAddModalAtom,
  credentialAddModalOpenAtom,
} from "@/atoms/setting/setting-modal.atom";

/**
 * 크리덴셜추가 모달 컴포넌트
 *
 * 새로운 크리덴셜을 추가할 수 있는 모달입니다.
 */
export function CredentialAddModal() {
  const isVisible = useAtomValue(credentialAddModalOpenAtom);
  const closeModal = useSetAtom(closeCredentialAddModalAtom);
  return (
    <Modal
      title="크리덴셜 추가"
      open={isVisible}
      onCancel={closeModal}
      width={450}
      centered
      footer={null}
    >
      <div style={{ padding: "20px" }}>
        {/* TODO: 크리덴셜 추가 폼 컨텐츠 추가 예정 */}
        <div style={{ textAlign: "center", color: "#666" }}>
          크리덴셜 추가 기능이 곧 추가될 예정입니다.
        </div>
      </div>
    </Modal>
  );
}

