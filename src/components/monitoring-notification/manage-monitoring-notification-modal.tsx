"use client";

import { useState } from "react";
import styled from "styled-components";
import { Checkbox, Input, Modal, Typography } from "xiilab-ui";

import { openManageMonitoringNotificationModalAtom } from "@/atoms/monitoring-notification/monitoring-notification.atom";
import {
  MONITORING_EVENTS,
  USER_EVENTS,
} from "@/constants/common/pubsub.constant";
import { FormLabel } from "../common/form/form-label";
import { MyIcon } from "../common/icons";
import { useGlobalModal } from "@/hooks/common/use-global-modal";
import { usePublish, useSubscribe } from "@/hooks/common/use-pub-sub";
import { useUpsertMonitoringNotification } from "@/hooks/monitoring/use-upsert-notification";
import type { MonitoringNotificationSettingType } from "@/schemas/monitoring-notification.schema";
import { FormItem, FormRow } from "@/styles/layers/form-layer.styled";
import type { UpsertMonitoringNotificationPayload } from "@/types/monitoring-notification/monitoring-notification.type";
import { ManageMonitoringNotificationSetting } from "./manage-monitoring-notification-setting";

export function ManageMonitoringNotificationModal() {
  const publish = usePublish();

  // useGlobalModal 훅을 사용하여 모달 상태 관리
  const { open, onOpen, onClose } = useGlobalModal(
    openManageMonitoringNotificationModalAtom,
  );

  // 알림 id
  const [id, setId] = useState(-1);
  // 채널 - System 체크 여부
  const [checkedSystem, setCheckedSystem] = useState(false);
  // 채널 - E-mail 체크 여부
  const [checkedEmail, setCheckedEmail] = useState(false);
  // 알림 이름
  const [name, setName] = useState("");
  // 노드 (임시로 input)
  const [node, setNode] = useState("");
  // 알림 임계 조건 설정
  const [settings, setSettings] =
    useState<MonitoringNotificationSettingType[]>();

  // MPS 업데이트 뮤테이션
  const upsertNotification = useUpsertMonitoringNotification();

  // MPS 설정 제출 핸들러
  const handleSubmit = () => {
    const payload = createPayload();

    if (payload) {
      upsertNotification.mutate(payload, {
        onSuccess: () => {
          publish(USER_EVENTS.sendUpdateUser, payload);
          onClose();
        },
      });
    }
  };

  // MPS 업데이트 페이로드 생성
  const createPayload = (): UpsertMonitoringNotificationPayload | null => {
    return {
      name,
      nodeName: node,
      isEmail: checkedEmail,
      isSystem: checkedSystem,
      settings,
    };
  };

  useSubscribe<any>(
    MONITORING_EVENTS.sendUpsertNotification,
    ({ id, name, nodeName, isEmail, isSystem, settings }) => {
      if (id) {
        setId(id);
      } else {
        setId(-1);
      }

      setName(name || "");
      setNode(nodeName || "");
      setCheckedEmail(isEmail || false);
      setCheckedSystem(isSystem || false);
      setSettings(settings || []);
      onOpen();
    },
  );

  return (
    <Modal
      type="primary"
      icon={<MyIcon name={id ? "Edit01" : "Plus"} color="#fff" size={14} />}
      modalWidth={580}
      open={open}
      closable
      title={id !== -1 ? "알림 수정" : "알림 추가"}
      showCancelButton
      cancelText="취소"
      onCancel={onClose}
      okText="확인"
      onOk={handleSubmit}
      centered
      showHeaderBorder
      okButtonProps={{
        disabled: upsertNotification.isPending,
      }}
    >
      <form>
        <FormItem>
          <FormLabel>채널</FormLabel>
          <ChannelRow>
            <ChannelLabel>
              <Typography.Text variant="body-2-3" color="#000">
                채널 선택
              </Typography.Text>
              <Typography.Text variant="body-3-3" color="#5F6368">
                (중복 선택 가능)
              </Typography.Text>
            </ChannelLabel>
            <Channels>
              <ChannelItem>
                <ChannelKey>
                  <MyIcon name="MailFilled" size={22} />
                  E-mail
                </ChannelKey>
                <Checkbox
                  size="small"
                  checked={checkedEmail}
                  onChange={() => setCheckedEmail((prev) => !prev)}
                />
              </ChannelItem>
              <ChannelItem>
                <ChannelKey>
                  <MyIcon name="SystemFilled" size={22} />
                  System
                </ChannelKey>
                <Checkbox
                  size="small"
                  checked={checkedSystem}
                  onChange={() => setCheckedSystem((prev) => !prev)}
                />
              </ChannelItem>
            </Channels>
          </ChannelRow>
        </FormItem>

        <FormRow>
          <FormItem>
            <FormLabel htmlFor="notificationName">알림 이름</FormLabel>
            <Input
              type="text"
              id="notificationName"
              name="notificationName"
              placeholder="알림 이름을 입력해 주세요."
              width="100%"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormItem>
          <FormItem>
            <FormLabel htmlFor="nodeName">노드</FormLabel>
            <Input
              type="text"
              id="nodeName"
              name="nodeName"
              placeholder="노드를 선택해 주세요."
              width="100%"
              value={node}
              onChange={(e) => setNode(e.target.value)}
            />
          </FormItem>
        </FormRow>
      </form>
      <ManageMonitoringNotificationSetting defaultSettings={settings} />
    </Modal>
  );
}

const ChannelRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #e9e9e9;
  background-color: #fff;
  padding: 10px;
  border-radius: 2px;
`;

const Channels = styled.div`
  display: flex;
  flex-direction: row;
  width: 338px;
  background-color: #fafafa;
  border-radius: 2px;
  padding: 4px 8px;
`;

const ChannelItem = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;

  & + & {
    border-left: 1px solid #e9ebee;
    margin-left: 6px;
    padding-left: 6px;
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

const ChannelLabel = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 2px;
`;
