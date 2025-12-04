"use client";

import { useRef } from "react";
import { toast } from "react-toastify";
import { Icon, Modal } from "xiilab-ui";

import {
  SecurityScheduleSettingForm,
  type SecurityScheduleSettingFormHandle,
} from "@/domain/security/components/security-schedule-setting-form";
import type { SecurityScheduleSettingFormValue } from "@/domain/security/hooks/use-security-schedule-setting-form";
import { useUpdateFileSecuritySchedule } from "@/domain/security/hooks/use-update-file-security-schedule";

interface FileSecurityScheduleSettingModalProps {
  open: boolean;
  onClose: () => void;
}

export function FileSecurityScheduleSettingModal({
  open,
  onClose,
}: FileSecurityScheduleSettingModalProps) {
  const formRef = useRef<SecurityScheduleSettingFormHandle | null>(null);
  const updateScheduleMutation = useUpdateFileSecuritySchedule();

  const handleSubmit = (formValue: SecurityScheduleSettingFormValue) => {
    const payload = {
      scheduleUsage: formValue.scheduleUsage,
      startDateTime: formValue.startDateTime.toISOString(),
      endDateUsage: formValue.endDateUsage,
      endDateTime: formValue.endDateTime
        ? formValue.endDateTime.toISOString()
        : null,
      periodValue: formValue.periodValue,
      periodUnit: formValue.periodUnit,
      weekDays: formValue.weekDays,
    };

    updateScheduleMutation.mutate(payload, {
      onSuccess: () => {
        toast.success("저장되었습니다.");
        onClose();
      },
    });
  };

  const handleOk = () => {
    formRef.current?.submit();
  };

  return (
    <Modal
      type="primary"
      icon={<Icon name="SecurityCheck" color="#fff" size={18} />}
      modalWidth={520}
      open={open}
      closable
      title="보안 검사 일정"
      showCancelButton
      cancelText="취소"
      onCancel={onClose}
      okText="저장"
      onOk={handleOk}
      okButtonProps={{
        loading: updateScheduleMutation.isPending,
      }}
      centered
      showHeaderBorder
    >
      <SecurityScheduleSettingForm formRef={formRef} onSubmit={handleSubmit} />
    </Modal>
  );
}
