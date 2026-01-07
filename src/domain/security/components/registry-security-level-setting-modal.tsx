"use client";

import { useRef } from "react";
import { toast } from "react-toastify";
import { Icon, Modal } from "xiilab-ui";

import type { SecurityLevelSettingFormValue } from "@/domain/security/hooks/use-security-level-setting-form";
import { useUpdateRegistrySecurityLevel } from "@/domain/security/hooks/use-update-registry-security-level";
import { openRegistrySecurityLevelSettingModalAtom } from "@/domain/security/state/registry-security.atom";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import {
  SecurityLevelSettingForm,
  type SecurityLevelSettingFormHandle,
} from "./security-level-setting-form";

export function RegistrySecurityLevelSettingModal() {
  const { open, onClose } = useGlobalModal(
    openRegistrySecurityLevelSettingModalAtom,
  );
  const formRef = useRef<SecurityLevelSettingFormHandle | null>(null);
  const updateSecurityLevelMutation = useUpdateRegistrySecurityLevel();

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
