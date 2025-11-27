"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import {
  Checkbox,
  Dropdown,
  Form,
  FormItem,
  Icon,
  Input,
  Modal,
} from "xiilab-ui";

import { useCreateMonitoringNotification } from "@/domain/monitoring-notification/hooks/use-create-monitoring-notification";
import { useMonitoringNotificationForm } from "@/domain/monitoring-notification/hooks/use-monitoring-notification-form";
import { useUpdateMonitoringNotification } from "@/domain/monitoring-notification/hooks/use-update-monitoring-notification";
import { openManageMonitoringNotificationModalAtom } from "@/domain/monitoring-notification/state/monitoring-notification.atom";
import type {
  NotificationModalMode,
  OpenNotificationModalPayload,
} from "@/domain/monitoring-notification/types/monitoring-notification.type";
import { CreateModelButton } from "@/shared/components/button/create-model-button";
import { MONITORING_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";
import { FormRow } from "@/styles/layers/form-layer.styled";
import { ManageMonitoringNotificationSetting } from "./manage-monitoring-notification-setting";

const TEMP_NODE_OPTIONS = [
  { label: "node1", value: "node1" },
  { label: "node2", value: "node2" },
  { label: "node3", value: "node3" },
];

export function ManageMonitoringNotificationModal() {
  // 모달 상태 관리
  const { open, onOpen, onClose } = useGlobalModal(
    openManageMonitoringNotificationModalAtom,
  );

  // 모달 모드 상태
  const [mode, setMode] = useState<NotificationModalMode>("create");
  const [editId, setEditId] = useState<string | null>(null);
  const isEditMode = mode === "edit";

  // 폼 훅 사용 (순수 폼 상태 + 검증만)
  const form = useMonitoringNotificationForm();

  // Mutations
  const createNotification = useCreateMonitoringNotification();
  const updateNotification = useUpdateMonitoringNotification();

  const isSubmitting =
    createNotification.isPending || updateNotification.isPending;

  // PubSub 구독 - 생성/수정 모드 초기화
  useSubscribe(
    MONITORING_EVENTS.openNotificationModal,
    (payload: OpenNotificationModalPayload) => {
      setMode(payload.mode);
      if (payload.mode === "edit") {
        form.initializeForEdit(payload.data);
        setEditId(payload.data.id);
      } else {
        form.initializeForCreate();
        setEditId(null);
      }
      onOpen();
    },
  );

  // 모달 닫기 시 폼 및 mutation 리셋
  const handleClose = () => {
    form.reset();
    setMode("create");
    setEditId(null);
    createNotification.reset();
    updateNotification.reset();
    onClose();
  };

  // 폼 제출
  const handleSubmit = () => {
    // 1. 검증
    const payload = form.validate();
    if (!payload) return;

    // 2. API 호출
    const onSuccess = () => {
      toast.success(
        isEditMode ? "알림이 수정되었습니다." : "알림이 추가되었습니다.",
      );
      handleClose();
    };

    if (isEditMode && editId) {
      updateNotification.mutate({ id: editId, ...payload }, { onSuccess });
    } else {
      createNotification.mutate(payload, { onSuccess });
    }
  };

  return (
    <Modal
      type="primary"
      icon={
        <Icon name={isEditMode ? "Edit01" : "Plus"} color="#fff" size={14} />
      }
      modalWidth={600}
      open={open}
      closable
      title={isEditMode ? "알림 수정" : "알림 추가"}
      showCancelButton
      cancelText="취소"
      onCancel={handleClose}
      okText="확인"
      onOk={handleSubmit}
      centered
      showHeaderBorder
      okButtonProps={{
        loading: isSubmitting,
      }}
    >
      <Form layout="vertical">
        <FormItem label="알림 유형" required>
          {/* 채널 에러 표시 */}
          {form.errors.channel && (
            <ChannelErrorText>{form.errors.channel}</ChannelErrorText>
          )}
          <ChannelRow>
            <Channels>
              <ChannelItem>
                <ChannelKey>
                  <Icon name="MailFilled" size={22} />
                  E-mail
                </ChannelKey>
                <Checkbox
                  size="small"
                  checked={form.formState.isEmail}
                  onChange={() =>
                    form.setField("isEmail", !form.formState.isEmail)
                  }
                />
              </ChannelItem>
              <ChannelItem>
                <ChannelKey>
                  <Icon name="SystemFilled" size={22} />
                  System
                </ChannelKey>
                <Checkbox
                  size="small"
                  checked={form.formState.isSystem}
                  onChange={() =>
                    form.setField("isSystem", !form.formState.isSystem)
                  }
                />
              </ChannelItem>
            </Channels>
          </ChannelRow>
        </FormItem>

        <FormRow>
          <HalfFormItem>
            <FormItem label="알림 이름" required>
              <Input
                type="text"
                placeholder="알림 이름을 입력해 주세요."
                width="100%"
                value={form.formState.name}
                onChange={(e) => form.setField("name", e.target.value)}
                status={form.errors.name ? "error" : undefined}
              />
            </FormItem>
          </HalfFormItem>

          <HalfFormItem>
            <FormItem label="노드" required>
              <Dropdown
                options={TEMP_NODE_OPTIONS}
                value={form.formState.nodeName || null}
                onChange={(value) => form.setField("nodeName", value ?? "")}
                width="100%"
                placeholder="노드를 선택해 주세요."
                status={form.errors.nodeName ? "error" : undefined}
              />
            </FormItem>
          </HalfFormItem>
        </FormRow>

        <FormItem label="알림 임계 조건 설정" required>
          <CreateSettingButtonWrapper>
            <CreateModelButton onClick={form.addSetting} title="설정 추가" />
          </CreateSettingButtonWrapper>

          <ManageMonitoringNotificationSetting
            settings={form.formState.settings}
            onChange={form.setSettings}
            errors={form.errors.settingsItems}
          />
        </FormItem>
      </Form>
    </Modal>
  );
}

// ===== Styled Components =====

const ChannelRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #e9e9e9;
  background-color: #fff;
  padding: 8px 12px;
  border-radius: 2px;

  position: relative;
`;

const Channels = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: 4px 0;
`;

const ChannelItem = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 8px;

  & + & {
    border-left: 1px solid #e9ebee;
  }
`;

const ChannelKey = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 2px;
  font-weight: 400;
  font-size: 11px;
  line-height: 13px;
  color: #333333;
`;

const HalfFormItem = styled.div`
  flex: 1;
`;

const CreateSettingButtonWrapper = styled.div`
  position: absolute;
  right: 0;
  top: -24px;
`;

const ChannelErrorText = styled.span`
  position: absolute;
  right: 0;
  top: -24px;
  color: #ff4242;
  font-size: 12px;
  display: block;
`;
