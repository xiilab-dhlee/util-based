import Image from "next/image";
import styled from "styled-components";
import { Icon } from "xiilab-ui";

import { SecurityLevelText } from "@/shared/components/text/security-status-text";
import type { CoreSecurityLevel } from "@/shared/types/core.interface";
import { getSecurityLevelInfo } from "@/shared/utils/security.util";

interface PrivateRegistryImageTagSecurityCardProps {
  level: CoreSecurityLevel;
  count: number;
}

export function PrivateRegistryImageTagSecurityCard({
  level,
  count,
}: PrivateRegistryImageTagSecurityCardProps) {
  const { icon } = getSecurityLevelInfo(level);
  return (
    <Container>
      <Body>
        <Left>
          <Image
            src="/images/device-bg2.png"
            width="72"
            height="72"
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
          <RightBody>{count.toLocaleString()}개</RightBody>
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
  height: 88px;
  border-radius: 4px;
  border: 1px solid #2a3041;
  background-color: #070913;
`;

const Body = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Left = styled.div`
  width: 76px;
  height: 100%;
  position: relative;
  user-select: none;
  padding-right: 3px;
  padding-bottom: 5px;

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
  width: 42px;
  height: 42px;
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
  padding-left: 10px;
  padding-bottom: 12px;
  margin-bottom: 8px;
  border-bottom: 1px solid #2a3041;
`;

const RightBody = styled.div`
width: 100%;
text-align: left;
 color: #fff;
 font-size: 16px;
 font-weight: 700;
`;
