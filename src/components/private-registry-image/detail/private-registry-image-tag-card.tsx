"use client";

import { format } from "date-fns";
import styled from "styled-components";
import { Card, Typography } from "xiilab-ui";

import { MyIcon } from "@/components/common/icon";
import type { PrivateRegistryImageTagListType } from "@/schemas/private-registry-image-tag.schema";

interface PrivateRegistryImageTagCardProps
  extends PrivateRegistryImageTagListType {}
/**
 * 내부 레지스트리 이미지 태그 카드 컴포넌트
 *
 * 태그 명, 취약점 정보를 컴팩트하게 표시하는 카드
 */
export function PrivateRegistryImageTagCard({
  tag,
  imageSize,
  critical,
  high,
  medium,
  low,
  creatorDate,
  creatorName,
  lastCheckedAt,
}: PrivateRegistryImageTagCardProps) {
  const handleClickMore = () => {
    alert("준비중입니다.");
  };
  return (
    <Card
      title={tag}
      actionElement={
        <IconWrapper onClick={handleClickMore}>
          <MyIcon name="MoreHorizonal" size={24} color="var(--icon-fill)" />
        </IconWrapper>
      }
      height="118px"
      showHeader={true}
      style={{ marginBottom: "12px" }}
    >
      <Container>
        {/* 상단 영역: 생성자 ~ 이미지 크기 */}
        <Body>
          <InfoRowWithDivider>
            <InfoGroup>
              <InfoRow>
                <Label>생성자 :</Label>
                <Value>{creatorName}</Value>
              </InfoRow>
              <InfoRow>
                <Label>생성일 :</Label>
                <Value>{format(creatorDate, "yyyy.MM.dd")}</Value>
              </InfoRow>
            </InfoGroup>
            <VerticalDivider />
            <InfoGroup>
              <InfoRow>
                <Label>최근 검증일 :</Label>
                <Value>{format(lastCheckedAt, "yyyy.MM.dd")}</Value>
              </InfoRow>
              <InfoRow>
                <Label>이미지 크기 :</Label>
                <Value>{imageSize}</Value>
              </InfoRow>
            </InfoGroup>
          </InfoRowWithDivider>
        </Body>
        {/* 하단 영역: 취약점 */}
        <Footer>
          <Label>취약점 :</Label>
          <VulnerabilityList>
            <VulnerabilityItem>
              <VulnerabilityType className="critical">
                Critical
              </VulnerabilityType>
              <VulnerabilityCount>{critical}개</VulnerabilityCount>
            </VulnerabilityItem>
            <VulnerabilityItem>
              <VulnerabilityType className="high">High</VulnerabilityType>
              <VulnerabilityCount>{high}개</VulnerabilityCount>
            </VulnerabilityItem>
            <VulnerabilityItem>
              <VulnerabilityType className="medium">Medium</VulnerabilityType>
              <VulnerabilityCount>{medium}개</VulnerabilityCount>
            </VulnerabilityItem>
            <VulnerabilityItem>
              <VulnerabilityType className="low">Low</VulnerabilityType>
              <VulnerabilityCount>{low}개</VulnerabilityCount>
            </VulnerabilityItem>
          </VulnerabilityList>
        </Footer>
      </Container>
    </Card>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
  padding: 5px;
  gap: 6px;
`;

const IconWrapper = styled.button`
  width: 24px;
  height: 24px;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;

  --icon-fill: #404040;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
  }
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  width: 100%;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  height: 14px;
  min-height: 14px;
`;

const InfoRowWithDivider = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  flex: 1;
  min-height: 0;
`;

const InfoGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  min-width: 0;
  max-width: 45%;
`;

const VerticalDivider = styled.div`
  width: 1px;
  height: 40px;
  background: #e9ebee;
  margin-top: -6px;
  flex-shrink: 0;
`;

const Label = styled(Typography.Text).attrs({
  variant: "body-4-2", // 10px, 600 weight
  as: "span",
})`
  line-height: 12px;
  color: #484848;
  margin-right: 4px;
  white-space: nowrap;
`;

const Value = styled(Typography.Text).attrs({
  variant: "body-2-4", // 12px, 400 weight
  as: "span",
})`
  line-height: 14px;
  color: #191b26;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  height: 16px;
  overflow: hidden;
  flex-shrink: 0;
`;

const VulnerabilityList = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  flex: 1;
  overflow: hidden;
`;

const VulnerabilityItem = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  white-space: nowrap;
`;

const VulnerabilityType = styled(Typography.Text).attrs({
  variant: "body-4-2", // 10px, 600 weight
  as: "span",
})`
  line-height: 12px;
  
  &.critical {
    color: var(--critical-text-color);
  }

  &.high {
    color: var(--high-text-color);
  }

  &.medium {
    color: var(--medium-text-color);
  }

  &.low {
    color: var(--low-text-color);
  }
`;

const VulnerabilityCount = styled(Typography.Text).attrs({
  variant: "body-2-4", // 12px, 400 weight
  as: "span",
})`
  line-height: 16px;
  color: #000000;
`;
