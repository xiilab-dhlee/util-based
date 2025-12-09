"use client";

import { useParams } from "next/navigation";
import styled from "styled-components";

import {
  REPORT_DATE_TYPE_TEXT,
  REPORT_TYPE_TEXT,
} from "@/domain/report/constants/report.constant";
import { useGetReportDetail } from "@/domain/report/hooks/use-get-report-detail";
import { subTitleStyle } from "@/styles/mixins/text";
import { JobTypeDistribution } from "./job-type-distribution";
import { JobTypeUsageTime } from "./job-type-usage-time";
import { NodeGpuChart } from "./node-gpu-chart";
import { NodeGpuUsageCard } from "./node-gpu-usage-card";
import { ReportFilter } from "./report-filter";
import { SystemGpuUsageCard } from "./system-gpu-usage-card";
import { WorkloadCreationChart } from "./workload-creation-chart";

export function SystemReportMain() {
  const params = useParams<{ id: string }>();
  const { data, isLoading, isError } = useGetReportDetail(params.id);
  console.log(data);
  if (isLoading) {
    return <LoadingWrapper>로딩 중...</LoadingWrapper>;
  }

  if (isError || !data) {
    return <div>데이터를 불러올 수 없습니다.</div>;
  }

  const {
    resourceUsage,
    reportDateType,
    reportType,
    nodes,
    jobTypeDistribution,
    jobTypeUsageTime,
    workloadCreation,
  } = data;
  const reportTitle = `${REPORT_DATE_TYPE_TEXT[reportDateType]} ${REPORT_TYPE_TEXT[reportType]} 리포트`;

  return (
    <>
      <Header>
        <PageTitle>{reportTitle}</PageTitle>
        <ReportFilter />
      </Header>
      <Body>
        {/* Section 1: GPU 월 평균 사용률 */}
        <Section>
          <SectionTitle>
            1. {resourceUsage.periodLabel} 리소스 사용현황
          </SectionTitle>
          <SubSection>
            <SubTitle>GPU 월 평균 사용률</SubTitle>
            <SystemGpuUsageCard resourceUsage={resourceUsage} />
          </SubSection>

          {/* Section 2: 노드별 GPU 사용률 - 데이터 기반 렌더링 */}
          {nodes?.map((node, index) => (
            <SubSection key={node.nodeName}>
              <NodeGpuUsageCard
                nodeName={node.nodeName}
                gpuModel={node.gpuModel}
                percentage={node.percentage}
                colorIndex={index}
                chart={
                  <NodeGpuChart
                    nodeName={node.nodeName}
                    data={node.trendData}
                  />
                }
              />
            </SubSection>
          ))}
        </Section>

        {/* Section 2: 리소스 사용 정보 */}
        <Section>
          <SectionTitle>2. 리소스 사용 정보</SectionTitle>
          <SubSection>
            <SubTitle>Job Type별 비율</SubTitle>
            <CardRow>
              <JobTypeDistribution data={jobTypeDistribution} />
              <JobTypeUsageTime data={jobTypeUsageTime} />
            </CardRow>
          </SubSection>
          <SubSection>
            <WorkloadCreationChart data={workloadCreation} />
          </SubSection>
        </Section>
      </Body>
    </>
  );
}

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
`;

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
  margin-bottom: 8px;
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

const CardRow = styled.div`
  display: flex;
  gap: 12px;
  width: 100%;

  > * {
    flex: 1;
  }
`;
