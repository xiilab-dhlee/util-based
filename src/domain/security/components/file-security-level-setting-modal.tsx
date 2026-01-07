"use client";

import { useRef } from "react";
import { toast } from "react-toastify";
import { Icon, Modal } from "xiilab-ui";

import type { SecurityLevelSettingFormValue } from "@/domain/security/hooks/use-security-level-setting-form";
import { useUpdateFileSecurityLevel } from "@/domain/security/hooks/use-update-file-security-level";
import { openFileSecurityLevelSettingModalAtom } from "@/domain/security/state/file-security.atom";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import {
  SecurityLevelSettingForm,
  type SecurityLevelSettingFormHandle,
} from "./security-level-setting-form";

export function FileSecurityLevelSettingModal() {
  const { open, onClose } = useGlobalModal(
    openFileSecurityLevelSettingModalAtom,
  );
  const formRef = useRef<SecurityLevelSettingFormHandle | null>(null);
  const updateSecurityLevelMutation = useUpdateFileSecurityLevel();

  const handleSubmit = (formValue: SecurityLevelSettingFormValue) => {
    updateSecurityLevelMutation.mutate(formValue, {
      onSuccess: () => {
        toast.success("저장되었습니다.");
        onClose();
      },
    });
  };

  const handleModalOk = () => {
    formRef.current?.submit();
  };

  return (
    <Modal
      type="primary"
      icon={<Icon name="SecurityCheck" color="#fff" size={18} />}
      modalWidth={520}
      open={open}
      closable
      title="보안 레벨 설정"
      showCancelButton
      cancelText="취소"
      onCancel={onClose}
      okText="저장"
      onOk={handleModalOk}
      okButtonProps={{
        loading: updateSecurityLevelMutation.isPending,
      }}
      centered
      showHeaderBorder
    >
      <SecurityLevelSettingForm formRef={formRef} onSubmit={handleSubmit} />
    </Modal>
  );
}
