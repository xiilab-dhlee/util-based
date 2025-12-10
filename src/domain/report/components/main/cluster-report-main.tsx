"use client";

import styled from "styled-components";

import { ResourceUsageCards } from "@/domain/report/components/cards";
import { ResourceUsageTrendCharts } from "@/domain/report/components/charts";
import { ReportFilter } from "@/domain/report/components/common";
import {
  NodeResourceUtilization,
  NodeWorkloadDistribution,
} from "@/domain/report/components/tables";
import {
  REPORT_DATE_TYPE_TEXT,
  REPORT_TYPE_TEXT,
} from "@/domain/report/constants/report.constant";
import {
  type ClusterReportSection,
  useSectionToggles,
} from "@/domain/report/hooks/use-section-toggles";
import type { ReportDetailResponse } from "@/domain/report/schemas/report.schema";
import { subTitleStyle } from "@/styles/mixins/text";

interface ClusterReportMainProps {
  report: ReportDetailResponse;
}

/** 클러스터 리포트에서 토글이 필요한 섹션들 */
const CLUSTER_REPORT_SECTIONS: ClusterReportSection[] = [
  "nodeWorkload",
  "nodeResource",
];

export function ClusterReportMain({ report }: ClusterReportMainProps) {
  // 커스텀 훅으로 토글 상태 관리 통합
  const { getToggleProps } = useSectionToggles(CLUSTER_REPORT_SECTIONS);

  const { resourceUsage, reportDateType, reportType, resourceTrends } = report;

  const reportTitle = `${REPORT_DATE_TYPE_TEXT[reportDateType]} ${REPORT_TYPE_TEXT[reportType]} 리포트`;

  return (
    <>
      <Header>
        <PageTitle>{reportTitle}</PageTitle>
        <ReportFilter />
      </Header>
      <Body>
        <Section>
          <SectionTitle>
            1. {REPORT_DATE_TYPE_TEXT[reportDateType]} 리소스 활용 정보
          </SectionTitle>
          <SubSection>
            <SubTitle>{resourceUsage.title}</SubTitle>
            <ResourceUsageCards
              resourceUsage={resourceUsage}
              reportDateType={reportDateType}
            />
          </SubSection>
          <SubSection>
            <SubTitle>리소스 사용량 추이</SubTitle>
            <ResourceUsageTrendCharts resourceTrends={resourceTrends} />
          </SubSection>
        </Section>
        <Section>
          <NodeWorkloadDistribution
            title={
              <SectionTitle>2. 노드별 워크로드 작업 분배 정보</SectionTitle>
            }
            showToggle={true}
            {...getToggleProps("nodeWorkload")}
          />
        </Section>
        <Section>
          <NodeResourceUtilization
            title={<SectionTitle>3. 노드별 리소스 활용 정보</SectionTitle>}
            showToggle={true}
            {...getToggleProps("nodeResource")}
          />
        </Section>
      </Body>
    </>
  );
}

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 24px;
`;

const PageTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  line-height: 28px;
`;

const Body = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SectionTitle = styled.h3`
  font-weight: 700;
  font-size: 15px;
  line-height: 16px;
`;

const SubTitle = styled.h4`
  ${subTitleStyle(5)}
  font-size: 15px;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SubSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
