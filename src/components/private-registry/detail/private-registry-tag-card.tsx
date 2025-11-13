"use client";

import styled from "styled-components";
import { Card, Icon, Typography } from "xiilab-ui";

interface TagCardProps {
  version: string;
  creator: string;
  createdDate: string;
  imageSize: string;
  lastVerifiedDate: string;
  vulnerabilities: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

/**
 * 내부 레지스트리 태그 카드 컴포넌트
 *
 * 태그 버전, 생성자, 취약점 정보를 컴팩트하게 표시하는 카드
 */
export function PrivateRegistryTagCard({
  version,
  creator,
  createdDate,
  imageSize,
  lastVerifiedDate,
  vulnerabilities,
}: TagCardProps) {
  return (
    <Card
      title={version}
      width="352px"
      height="118px"
      style={{
        background: "#F7F9FB",
        border: "1px solid #D1D5DC",
        borderRadius: "4px",
        boxShadow:
          "0px 4px 4px 0px rgba(171, 171, 171, 0.15), inset 0px 4px 4px 0px rgba(255, 255, 255, 0.25)",
        marginBottom: "12px",
      }}
      actionElement={
        <div
          onClick={(e: any) => {
            e.stopPropagation();
            console.log("More menu clicked for", version);
          }}
          style={{ cursor: "pointer" }}
        >
          <Icon name="MoreHorizonal" size={24} style={{ color: "#404040" }} />
        </div>
      }
      onClick={() => console.log("Card clicked:", version)}
      hoverable
    >
      <CardContent>
        <InfoRow>
          <InfoLabel>생성자 :</InfoLabel>
          <InfoValue>{creator}</InfoValue>
        </InfoRow>

        <InfoRowWithDivider>
          <InfoGroup>
            <InfoRow>
              <InfoLabel>최근 검증일 :</InfoLabel>
              <InfoValue>{lastVerifiedDate}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>생성일 :</InfoLabel>
              <InfoValue>{createdDate}</InfoValue>
            </InfoRow>
          </InfoGroup>

          <VerticalDivider />

          <InfoGroup>
            <InfoRow>
              <InfoLabel>이미지 크기 :</InfoLabel>
              <InfoValue>{imageSize}</InfoValue>
            </InfoRow>
          </InfoGroup>
        </InfoRowWithDivider>

        <VulnerabilitySection>
          <VulnerabilityLabel>취약점 :</VulnerabilityLabel>
          <VulnerabilityList>
            <VulnerabilityItem>
              <VulnerabilityType $color="#FF3737">Critical</VulnerabilityType>
              <VulnerabilityCount>
                {vulnerabilities.critical}개
              </VulnerabilityCount>
            </VulnerabilityItem>
            <VulnerabilityItem>
              <VulnerabilityType $color="#FFA052">High</VulnerabilityType>
              <VulnerabilityCount>{vulnerabilities.high}개</VulnerabilityCount>
            </VulnerabilityItem>
            <VulnerabilityItem>
              <VulnerabilityType $color="#366BFF">Medium</VulnerabilityType>
              <VulnerabilityCount>
                {vulnerabilities.medium}개
              </VulnerabilityCount>
            </VulnerabilityItem>
            <VulnerabilityItem>
              <VulnerabilityType $color="#09DE5E">Low</VulnerabilityType>
              <VulnerabilityCount>{vulnerabilities.low}개</VulnerabilityCount>
            </VulnerabilityItem>
          </VulnerabilityList>
        </VulnerabilitySection>
      </CardContent>
    </Card>
  );
}


const CardContent = styled.div`
  padding: 10px 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  height: 14px;
`;

const InfoRowWithDivider = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 14px;
`;

const InfoGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const VerticalDivider = styled.div`
  width: 1px;
  height: 40px;
  background: #e9ebee;
  margin-top: -6px;
`;

const InfoLabel = styled(Typography.Text).attrs({
  variant: "body-4-2", // 10px, 600 weight
  as: "span",
})`
  line-height: 12px;
  color: #484848;
  margin-right: 4px;
`;

const InfoValue = styled(Typography.Text).attrs({
  variant: "body-2-4", // 12px, 400 weight
  as: "span",
})`
  line-height: 14px;
  color: #191b26;
`;

const VulnerabilitySection = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const VulnerabilityLabel = styled(Typography.Text).attrs({
  variant: "body-4-2", // 10px, 600 weight
  as: "span",
})`
  line-height: 12px;
  color: #484848;
`;

const VulnerabilityList = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const VulnerabilityItem = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
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
