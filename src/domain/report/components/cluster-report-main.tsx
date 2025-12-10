"use client";

import { useState } from "react";
import styled from "styled-components";

import {
  NodeResourceUtilization,
  NodeWorkloadDistribution,
  ReportFilter,
  ResourceUsageCards,
  ResourceUsageTrendCharts,
} from "@/domain/report/components";
import {
  REPORT_DATE_TYPE_TEXT,
  REPORT_TYPE_TEXT,
} from "@/domain/report/constants/report.constant";
import type { ReportDetailResponse } from "@/domain/report/schemas/report.schema";
import { subTitleStyle } from "@/styles/mixins/text";

interface ClusterReportMainProps {
  report: ReportDetailResponse;
}

export function ClusterReportMain({ report }: ClusterReportMainProps) {
  // 각 테이블의 showAll state 관리
  const [nodeWorkloadShowAll, setNodeWorkloadShowAll] = useState(false);
  const [nodeResourceShowAll, setNodeResourceShowAll] = useState(false);

  const {
    resourceUsage,
    reportDateType,
    reportType,
    resourceTrends,
    nodeDistribution,
    nodeResourceUtilization,
  } = report;

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
            data={nodeDistribution}
            showToggle={true}
            showAll={nodeWorkloadShowAll}
            onToggleShowAll={setNodeWorkloadShowAll}
          />
        </Section>
        <Section>
          <NodeResourceUtilization
            title={<SectionTitle>3. 노드별 리소스 활용 정보</SectionTitle>}
            data={nodeResourceUtilization}
            showToggle={true}
            showAll={nodeResourceShowAll}
            onToggleShowAll={setNodeResourceShowAll}
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
