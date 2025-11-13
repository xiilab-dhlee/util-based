"use client";

import styled from "styled-components";
import { Card, Icon, Typography } from "xiilab-ui";

interface ValidationCardProps {
  version: string;
  creator: string;
  createdDate: string;
  lastVerifiedDate: string;
  imageSize: string;
  vulnerabilities: {
    critical?: number;
    high?: number;
    medium?: number;
    low?: number;
  };
}

export function PrivateRegistryValidationCard({
  version,
  creator,
  createdDate,
  lastVerifiedDate,
  imageSize,
  vulnerabilities,
}: ValidationCardProps) {
  return (
    <Card
      title={version}
      actionElement={
        <MoreButton>
          <Icon name="MoreHorizonal" size={24} />
        </MoreButton>
      }
      width="352px"
      height="118px"
      showHeader={true}
      style={{ marginBottom: "12px" }}
    >
      <ContentWrapper>
        {/* 상단 영역: 생성자 ~ 이미지 크기 */}
        <InfoSection>
          <InfoRowWithDivider>
            <InfoGroup>
              <InfoRow>
                <InfoLabel>생성자 :</InfoLabel>
                <InfoValue>{creator}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>생성일 :</InfoLabel>
                <InfoValue>{createdDate}</InfoValue>
              </InfoRow>
            </InfoGroup>

            <VerticalDivider />

            <InfoGroup>
              <InfoRow>
                <InfoLabel>최근 검증일 :</InfoLabel>
                <InfoValue>{lastVerifiedDate}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>이미지 크기 :</InfoLabel>
                <InfoValue>{imageSize}</InfoValue>
              </InfoRow>
            </InfoGroup>
          </InfoRowWithDivider>
        </InfoSection>

        {/* 하단 영역: 취약점 */}
        <VulnerabilitySection>
          <VulnerabilityLabel>취약점 :</VulnerabilityLabel>
          <VulnerabilityList>
            {vulnerabilities.critical && vulnerabilities.critical > 0 && (
              <VulnerabilityItem>
                <VulnerabilityType $color="#FF3737">Critical</VulnerabilityType>
                <VulnerabilityCount>
                  {vulnerabilities.critical}개
                </VulnerabilityCount>
              </VulnerabilityItem>
            )}
            {vulnerabilities.high && vulnerabilities.high > 0 && (
              <VulnerabilityItem>
                <VulnerabilityType $color="#FFA052">High</VulnerabilityType>
                <VulnerabilityCount>
                  {vulnerabilities.high}개
                </VulnerabilityCount>
              </VulnerabilityItem>
            )}
            {vulnerabilities.medium && vulnerabilities.medium > 0 && (
              <VulnerabilityItem>
                <VulnerabilityType $color="#366BFF">Medium</VulnerabilityType>
                <VulnerabilityCount>
                  {vulnerabilities.medium}개
                </VulnerabilityCount>
              </VulnerabilityItem>
            )}
            {vulnerabilities.low && vulnerabilities.low > 0 && (
              <VulnerabilityItem>
                <VulnerabilityType $color="#09DE5E">Low</VulnerabilityType>
                <VulnerabilityCount>{vulnerabilities.low}개</VulnerabilityCount>
              </VulnerabilityItem>
            )}
          </VulnerabilityList>
        </VulnerabilitySection>
      </ContentWrapper>
    </Card>
  );
}


const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
  padding: 5px;
  gap: 6px;
`;

const MoreButton = styled.div`
  width: 24px;
  height: 24px;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;

  svg {
    color: #404040;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
  }
`;

const InfoSection = styled.div`
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

const InfoLabel = styled(Typography.Text).attrs({
  variant: "body-4-2", // 10px, 600 weight
  as: "span",
})`
  line-height: 12px;
  color: #484848;
  margin-right: 4px;
  white-space: nowrap;
`;

const InfoValue = styled(Typography.Text).attrs({
  variant: "body-2-4", // 12px, 400 weight
  as: "span",
})`
  line-height: 14px;
  color: #191b26;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const VulnerabilitySection = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  height: 16px;
  overflow: hidden;
  flex-shrink: 0;
`;

const VulnerabilityLabel = styled(Typography.Text).attrs({
  variant: "body-4-2", // 10px, 600 weight
  as: "span",
})`
  line-height: 12px;
  color: #484848;
  white-space: nowrap;
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
})<{ $color: string }>`
  line-height: 12px;
  color: ${({ $color }) => $color};
`;

const VulnerabilityCount = styled(Typography.Text).attrs({
  variant: "body-2-4", // 12px, 400 weight
  as: "span",
})`
  line-height: 16px;
  color: #000000;
`;
