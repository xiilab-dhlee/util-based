import { format } from "date-fns";
import Link from "next/link";
import type { PropsWithChildren } from "react";
import styled from "styled-components";

import type { Service } from "@/types/service/service.model";
import withSafeProps from "../common/hoc/with-safe-props";
import WorkloadStatusText from "../common/text/workload-status-text";
import DashboardDirectLink from "./dashboard-direct-link";

interface DashboardServiceCardProps extends Service {}

/**
 * 서비스 정보 카드 컴포넌트
 */
function DashboardServiceCardComponent({
  name,
  platformName,
  version,
  status,
  description,
  createdAt,
}: DashboardServiceCardProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    alert("준비 중입니다.");
  };

  return (
    <Container href="#" onClick={handleClick}>
      <Header>
        <HeaderLeft>
          <Title className="truncate">{name}</Title>
          <SubTitle>
            <PlatformName className="truncate">{platformName}</PlatformName>
            <Version>
              <div className="truncate">{version}</div>
            </Version>
          </SubTitle>
        </HeaderLeft>
        <div>
          <WorkloadStatusText status={status} />
        </div>
      </Header>
      <Body>
        <Description>
          <DescriptionText className="truncate">{description}</DescriptionText>
        </Description>
        <CreatedAt>{format(createdAt, "yyyy-MM-dd")}</CreatedAt>
        <DashboardDirectLink className="dark" />
      </Body>
    </Container>
  );
}

const DashboardServiceCard = (
  props: PropsWithChildren<DashboardServiceCardProps>,
) => {
  return withSafeProps(DashboardServiceCardComponent)(props);
};

const Container = styled(Link)`
  display: flex;
  flex-direction: column;
  height: 144px;
  border: 1px solid #d1d5dc;
  border-radius: 4px;
  padding: 20px 22px;
  overflow: hidden;
  text-decoration: none;

  &:hover {
    border-color: #6567e5;
    box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.05);
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  position: relative;
  overflow: hidden;
  margin-bottom: 17px;
  padding-bottom: 10px;
  border-bottom: 1px solid #d1d5dc;
  overflow: hidden;
`;

const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex: 1;
  gap: 2px;
`;

const Title = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
  color: #171b26;
`;

const SubTitle = styled.div`
  font-weight: 400;
  font-size: 11px;
  line-height: 13px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: #171b26;
`;

const PlatformName = styled.div`
  max-width: 50%;
  margin-right: 6px;
`;

const Version = styled.div`
  color: #171b26;
  font-weight: 400;
  font-size: 12px;
  line-height: 1.5;
  padding-left: 6px;
  font-weight: 400;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  max-width: 40%;

  &::before {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    height: 50%;
    content: "";
    width: 1px;
    background-color: #a0a5ac;
  }
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
  overflow: hidden;
  position: relative;
`;

const Description = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-weight: 400;
  font-size: 12px;
  gap: 6px;
  width: 100%;
  overflow: hidden;
  color: #171b26;
`;

const DescriptionText = styled.span`
  flex: 1;
`;

const CreatedAt = styled.time`
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  color: #171b26;
  position: relative;
`;
