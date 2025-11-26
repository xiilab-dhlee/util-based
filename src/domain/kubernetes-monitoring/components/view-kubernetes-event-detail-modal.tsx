"use client";

import { useState } from "react";
import styled from "styled-components";
import { Icon, InfoModal, Label, Typography } from "xiilab-ui";

import { openKubernetesEventDetailModalAtom } from "@/domain/kubernetes-monitoring/atom/kubernetes-monitoring.atom";
import type { KubernetesEventType } from "@/domain/kubernetes-monitoring/types/kubernetes-monitoring.type";
import { getKubernetesEventLabelProps } from "@/domain/kubernetes-monitoring/utils/kubernetes-event.util";
import { KUBERNETES_MONITORING_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

/**
 * 쿠버네티스 이벤트 상세 정보 모달 컴포넌트
 *
 * PubSub 패턴을 사용하여 이벤트 데이터를 수신하고 모달을 표시합니다.
 */
export function ViewKubernetesEventDetailModal() {
  const { open, onOpen, onClose } = useGlobalModal(
    openKubernetesEventDetailModalAtom,
  );

  const [eventData, setEventData] = useState<KubernetesEventType | null>(null);

  useSubscribe<KubernetesEventType>(
    KUBERNETES_MONITORING_EVENTS.sendKubernetesEventDetail,
    (data) => {
      setEventData(data);
      onOpen();
    },
  );

  const statusProps = eventData
    ? getKubernetesEventLabelProps(eventData.status)
    : null;

  return (
    <InfoModal
      modalWidth={370}
      title="쿠버네티스 이벤트 내역 상세 정보"
      icon={<Icon name="OnPremiseStorage" color="#fff" size={20} />}
      open={open}
      closable
      onClose={onClose}
      centered
      showHeaderBorder
    >
      {eventData && (
        <Container>
          <Row>
            <FieldLabel>Namespace 이름</FieldLabel>
            <Value>{eventData.namespace}</Value>
          </Row>
          <Row>
            <FieldLabel>상태</FieldLabel>
            {statusProps && (
              <Value>
                <Label variant={statusProps.variant} size="large">
                  {statusProps.label}
                </Label>
              </Value>
            )}
          </Row>
          <Row>
            <FieldLabel>오브젝트</FieldLabel>
            <Value>{eventData.object}</Value>
          </Row>
          <Row>
            <FieldLabel>IP 주소</FieldLabel>
            <Value>{eventData.ipAddress}</Value>
          </Row>
          <Row>
            <FieldLabel>메시지</FieldLabel>
            <Value>{eventData.message}</Value>
          </Row>
        </Container>
      )}
    </InfoModal>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: #FFFFFF;
  border: 1px solid #E9E9E9;
  border-radius: 2px;
  padding: 16px;
  overflow-y: auto;
  height: 210px;
`;

const Row = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
`;

const FieldLabel = styled(Typography.Text).attrs({
  variant: "body-2-2",
})`
  width: 90px;

`;

const Value = styled(Typography.Text).attrs({
  variant: "subtitle-2-3",
})`
  flex: 1;
`;
