"use client";

import styled from "styled-components";
import { Typography } from "xiilab-ui";

import { gradientBackgroundButtonStyle } from "@/styles/mixins/button";
import { subTitleStyle } from "@/styles/mixins/text";
import { AstragoIcon } from "../common/icon/astrago-icon";

export function MonitoringIntroCard() {
  return (
    <Container>
      <Header>
        <EngTitleWrapper>
          <EngTitle>About AstraGo Monitoring</EngTitle>
        </EngTitleWrapper>
        <TitleWrapper>
          <IconWrapper>
            <AstragoIcon fill="var(--icon-fill)" />
          </IconWrapper>
          <Title>모니터링</Title>
        </TitleWrapper>
        <Typography.Text variant="body-1-2" color="#A9A9A9">
          AstraGo는 모니터링을 통해 수 많은 정보들을 확인하고 관리할 수
          있습니다.
        </Typography.Text>
        <Typography.Text variant="body-1-2" color="#A9A9A9">
          장비 상태, 네트워크 트래픽, 사용자 활동 등 주요 지표를 실시간으로
          확인할 수 있습니다.
        </Typography.Text>
        <Typography.Text variant="body-1-2" color="#A9A9A9">
          데이터 기반의 효율적인 운영과 빠른 대응이 가능해집니다.
        </Typography.Text>
      </Header>
      <Body>
        <UpdateDate>
          <UpdateDateKey>업데이트 기준 시간</UpdateDateKey>
          <UpdateDateValue>2025. 10. 26 14:22:42</UpdateDateValue>
        </UpdateDate>
        <Button type="button" onClick={() => alert("준비 중입니다.")}>
          모니터링 정보 새로고침
        </Button>
      </Body>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 290px;
  background-image: url("/images/dashboard-background.png");
  background-size: 100% 100%;
  padding: 24px;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
`;

const EngTitleWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 20px;
`;

const EngTitle = styled.span`
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  color: #d1d1d1;
  width: 100%;
`;

const TitleWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
`;

const Title = styled.div`
  font-weight: 500;
  font-size: 18px;
  line-height: 16px;
  color: #f5f5f5;
`;

const IconWrapper = styled.div`
  width: 28px;
  height: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #070913;
  border: 1px solid #434857;
  border-radius: 2px;

  --icon-fill: #fff;
`;

const Body = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
`;

const UpdateDate = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 13px;
  width: 100%;
  margin-bottom: 25px;
`;

const UpdateDateKey = styled.div`
  ${subTitleStyle(5)}

  margin-left: 5px;
  font-weight: 400;
  font-size: 12px;
  line-height: 17px;
  color: #fff;

  &::before {
    background-color: #31e0ff;
  }
`;

const UpdateDateValue = styled.div`
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;
  color: #fff;
`;

const Button = styled.button`
  ${gradientBackgroundButtonStyle}
`;
