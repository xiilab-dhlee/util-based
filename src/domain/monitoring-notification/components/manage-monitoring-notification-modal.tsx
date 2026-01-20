"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Form, Icon, Modal } from "xiilab-ui";

import { useGetNodeNames } from "@/api/generated/admin-cluster/admin-cluster";
import type { MonitoringNotificationSetDetailResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  NotificationChannelSection,
  NotificationInfoSection,
  NotificationSettingsSection,
} from "@/domain/monitoring-notification/components/notification-form-sections";
import {
  useCreateNotificationAction,
  useUpdateNotificationAction,
} from "@/domain/monitoring-notification/hooks/monitoring-notification-action";
import { openManageMonitoringNotificationModalAtom } from "@/domain/monitoring-notification/state/monitoring-notification.atom";
import type { NotificationModalMode } from "@/domain/monitoring-notification/types/monitoring-notification.type";
import {
  type NotificationFormType,
  notificationFormSchema,
} from "@/domain/monitoring-notification/utils/monitoring-notification.override.zod";
import {
  toCreateRequest,
  toFormData,
} from "@/domain/monitoring-notification/utils/notification-mapper";
import { DataErrorState } from "@/shared/components/feedback/data-error-state";
import { MODAL_MODES } from "@/shared/constants/core.constant";
import { MONITORING_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

// ===== 상수 =====

const INITIAL_FORM_STATE: NotificationFormType = {
  notificationSetName: "",
  nodeName: [],
  isEmailNotificationEnabled: true,
  isSystemNotificationEnabled: false,
  threshold: [],
};

// ===== 컴포넌트 =====

export function ManageMonitoringNotificationModal() {
  // 모달 상태 관리
  const { open, onOpen, onClose } = useGlobalModal(
    openManageMonitoringNotificationModalAtom,
  );

  // 모달 모드 상태
  const [mode, setMode] = useState<NotificationModalMode>(MODAL_MODES.CREATE);
  const [editId, setEditId] = useState<number | null>(null);
  const isEditMode = mode === MODAL_MODES.UPDATE;
  const hasDataError = isEditMode && editId === null;

  // 노드 목록 조회
  const { data: nodeNameData, isLoading: isNodeNamesLoading } =
    useGetNodeNames();
  const nodeOptions = (nodeNameData ?? []).map((name) => ({
    label: name,
    value: name,
  }));

  // react-hook-form 설정
  const {
    control,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm<NotificationFormType>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues: INITIAL_FORM_STATE,
  });

  const createMutation = useCreateNotificationAction({
    mutation: {
      onSuccess: () => handleClose(),
    },
  });

  const updateMutation = useUpdateNotificationAction({
    mutation: {
      onSuccess: () => handleClose(),
    },
  });

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  // PubSub 구독 - 생성/수정 모드 초기화
  useSubscribe(
    MONITORING_EVENTS.openNotificationModal,
    (payload: {
      mode: NotificationModalMode;
      data?: MonitoringNotificationSetDetailResponse;
    }) => {
      setMode(payload.mode);
      if (payload.mode === MODAL_MODES.UPDATE && payload.data) {
        const formData = toFormData(payload.data);
        reset(formData);
        setEditId(payload.data.notificationSetId);
      } else {
        reset(INITIAL_FORM_STATE);
        setEditId(null);
      }
      onOpen();
    },
  );

  // 모달 닫기
  const handleClose = () => {
    reset(INITIAL_FORM_STATE);
    clearErrors();
    setMode(MODAL_MODES.CREATE);
    setEditId(null);
    createMutation.reset();
    updateMutation.reset();
    onClose();
  };

  // 폼 제출
  const onSubmit = (data: NotificationFormType) => {
    const request = toCreateRequest(data);

    if (isEditMode && editId !== null) {
      updateMutation.mutate({
        notificationSetId: editId,
        data: request,
      });
    } else {
      createMutation.mutate({ data: request });
    }
  };

  if (hasDataError) {
    return (
      <Modal
        type="primary"
        icon={<Icon name="Edit01" color="#fff" size={14} />}
        modalWidth={600}
        open={open}
        closable
        title="알림 수정"
        showCancelButton={false}
        okText="닫기"
        onOk={handleClose}
        centered
        showHeaderBorder
      >
        <DataErrorState />
      </Modal>
    );
  }

  return (
    <Modal
      type="primary"
      icon={
        <Icon name={isEditMode ? "Edit01" : "Plus"} color="#fff" size={14} />
      }
      modalWidth={600}
      open={open}
      closable={!isSubmitting}
      title={isEditMode ? "알림 수정" : "알림 추가"}
      showCancelButton
      cancelText="취소"
      onCancel={handleClose}
      okText="확인"
      onOk={handleSubmit(onSubmit)}
      centered
      showHeaderBorder
      maskClosable={!isSubmitting}
      keyboard={!isSubmitting}
      cancelButtonProps={{ disabled: isSubmitting }}
      okButtonProps={{ loading: isSubmitting }}
    >
      <Form layout="vertical">
        <NotificationChannelSection
          control={control}
          errors={errors}
          disabled={isSubmitting}
        />

        <NotificationInfoSection
          control={control}
          errors={errors}
          nodeOptions={nodeOptions}
          isNodeNamesLoading={isNodeNamesLoading}
          disabled={isSubmitting}
        />

        <NotificationSettingsSection
          control={control}
          errors={errors}
          disabled={isSubmitting}
        />
      </Form>
    </Modal>
  );
}
