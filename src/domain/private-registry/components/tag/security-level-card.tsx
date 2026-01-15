import Image from "next/image";
import styled from "styled-components";
import { Icon } from "xiilab-ui";

import { SecurityLevelText } from "@/shared/components/text/security-status-text";
import type { CoreSecurityLevel } from "@/shared/types/core.interface";
import { getVulnerabilityLevelInfo } from "@/shared/utils/vulnerability.util";

interface SecurityLevelCardProps {
  level: CoreSecurityLevel;
  count: number;
}

export function SecurityLevelCard({ level, count }: SecurityLevelCardProps) {
  const { icon } = getVulnerabilityLevelInfo(level);

  let countText: string;
  if (count > 99999) {
    countText = `${Number(99999).toLocaleString()}+`;
  } else {
    countText = count.toLocaleString();
  }
  return (
    <Container>
      <Body>
        <Left>
          <Image
            src="/images/device-bg2.png"
            width={68}
            height={68}
            alt="Device Bg"
            draggable={false}
          />
          <IconWrapper>
            <Icon name={icon} color="var(--icon-fill)" size={32} />
          </IconWrapper>
        </Left>
        <Right>
          <RightHeader>
            <SecurityLevelText type="engText" status={level} />
          </RightHeader>
          <RightBody>{countText}개</RightBody>
        </Right>
      </Body>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  height: 68px;
  border-radius: 4px;
  border: 1px solid #3A4561;
  background-color: #070913;
`;

const Body = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Left = styled.div`
  flex-basis: 68px;
  flex-shrink: 0;
  flex-grow: 0;
  height: 100%;
  position: relative;
  user-select: none;

  & img {
    width: 100%;
    height: 100%;
  }
`;

const IconWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  width: 38px;
  height: 38px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #2a3041;
  border-radius: 2px;
  background-color: #070913;

  --icon-fill: #fff;
`;

const Right = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 0 10px 0 8px;
`;

const RightHeader = styled.div`
  width: 100%;

  padding-right: 4px;
  padding-bottom: 6px;
  margin-bottom: 6px;
  border-bottom: 1px solid #2a3041;
`;

const RightBody = styled.div`
  width: 100%;
  text-align: left;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
`;
