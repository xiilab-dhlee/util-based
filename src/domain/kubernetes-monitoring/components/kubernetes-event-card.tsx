"use client";

import styled from "styled-components";
import { Label } from "xiilab-ui";

import type { KubernetesEventType } from "@/domain/kubernetes-monitoring/types/kubernetes-monitoring.type";
import {
  getKubernetesEventLabelProps,
  getParseDateTime,
} from "@/domain/kubernetes-monitoring/utils/kubernetes-event.util";
import { KUBERNETES_MONITORING_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";

interface KubernetesEventCardProps {
  event: KubernetesEventType;
}

/**
 * 쿠버네티스 이벤트 카드 컴포넌트
 *
 * 클릭 시 PubSub을 통해 상세 모달을 열어줍니다.
 */
export function KubernetesEventCard({ event }: KubernetesEventCardProps) {
  const publish = usePublish();

  const { date, time } = getParseDateTime(event.dateTime);

  const handleClick = () => {
    publish(KUBERNETES_MONITORING_EVENTS.sendKubernetesEventDetail, event);
  };

  const { label, variant } = getKubernetesEventLabelProps(event.status);

  return (
    <Container onClick={handleClick}>
      <Header>
        <HeaderLeft>
          <HeaderTitle className="truncate">{event.namespace}</HeaderTitle>
          <HeaderDate>
            <HeaderDateItem>{date}</HeaderDateItem>
            <HeaderDateItem>{time}</HeaderDateItem>
          </HeaderDate>
        </HeaderLeft>
        <Label variant={variant}>{label}</Label>
      </Header>
      <Body>
        <Key>오브젝트 :</Key>
        <Value className="truncate">{event.object}</Value>
        <Key>IP 주소 :</Key>
        <Value>{event.ipAddress}</Value>
      </Body>
      <Footer>
        <Key>메시지 :</Key>
        <Message className="truncate">{event.message}</Message>
      </Footer>
    </Container>
  );
}

const Container = styled.div`
  height: 94px;
  border-radius: 4px;
  border: 1px solid #c1c7ce;
  background-color: #fafafa;
  padding: 17px 12px 10px 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  cursor: pointer;

  &:hover {
    border-color: var(--color-blue-05);
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  overflow: hidden;
  position: relative;
`;

const HeaderLeft = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex: 1;
  gap: 6px;
`;

const HeaderTitle = styled.div`
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;
  color: #191b26;
`;

const HeaderDate = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const HeaderDateItem = styled.div`
  font-weight: 400;
  font-size: 11px;
  line-height: 11px;
  color: #191b26;

  & + & {
    border-left: 1px solid #d1d5dc;
    margin-left: 4px;
    padding-left: 4px;
  }
`;

const Body = styled.div`
  padding-bottom: 7px;
  margin-bottom: 8px;
  border-bottom: 1px solid #d0d0d066;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
`;

const Key = styled.span`
  font-weight: 500;
  font-size: 12px;
  line-height: 14px;
  color: #191b26;
  white-space: nowrap;
`;

const Value = styled.span`
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  color: #191b26;
`;

const Message = styled.span`
  flex: 1;
  font-weight: 400;
  font-size: 11px;
  line-height: 13px;
  color: #707070;
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 6px;
`;
