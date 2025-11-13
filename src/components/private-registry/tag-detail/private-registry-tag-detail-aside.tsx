"use client";

import styled from "styled-components";
import { Icon, Typography } from "xiilab-ui";

import {
  SEVERITY_LEVEL_COLORS,
  SEVERITY_LEVEL_LABELS,
  SEVERITY_LEVELS,
} from "@/constants/private-registry/severity.constant";

type TagDetailAsideProps = {};

const ChartBackground = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="74"
    height="88"
    viewBox="0 0 74 88"
    fill="none"
  >
    <line
      x1="36.5"
      y1="1.91795e-08"
      x2="36.5"
      y2="88"
      stroke="url(#paint0_linear_2198_135373)"
    />
    <line
      x1="20.5"
      y1="1.91795e-08"
      x2="20.5"
      y2="88"
      stroke="url(#paint1_linear_2198_135373)"
    />
    <line
      x1="28.5"
      y1="1.91795e-08"
      x2="28.5"
      y2="88"
      stroke="url(#paint2_linear_2198_135373)"
    />
    <line
      x1="44.5"
      y1="1.91795e-08"
      x2="44.5"
      y2="88"
      stroke="url(#paint3_linear_2198_135373)"
    />
    <line
      x1="12.5"
      y1="1.91795e-08"
      x2="12.5"
      y2="88"
      stroke="url(#paint4_linear_2198_135373)"
      strokeOpacity="0.3"
    />
    <line
      opacity="0.1"
      x1="69"
      y1="86.5"
      x2="4.00001"
      y2="86.5"
      stroke="url(#paint5_linear_2198_135373)"
    />
    <line
      opacity="0.5"
      x1="69"
      y1="70.5"
      x2="4"
      y2="70.5"
      stroke="url(#paint6_linear_2198_135373)"
    />
    <line
      opacity="0.3"
      x1="69"
      y1="78.5"
      x2="4.00001"
      y2="78.5"
      stroke="url(#paint7_linear_2198_135373)"
    />
    <line
      opacity="0.7"
      x1="69"
      y1="62.5"
      x2="4"
      y2="62.5"
      stroke="url(#paint8_linear_2198_135373)"
    />
    <line
      x1="69"
      y1="54.5"
      x2="4"
      y2="54.5"
      stroke="url(#paint9_linear_2198_135373)"
    />
    <line
      x1="69"
      y1="54.5"
      x2="4"
      y2="54.5"
      stroke="url(#paint10_linear_2198_135373)"
      strokeOpacity="0.2"
    />
    <g opacity="0.5">
      <line
        x1="69"
        y1="22.5"
        x2="4"
        y2="22.5"
        stroke="url(#paint11_linear_2198_135373)"
      />
      <line
        x1="69"
        y1="22.5"
        x2="4"
        y2="22.5"
        stroke="url(#paint12_linear_2198_135373)"
        strokeOpacity="0.2"
      />
    </g>
    <g opacity="0.7">
      <line
        x1="69"
        y1="30.5"
        x2="4"
        y2="30.5"
        stroke="url(#paint13_linear_2198_135373)"
      />
      <line
        x1="69"
        y1="30.5"
        x2="4"
        y2="30.5"
        stroke="url(#paint14_linear_2198_135373)"
        strokeOpacity="0.2"
      />
    </g>
    <g opacity="0.7">
      <line
        x1="69"
        y1="38.5"
        x2="4"
        y2="38.5"
        stroke="url(#paint15_linear_2198_135373)"
      />
      <line
        x1="69"
        y1="38.5"
        x2="4"
        y2="38.5"
        stroke="url(#paint16_linear_2198_135373)"
        strokeOpacity="0.2"
      />
    </g>
    <line
      x1="69"
      y1="46.5"
      x2="4"
      y2="46.5"
      stroke="url(#paint17_linear_2198_135373)"
    />
    <line
      x1="69"
      y1="46.5"
      x2="4"
      y2="46.5"
      stroke="url(#paint18_linear_2198_135373)"
      strokeOpacity="0.2"
    />
    <g opacity="0.3">
      <line
        x1="74"
        y1="14.5"
        x2="4"
        y2="14.5"
        stroke="url(#paint19_linear_2198_135373)"
      />
      <line
        x1="74"
        y1="14.5"
        x2="4"
        y2="14.5"
        stroke="url(#paint20_linear_2198_135373)"
        strokeOpacity="0.2"
      />
    </g>
    <g opacity="0.3">
      <line
        x1="69"
        y1="6.5"
        x2="4.00001"
        y2="6.5"
        stroke="url(#paint21_linear_2198_135373)"
        strokeOpacity="0.8"
      />
      <line
        x1="69"
        y1="6.5"
        x2="4.00001"
        y2="6.5"
        stroke="url(#paint22_linear_2198_135373)"
        strokeOpacity="0.06"
      />
    </g>
    <line
      x1="52.5"
      y1="88"
      x2="52.5"
      y2="1.96255e-08"
      stroke="url(#paint23_linear_2198_135373)"
    />
    <line
      x1="60.5"
      y1="88"
      x2="60.5"
      y2="1.96255e-08"
      stroke="url(#paint24_linear_2198_135373)"
      strokeOpacity="0.56"
    />
    <rect
      opacity="0.7"
      x="72"
      width="88"
      height="72"
      rx="3"
      transform="rotate(90 72 0)"
      fill="#070913"
    />
    <defs>
      <linearGradient
        id="paint0_linear_2198_135373"
        x1="35.5"
        y1="-1.91795e-08"
        x2="35.5"
        y2="88"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#070913" />
        <stop offset="0.5" stopColor="white" />
        <stop offset="1" stopColor="#070913" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_2198_135373"
        x1="19.5"
        y1="-1.91795e-08"
        x2="19.5"
        y2="88"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#070913" />
        <stop offset="0.5" stopColor="white" />
        <stop offset="1" stopColor="#070913" />
      </linearGradient>
      <linearGradient
        id="paint2_linear_2198_135373"
        x1="27.5"
        y1="-1.91795e-08"
        x2="27.5"
        y2="88"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#070913" />
        <stop offset="0.5" stopColor="white" />
        <stop offset="1" stopColor="#070913" />
      </linearGradient>
      <linearGradient
        id="paint3_linear_2198_135373"
        x1="43.5"
        y1="-1.91795e-08"
        x2="43.5"
        y2="88"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#070913" />
        <stop offset="0.5" stopColor="white" />
        <stop offset="1" stopColor="#070913" />
      </linearGradient>
      <linearGradient
        id="paint4_linear_2198_135373"
        x1="11.5"
        y1="-1.91795e-08"
        x2="11.5"
        y2="88"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#070913" />
        <stop offset="0.5" stopColor="white" />
        <stop offset="1" stopColor="#070913" />
      </linearGradient>
      <linearGradient
        id="paint5_linear_2198_135373"
        x1="69"
        y1="85.5"
        x2="4.00001"
        y2="85.5"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#070913" />
        <stop offset="0.389423" stopColor="white" />
        <stop offset="0.925481" stopColor="white" />
        <stop offset="1" stopColor="#070913" />
      </linearGradient>
      <linearGradient
        id="paint6_linear_2198_135373"
        x1="69"
        y1="69.5"
        x2="4"
        y2="69.5"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#070913" />
        <stop offset="0.109797" stopColor="white" stopOpacity="0.8" />
        <stop offset="0.925481" stopColor="white" />
        <stop offset="1" stopColor="#070913" />
      </linearGradient>
      <linearGradient
        id="paint7_linear_2198_135373"
        x1="69"
        y1="77.5"
        x2="4.00001"
        y2="77.5"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#070913" />
        <stop offset="0.389423" stopColor="white" />
        <stop offset="0.925481" stopColor="white" />
        <stop offset="1" stopColor="#070913" />
      </linearGradient>
      <linearGradient
        id="paint8_linear_2198_135373"
        x1="69"
        y1="61.5"
        x2="4"
        y2="61.5"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#070913" />
        <stop offset="0.0769231" stopColor="white" stopOpacity="0.8" />
        <stop offset="0.925481" stopColor="white" />
        <stop offset="1" stopColor="#070913" />
      </linearGradient>
      <linearGradient
        id="paint9_linear_2198_135373"
        x1="69"
        y1="53.5"
        x2="4"
        y2="53.5"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#070913" />
        <stop offset="0.0769231" stopColor="white" stopOpacity="0.8" />
        <stop offset="0.925481" stopColor="white" />
        <stop offset="1" stopColor="#070913" />
      </linearGradient>
      <linearGradient
        id="paint10_linear_2198_135373"
        x1="69"
        y1="53.5"
        x2="4"
        y2="53.5"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopOpacity="0" />
        <stop offset="1" />
      </linearGradient>
      <linearGradient
        id="paint11_linear_2198_135373"
        x1="69"
        y1="21.5"
        x2="4"
        y2="21.5"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#070913" />
        <stop offset="0.0769231" stopColor="white" stopOpacity="0.8" />
        <stop offset="0.925481" stopColor="white" />
        <stop offset="1" stopColor="#070913" />
      </linearGradient>
      <linearGradient
        id="paint12_linear_2198_135373"
        x1="69"
        y1="21.5"
        x2="4"
        y2="21.5"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopOpacity="0" />
        <stop offset="1" />
      </linearGradient>
      <linearGradient
        id="paint13_linear_2198_135373"
        x1="69"
        y1="29.5"
        x2="4"
        y2="29.5"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#070913" />
        <stop offset="0.0769231" stopColor="white" stopOpacity="0.8" />
        <stop offset="0.925481" stopColor="white" />
        <stop offset="1" stopColor="#070913" />
      </linearGradient>
      <linearGradient
        id="paint14_linear_2198_135373"
        x1="69"
        y1="29.5"
        x2="4"
        y2="29.5"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopOpacity="0" />
        <stop offset="1" />
      </linearGradient>
      <linearGradient
        id="paint15_linear_2198_135373"
        x1="69"
        y1="37.5"
        x2="4"
        y2="37.5"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#070913" />
        <stop offset="0.0769231" stopColor="white" stopOpacity="0.8" />
        <stop offset="0.925481" stopColor="white" />
        <stop offset="1" stopColor="#070913" />
      </linearGradient>
      <linearGradient
        id="paint16_linear_2198_135373"
        x1="69"
        y1="37.5"
        x2="4"
        y2="37.5"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopOpacity="0" />
        <stop offset="1" />
      </linearGradient>
      <linearGradient
        id="paint17_linear_2198_135373"
        x1="69"
        y1="45.5"
        x2="4"
        y2="45.5"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#070913" />
        <stop offset="0.0769231" stopColor="white" stopOpacity="0.8" />
        <stop offset="0.925481" stopColor="white" />
        <stop offset="1" stopColor="#070913" />
      </linearGradient>
      <linearGradient
        id="paint18_linear_2198_135373"
        x1="69"
        y1="45.5"
        x2="4"
        y2="45.5"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopOpacity="0" />
        <stop offset="1" />
      </linearGradient>
      <linearGradient
        id="paint19_linear_2198_135373"
        x1="74"
        y1="13.5"
        x2="4"
        y2="13.5"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#070913" />
        <stop offset="0.389423" stopColor="white" />
        <stop offset="0.925481" stopColor="white" />
        <stop offset="1" stopColor="#070913" />
      </linearGradient>
      <linearGradient
        id="paint20_linear_2198_135373"
        x1="74"
        y1="13.5"
        x2="4"
        y2="13.5"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopOpacity="0" />
        <stop offset="1" />
      </linearGradient>
      <linearGradient
        id="paint21_linear_2198_135373"
        x1="69"
        y1="5.5"
        x2="4.00001"
        y2="5.49999"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#070913" />
        <stop offset="0.389423" stopColor="white" />
        <stop offset="0.801863" stopColor="white" />
        <stop offset="1" stopColor="#070913" />
      </linearGradient>
      <linearGradient
        id="paint22_linear_2198_135373"
        x1="69"
        y1="5.5"
        x2="4.00001"
        y2="5.49999"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopOpacity="0" />
        <stop offset="1" />
      </linearGradient>
      <linearGradient
        id="paint23_linear_2198_135373"
        x1="53.5"
        y1="-1.96255e-08"
        x2="53.5"
        y2="88"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#070913" />
        <stop offset="0.5" stopColor="white" />
        <stop offset="1" stopColor="#070913" />
      </linearGradient>
      <linearGradient
        id="paint24_linear_2198_135373"
        x1="61.5"
        y1="-1.96255e-08"
        x2="61.5"
        y2="88"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#070913" />
        <stop offset="0.5" stopColor="white" />
        <stop offset="1" stopColor="#070913" />
      </linearGradient>
    </defs>
  </svg>
);

export function PrivateRegistryTagDetailAside({}: TagDetailAsideProps) {
  const tagInfo = {
    version: "v.1.2",
    creator: "이수빈",
    createdDate: "2025.01.01",
    size: "5MB",
    status: "검증 완료",
    vulnerabilities: {
      critical: 14,
      high: 23,
      medium: 17,
      low: 58,
    },
  };

  return (
    <Container>
      <TagTitleSection>
        <TagTitle>{tagInfo.version}</TagTitle>
      </TagTitleSection>
      {/* 태그 기본정보 카드 */}
      <InfoCard>
        <InfoRow>
          <InfoRowContent>
            <InfoIcon>
              <Icon name="Info" size={24} />
            </InfoIcon>
            <InfoLabel>상태 :</InfoLabel>
            <StatusBadge>
              <StatusDot />
              {tagInfo.status}
            </StatusBadge>
          </InfoRowContent>
        </InfoRow>

        <InfoRow>
          <InfoRowContent>
            <InfoIcon>
              <Icon name="PersonFilled" size={24} />
            </InfoIcon>
            <InfoLabel>생성자 :</InfoLabel>
            <InfoValue>{tagInfo.creator}</InfoValue>
          </InfoRowContent>
        </InfoRow>

        <InfoRow>
          <InfoRowContent>
            <InfoIcon>
              <Icon name="Calendar01" size={24} />
            </InfoIcon>
            <InfoLabel>생성일 :</InfoLabel>
            <InfoValue>{tagInfo.createdDate}</InfoValue>
          </InfoRowContent>
        </InfoRow>

        <InfoRow>
          <InfoRowContent>
            <InfoIcon>
              <SizeIcon>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                >
                  <path
                    d="M0 10V5.71429H1.42857V8.57143H4.28571V10H0ZM8.57143 4.28571V1.42857H5.71429V0H10V4.28571H8.57143Z"
                    fill="#E8EAED"
                  />
                </svg>
              </SizeIcon>
            </InfoIcon>
            <InfoLabel>크기 :</InfoLabel>
            <InfoValue>{tagInfo.size}</InfoValue>
          </InfoRowContent>
        </InfoRow>
      </InfoCard>

      {/* 취약점 심각도 현황 */}
      <SectionTitle>취약점 심각도 현황</SectionTitle>

      <VulnerabilityGrid>
        <SimpleVulnerabilityCard>
          <VulnerabilityLeft>
            <VulnerabilityChart>
              <VulnerabilityChartBg>
                <ChartBackground />
              </VulnerabilityChartBg>
            </VulnerabilityChart>
            <VulnerabilityIcon $severity={SEVERITY_LEVELS.CRITICAL}>
              <Icon name="Critical" size={38} />
            </VulnerabilityIcon>
          </VulnerabilityLeft>
          <VulnerabilityRight>
            <VulnerabilityLabelRow>
              <VulnerabilityDot $severity={SEVERITY_LEVELS.CRITICAL} />
              <VulnerabilityLabel $severity={SEVERITY_LEVELS.CRITICAL}>
                {SEVERITY_LEVEL_LABELS[SEVERITY_LEVELS.CRITICAL]}
              </VulnerabilityLabel>
            </VulnerabilityLabelRow>
            <VulnerabilityDivider />
            <VulnerabilityCount>
              {tagInfo.vulnerabilities.critical}개
            </VulnerabilityCount>
          </VulnerabilityRight>
        </SimpleVulnerabilityCard>

        <SimpleVulnerabilityCard>
          <VulnerabilityLeft>
            <VulnerabilityChart>
              <VulnerabilityChartBg>
                <ChartBackground />
              </VulnerabilityChartBg>
            </VulnerabilityChart>
            <VulnerabilityIcon $severity={SEVERITY_LEVELS.HIGH}>
              <Icon name="High" size={38} />
            </VulnerabilityIcon>
          </VulnerabilityLeft>
          <VulnerabilityRight>
            <VulnerabilityLabelRow>
              <VulnerabilityDot $severity={SEVERITY_LEVELS.HIGH} />
              <VulnerabilityLabel $severity={SEVERITY_LEVELS.HIGH}>
                {SEVERITY_LEVEL_LABELS[SEVERITY_LEVELS.HIGH]}
              </VulnerabilityLabel>
            </VulnerabilityLabelRow>
            <VulnerabilityDivider />
            <VulnerabilityCount>
              {tagInfo.vulnerabilities.high}개
            </VulnerabilityCount>
          </VulnerabilityRight>
        </SimpleVulnerabilityCard>

        <SimpleVulnerabilityCard>
          <VulnerabilityLeft>
            <VulnerabilityChart>
              <VulnerabilityChartBg>
                <ChartBackground />
              </VulnerabilityChartBg>
            </VulnerabilityChart>
            <VulnerabilityIcon $severity={SEVERITY_LEVELS.MEDIUM}>
              <Icon name="Medium" size={38} />
            </VulnerabilityIcon>
          </VulnerabilityLeft>
          <VulnerabilityRight>
            <VulnerabilityLabelRow>
              <VulnerabilityDot $severity={SEVERITY_LEVELS.MEDIUM} />
              <VulnerabilityLabel $severity={SEVERITY_LEVELS.MEDIUM}>
                {SEVERITY_LEVEL_LABELS[SEVERITY_LEVELS.MEDIUM]}
              </VulnerabilityLabel>
            </VulnerabilityLabelRow>
            <VulnerabilityDivider />
            <VulnerabilityCount>
              {tagInfo.vulnerabilities.medium}개
            </VulnerabilityCount>
          </VulnerabilityRight>
        </SimpleVulnerabilityCard>

        <SimpleVulnerabilityCard>
          <VulnerabilityLeft>
            <VulnerabilityChart>
              <VulnerabilityChartBg>
                <ChartBackground />
              </VulnerabilityChartBg>
            </VulnerabilityChart>
            <VulnerabilityIcon $severity={SEVERITY_LEVELS.LOW}>
              <Icon name="Low" size={38} />
            </VulnerabilityIcon>
          </VulnerabilityLeft>
          <VulnerabilityRight>
            <VulnerabilityLabelRow>
              <VulnerabilityDot $severity={SEVERITY_LEVELS.LOW} />
              <VulnerabilityLabel $severity={SEVERITY_LEVELS.LOW}>
                {SEVERITY_LEVEL_LABELS[SEVERITY_LEVELS.LOW]}
              </VulnerabilityLabel>
            </VulnerabilityLabelRow>
            <VulnerabilityDivider />
            <VulnerabilityCount>
              {tagInfo.vulnerabilities.low}개
            </VulnerabilityCount>
          </VulnerabilityRight>
        </SimpleVulnerabilityCard>
      </VulnerabilityGrid>
    </Container>
  );
}


const Container = styled.div`
  width: 400px;
  height: 490px;
  background: #171b26;
  border-radius: 8px;
  padding: 24px;
  box-sizing: border-box;
  flex-shrink: 0;
`;

const TagTitleSection = styled.div`
  margin-bottom: 16px;
`;

const TagTitle = styled(Typography.Text).attrs({
  variant: "body-1-3", // 13px is closest to 14px
  as: "h1",
})`
  line-height: 16px;
  color: #f5f5f5;
  margin: 0;
  font-weight: 700; // Keep 700 weight
  font-size: 14px; // Keep custom 14px
`;

const InfoCard = styled.div`
  background: #070913;
  border-radius: 8px;
  padding: 0;
  margin-bottom: 24px;
`;

const InfoRow = styled.div`
  width: 352px;
  height: 40px;
  background: #070913;
  border: 1px solid #2a3041;
  border-radius: 4px;
  margin-bottom: 8px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  box-sizing: border-box;

  &:last-child {
    margin-bottom: 0;
  }
`;

const InfoRowContent = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const InfoIcon = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #070913;
  border: 1px solid #2a3041;
  border-radius: 2px;

  svg {
    color: #e8eaed;
  }
`;

const SizeIcon = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const InfoLabel = styled(Typography.Text).attrs({
  variant: "body-2-1", // 12px, 700 weight
  as: "span",
})`
  line-height: 16px;
  color: #f5f5f5;
  white-space: nowrap;
`;

const InfoValue = styled(Typography.Text).attrs({
  variant: "body-2-4", // 12px, 400 weight
  as: "span",
})`
  line-height: 16px;
  color: #cacaca;
`;

const StatusBadge = styled(Typography.Text).attrs({
  variant: "body-2-3", // 12px, 500 weight
})`
  display: flex;
  align-items: center;
  gap: 6px;
  line-height: 14px;
  color: #98bdff;
`;

const StatusDot = styled.div`
  width: 6px;
  height: 6px;
  background: #98bdff;
  border-radius: 50%;
`;

const SectionTitle = styled(Typography.Text).attrs({
  variant: "body-1-3", // 13px is closest to 14px
  as: "h2",
})`
  line-height: 16px;
  color: #f5f5f5;
  margin: 0 0 12px 0;
  font-weight: 700; // Keep 700 weight
  font-size: 14px; // Keep custom 14px
`;

const VulnerabilityGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
`;

const SimpleVulnerabilityCard = styled.div`
  width: 172px;
  height: 88px;
  background: #070913;
  border: 1px solid #2a3041;
  border-radius: 4px;
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  overflow: hidden;
`;

const VulnerabilityLeft = styled.div`
  width: 74px;
  height: 88px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1px;
`;

const VulnerabilityChart = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 74px;
  height: 88px;
  border-radius: 3px;
  overflow: hidden;
`;

const VulnerabilityChartBg = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  svg {
    width: 100%;
    height: 100%;
  }
`;

const VulnerabilityIcon = styled.div<{ $severity: string }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 42px;
  height: 42px;
  background: #070913;
  border: 1px solid #2a3041;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  box-shadow:
    0px 2px 12px rgba(106, 56, 225, 0.36),
    0px 2px 2px rgba(0, 0, 0, 0.85);

  svg {
    color: #ffffff;
    width: 38px;
    height: 38px;
  }
`;

const VulnerabilityRight = styled.div`
  flex: 1;
  height: 88px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 9px;
  background: #070913;
`;

const VulnerabilityLabelRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const VulnerabilityDot = styled.div<{ $severity: string }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ $severity }) => {
    switch ($severity) {
      case SEVERITY_LEVELS.CRITICAL:
        return SEVERITY_LEVEL_COLORS[SEVERITY_LEVELS.CRITICAL];
      case SEVERITY_LEVELS.HIGH:
        return SEVERITY_LEVEL_COLORS[SEVERITY_LEVELS.HIGH];
      case SEVERITY_LEVELS.MEDIUM:
        return SEVERITY_LEVEL_COLORS[SEVERITY_LEVELS.MEDIUM];
      case SEVERITY_LEVELS.LOW:
        return SEVERITY_LEVEL_COLORS[SEVERITY_LEVELS.LOW];
      default:
        return SEVERITY_LEVEL_COLORS[SEVERITY_LEVELS.LOW];
    }
  }};
`;

const VulnerabilityDivider = styled.div`
  width: 78px;
  height: 1px;
  background: #2a3041;
  margin: 8px 0;
`;

const VulnerabilityCount = styled(Typography.Text).attrs({
  variant: "subtitle-1", // 16px is closest to 18px
  as: "span",
})`
  line-height: 1;
  color: #f5f5f5;
  font-weight: 500; // Keep 500 weight
  font-size: 18px; // Keep custom 18px
`;

const VulnerabilityLabel = styled(Typography.Text).attrs({
  variant: "body-1-3", // 13px is closest to 14px
  as: "span",
})<{ $severity: string }>`
  line-height: 1;
  font-weight: 600; // Keep 600 weight
  font-size: 14px; // Keep custom 14px
  color: ${({ $severity }) => {
    switch ($severity) {
      case SEVERITY_LEVELS.CRITICAL:
        return SEVERITY_LEVEL_COLORS[SEVERITY_LEVELS.CRITICAL];
      case SEVERITY_LEVELS.HIGH:
        return SEVERITY_LEVEL_COLORS[SEVERITY_LEVELS.HIGH];
      case SEVERITY_LEVELS.MEDIUM:
        return SEVERITY_LEVEL_COLORS[SEVERITY_LEVELS.MEDIUM];
      case SEVERITY_LEVELS.LOW:
        return SEVERITY_LEVEL_COLORS[SEVERITY_LEVELS.LOW];
      default:
        return "#c5c6c8";
    }
  }};
`;
