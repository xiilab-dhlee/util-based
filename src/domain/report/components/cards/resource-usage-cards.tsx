import styled from "styled-components";
import { Card } from "xiilab-ui";

import { AVERAGE_USAGE_TEXT } from "@/domain/report/constants/report.constant";
import type { ReportDetailResponse } from "@/domain/report/schemas/report.schema";
import { SemiCircleChart } from "@/shared/components/chart/semi-circle-chart";
import { getPercent } from "@/shared/utils/calc.util";
import { getResourceInfo } from "@/shared/utils/resource.util";

interface ResourceUsageCardsProps {
  resourceUsage: ReportDetailResponse["resourceUsage"];
  reportDateType: ReportDetailResponse["reportDateType"];
}

export function ResourceUsageCards({
  resourceUsage,
  reportDateType,
}: ResourceUsageCardsProps) {
  const footerText = AVERAGE_USAGE_TEXT[reportDateType];

  return (
    <TotalResourceWrapper>
      {resourceUsage.metrics.map((metric) => {
        const { text, color, unit } = getResourceInfo(metric.type);
        const percentage = getPercent(metric.used, metric.total);

        return (
          <Card
            hoverable={false}
            key={metric.type}
            contentVariant="compact"
            actionElement={
              <Capacity>
                전체: {metric.total}
                {unit}
              </Capacity>
            }
            title={text}
            height={172}
          >
            <ChartContainer>
              <SemiCircleChart
                series={percentage}
                color={color}
                trackBackground="#EAEBF3"
              />
              <TextOverlay>
                <Percentage>{percentage}%</Percentage>
                <Divider />
                <FooterText>{footerText}</FooterText>
              </TextOverlay>
            </ChartContainer>
          </Card>
        );
      })}
    </TotalResourceWrapper>
  );
}

const TotalResourceWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
`;

const ChartContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const TextOverlay = styled.div`
  position: absolute;
  bottom: 8%;
  left: 50%;
  transform: translate(-50%, 0%);
  display: flex;
  flex-direction: column;
  align-items: center;

`;

const Percentage = styled.div`

  font-size: 26px;
  font-weight: 600;
  line-height: 1.2;
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: #e3e9f1;
  margin-bottom: 1px;
`;

const FooterText = styled.div`

  font-size: 11px;
  font-weight: 400;
  color: #333333;

`;

const Capacity = styled.span`
  display: flex;
  align-items: center;
  font-size: 12px;
  font-weight: 400;
`;
