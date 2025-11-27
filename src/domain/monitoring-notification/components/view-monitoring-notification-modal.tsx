"use client";

import { useMemo, useState } from "react";
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

import { useGetMonitoringNotification } from "@/domain/monitoring-notification/hooks/use-get-monitoring-notification";
import type {
  MonitoringNotificationSettingFormType,
  MonitoringNotificationSettingResponseType,
} from "@/domain/monitoring-notification/schemas/monitoring-notification.schema";
import { openViewMonitoringNotificationModalAtom } from "@/domain/monitoring-notification/state/monitoring-notification.atom";
import { MONITORING_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { usePublish, useSubscribe } from "@/shared/hooks/use-pub-sub";
import { FormRow } from "@/styles/layers/form-layer.styled";
import { ManageMonitoringNotificationSetting } from "./manage-monitoring-notification-setting";

const TEMP_NODE_OPTIONS = [
  { label: "node1", value: "node1" },
  { label: "node2", value: "node2" },
  { label: "node3", value: "node3" },
];

export function ViewMonitoringNotificationModal() {
  const publish = usePublish();

  // useGlobalModal 훅을 사용하여 모달 상태 관리
  const { open, onOpen, onClose } = useGlobalModal(
    openViewMonitoringNotificationModalAtom,
  );

  const [id, setId] = useState("");

  const { data } = useGetMonitoringNotification(id);

  const formSettings: MonitoringNotificationSettingFormType[] = useMemo(
    () =>
      (data?.settings ?? []).map(
        (setting: MonitoringNotificationSettingResponseType) => ({
          item: setting.item,
          operator: setting.operator,
          threshold: String(setting.threshold),
          duration: String(setting.duration),
        }),
      ),
    [data?.settings],
  );

  const handleSubmit = () => {
    if (!data) {
      return;
    }

    publish(MONITORING_EVENTS.openNotificationModal, {
      mode: "edit",
      data,
    });
    onClose();
  };

  useSubscribe(
    MONITORING_EVENTS.sendNotificationSetting,
    ({ id }: { id: string }) => {
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
                  checked={data?.isEmail || false}
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
                  checked={data?.isSystem || false}
                  disabled
                />
              </ChannelItem>
            </Channels>
          </ChannelRow>
        </FormItem>

        <FormRow>
          <HalfFormItem>
            <FormItem label="알림 이름">
              <Input
                type="text"
                value={data?.name || ""}
                placeholder="알림 이름"
                width="100%"
                disabled
              />
            </FormItem>
          </HalfFormItem>

          <HalfFormItem>
            <FormItem label="노드">
              <Dropdown
                options={TEMP_NODE_OPTIONS}
                value={data?.nodeName || null}
                width="100%"
                placeholder="노드"
                disabled
              />
            </FormItem>
          </HalfFormItem>
        </FormRow>

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

const HalfFormItem = styled.div`
  flex: 1;
`;
