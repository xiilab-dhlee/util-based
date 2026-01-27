"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Form, Icon, Modal } from "xiilab-ui";

import type { MonitoringNotificationSetDetailResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { useGetNodeGpuInfoList } from "@/api/generated/cluster-resource/cluster-resource";
import {
  NotificationChannelSection,
  NotificationInfoSection,
  NotificationSettingsSection,
} from "@/domain/monitoring-notification/components/notification-form-sections";
import { GPU_METRICS } from "@/domain/monitoring-notification/constants/monitoring-notification.constant";
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
  hasEmailNotificationEnabled: true,
  hasSystemNotificationEnabled: false,
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

  // 노드 목록 조회 (GPU 정보 포함) - 모달이 열릴 때만 호출
  const { data: nodeGpuInfoData, isLoading: isNodeNamesLoading } =
    useGetNodeGpuInfoList({ query: { enabled: open } });

  const nodeOptions = useMemo(
    () =>
      (nodeGpuInfoData ?? []).map((node) => ({
        label: node.nodeName,
        value: node.nodeName,
        isGpuNode: node.isGpuNode,
      })),
    [nodeGpuInfoData],
  );

  // GPU 노드 여부 빠른 조회를 위한 Map
  const nodeGpuMap = useMemo(
    () => new Map(nodeOptions.map((n) => [n.value, n.isGpuNode])),
    [nodeOptions],
  );

  // react-hook-form 설정
  const {
    control,
    handleSubmit,
    reset,
    clearErrors,
    watch,
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

  // 선택된 노드 감시 및 GPU 메트릭 비활성화 여부 계산
  const selectedNodes = watch("nodeName");
  const threshold = watch("threshold");

  const isGpuMetricDisabled = useMemo(() => {
    if (isNodeNamesLoading) return true;
    if (!selectedNodes?.length) return false;
    // non-GPU 노드가 하나라도 선택되면 GPU 메트릭 비활성화
    const hasNonGpuNode = selectedNodes.some(
      (name) => nodeGpuMap.get(name) !== true,
    );
    return hasNonGpuNode;
  }, [selectedNodes, nodeGpuMap, isNodeNamesLoading]);

  // GPU 메트릭 에러 여부 (비활성화 상태에서 GPU 메트릭이 선택된 경우)
  const hasGpuMetricError = useMemo(() => {
    if (!isGpuMetricDisabled || !threshold?.length) return false;
    return threshold.some((setting) =>
      GPU_METRICS.some((metric) => metric === setting.metric),
    );
  }, [isGpuMetricDisabled, threshold]);

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
    // GPU 메트릭 에러가 있거나 로딩 중이면 제출 차단
    if (hasGpuMetricError || isNodeNamesLoading) return;

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
      okButtonProps={{
        loading: isSubmitting,
        disabled: hasGpuMetricError || isNodeNamesLoading,
      }}
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
          isGpuMetricDisabled={isGpuMetricDisabled}
          hasGpuMetricError={hasGpuMetricError}
        />
      </Form>
    </Modal>
  );
}
