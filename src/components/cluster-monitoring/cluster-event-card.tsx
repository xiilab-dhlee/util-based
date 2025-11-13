"use client";

import styled from "styled-components";

import { statusTextStyle } from "@/styles/mixins/text";

export function ClusterEventCard() {
  return (
    <Container>
      <Header>
        <HeaderLeft>
          <HeaderTitle className="truncate">네임스페이스01</HeaderTitle>
          <HeaderDate>
            <HeaderDateItem>24.12.26</HeaderDateItem>
            <HeaderDateItem>13:31</HeaderDateItem>
          </HeaderDate>
        </HeaderLeft>
        <HeaderStatus className="red">에러</HeaderStatus>
      </Header>
      <Body>
        <Key>오브젝트 :</Key>
        <Value className="truncate">deployment/nginx-deployment</Value>
        <Key>IP 주소 :</Key>
        <Value>192.168.1.1</Value>
      </Body>
      <Footer>
        <Key>메세지 :</Key>
        <Message className="truncate">
          Pod nginx-deployment-5d4d5678b7-abcde가 CrashLoopBackOff{" "}
        </Message>
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

const HeaderStatus = styled.div`
  ${statusTextStyle(6)}

  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);

  font-weight: 500;
  font-size: 12px;
  line-height: 14px;
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
