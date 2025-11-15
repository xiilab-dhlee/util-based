"use client";

import { useState } from "react";
import styled from "styled-components";
import { Icon, Modal } from "xiilab-ui";
import { MONITORING_EVENTS } from "@/constants/common/pubsub.constant";

import { openViewMonitoringNotificationModalAtom } from "@/atoms/monitoring-notification/monitoring-notification.atom";
import { MONITORING_EVENTS } from "@/constants/common/pubsub.constant";

import { useGlobalModal } from "@/hooks/common/use-global-modal";
import { usePublish, useSubscribe } from "@/hooks/common/use-pub-sub";
import { useGetMonitoringNotificationSetting } from "@/hooks/monitoring/use-get-monitoring-notification-setting";
import ModalDetailCard from "../common/card/modal-detail-card";
import ReadOnlyMonitoringNotificationSetting from "./read-only-monitoring-notification-setting";
import { MONITORING_EVENTS } from "@/constants/common/pubsub.constant";

export function ViewMonitoringNotificationModal() {
  const publish = usePublish();

  // useGlobalModal 훅을 사용하여 모달 상태 관리
  const { open, onOpen, onClose } = useGlobalModal(
    openViewMonitoringNotificationModalAtom,
  );

  const [id, setId] = useState("");

  const { data } = useGetMonitoringNotificationSetting(id);

  const handleSubmit = () => {
    publish(MONITORING_EVENTS.sendUpsertNotification, data);
    onClose();
  };

  useSubscribe<any>(
    MONITORING_EVENTS.sendNotificationSetting,
    ({ id }) => {
      setId(id);
      onOpen();
    },
  );

  return (
    <Modal
      type="primary"
      icon={<Icon name="Information" color="#fff" size={14} />}
      modalWidth={580}
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
      <Container>
        <ModalDetailCard
          records={[
            {
              label: "상세 정보",
              labelLevel: 1,
            },
            {
              label: "채널 선택",
              value: data?.channel,
            },
            {
              label: "알림 이름",
              value: data?.name,
            },
            {
              label: "노드",
              value: data?.nodeName,
            },
          ]}
        />
        <SettingContainer>
          <SettingHeader>
            <SettingTitle>알림 임계 조건 설정</SettingTitle>
          </SettingHeader>
          <ReadOnlyMonitoringNotificationSetting
            settings={data?.settings || []}
          />
        </SettingContainer>
      </Container>
    </Modal>
  );
}


const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SettingContainer = styled.div`
  display: flex;
  flex-direction: column;

  border: 1px solid #e9e9e9;
  border-radius: 2px;
  background-color: #fff;
  padding: 14px;
`;

const SettingHeader = styled.div`
  margin-bottom: 16px;
`;

const SettingTitle = styled.div`
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;
  color: #000;
`;
