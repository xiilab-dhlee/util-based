"use client";

import { useMemo, useState } from "react";
import styled from "styled-components";
import {
  Checkbox,
  Form,
  FormItem,
  Icon,
  Input,
  Modal,
  TextArea,
} from "xiilab-ui";

import { useGetMonitoringNotificationSetDetail } from "@/api/generated/admin-monitoring-notification/admin-monitoring-notification";
import { toFormOperator } from "@/domain/monitoring-notification/constants/monitoring-notification.constant";
import { openViewMonitoringNotificationModalAtom } from "@/domain/monitoring-notification/state/monitoring-notification.atom";
import type { ThresholdFormType } from "@/domain/monitoring-notification/utils/monitoring-notification.override.zod";
import { MODAL_MODES } from "@/shared/constants/core.constant";
import { MONITORING_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { usePublish, useSubscribe } from "@/shared/hooks/use-pub-sub";
import { ManageMonitoringNotificationSetting } from "./manage-monitoring-notification-setting";

// ===== Component =====

export function ViewMonitoringNotificationModal() {
  const publish = usePublish();

  const { open, onOpen, onClose } = useGlobalModal(
    openViewMonitoringNotificationModalAtom,
  );

  const [id, setId] = useState<number | null>(null);

  const { data } = useGetMonitoringNotificationSetDetail(id ?? 0, {
    query: { enabled: id !== null },
  });

  const formSettings: ThresholdFormType[] = useMemo(
    () =>
      (data?.threshold ?? []).map((t) => ({
        metric: t.metric,
        operator: toFormOperator(t.operator),
        value: String(t.value),
        durationMinutes: String(t.durationMinutes),
      })),
    [data?.threshold],
  );

  const handleSubmit = () => {
    if (!data) {
      return;
    }

    publish(MONITORING_EVENTS.openNotificationModal, {
      mode: MODAL_MODES.UPDATE,
      data,
    });
    onClose();
  };

  useSubscribe(
    MONITORING_EVENTS.sendNotificationSetting,
    ({ id }: { id: number }) => {
      setId(id);
      onOpen();
    },
  );

  return (
    <Modal
      type="primary"
      icon={<Icon name="Information" color="#fff" size={14} />}
      modalWidth={600}
      open={open}
      closable
      title="알림 상세 정보"
      showCancelButton
      cancelText="취소"
      onCancel={onClose}
      okText="수정"
      onOk={handleSubmit}
      centered
      showHeaderBorder
    >
      <Form layout="vertical">
        <FormItem label="알림 유형">
          <ChannelRow>
            <Channels>
              <ChannelItem>
                <ChannelKey>
                  <Icon name="MailFilled" size={22} />
                  E-mail
                </ChannelKey>
                <Checkbox
                  size="small"
                  checked={data?.isEmailNotificationEnabled || false}
                  disabled
                />
              </ChannelItem>
              <ChannelItem>
                <ChannelKey>
                  <Icon name="SystemFilled" size={22} />
                  System
                </ChannelKey>
                <Checkbox
                  size="small"
                  checked={data?.isSystemNotificationEnabled || false}
                  disabled
                />
              </ChannelItem>
            </Channels>
          </ChannelRow>
        </FormItem>

        <FormItem label="알림 이름">
          <Input
            type="text"
            value={data?.notificationSetName || ""}
            placeholder="알림 이름"
            width="100%"
            disabled
          />
        </FormItem>

        <FormItem label="노드">
          <TextArea
            value={data?.node?.join(", ") || ""}
            placeholder="노드"
            disabled
            autoSize={{ minRows: 1, maxRows: 5 }}
          />
        </FormItem>

        <FormItem label="알림 임계 조건 설정">
          <ManageMonitoringNotificationSetting
            settings={formSettings}
            disabled
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
