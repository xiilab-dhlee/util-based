"use client";

import { useState } from "react";
import styled from "styled-components";

import { CpuUsageWarningTable } from "@/domain/report/components/cpu-usage-warning-table";
import { DiskUsageWarningTable } from "@/domain/report/components/disk-usage-warning-table";
import { GpuTemperatureWarningTable } from "@/domain/report/components/gpu-temperature-warning-table";
import { JobTypeDistribution } from "@/domain/report/components/job-type-distribution";
import { JobTypeUsageTime } from "@/domain/report/components/job-type-usage-time";
import { MemoryUsageWarningTable } from "@/domain/report/components/memory-usage-warning-table";
import { NodeGpuChart } from "@/domain/report/components/node-gpu-chart";
import { NodeGpuUsageCard } from "@/domain/report/components/node-gpu-usage-card";
import { NodeSystemInfoTable } from "@/domain/report/components/node-system-info-table";
import { ReportFilter } from "@/domain/report/components/report-filter";
import { SystemGpuUsageCard } from "@/domain/report/components/system-gpu-usage-card";
import { UserGpuUsageTable } from "@/domain/report/components/user-gpu-usage-table";
import { WorkloadCreationChart } from "@/domain/report/components/workload-creation-chart";
import {
  REPORT_DATE_TYPE_TEXT,
  REPORT_TYPE_TEXT,
} from "@/domain/report/constants/report.constant";
import type { ReportDetailResponse } from "@/domain/report/schemas/report.schema";
import { subTitleStyle } from "@/styles/mixins/text";

interface SystemReportMainProps {
  report: ReportDetailResponse;
}

export function SystemReportMain({ report }: SystemReportMainProps) {
  // 각 테이블의 showAll state 관리
  const [userGpuShowAll, setUserGpuShowAll] = useState(false);
  const [nodeSystemShowAll, setNodeSystemShowAll] = useState(false);
  const [gpuTempShowAll, setGpuTempShowAll] = useState(false);
  const [cpuUsageShowAll, setCpuUsageShowAll] = useState(false);
  const [memoryUsageShowAll, setMemoryUsageShowAll] = useState(false);
  const [diskUsageShowAll, setDiskUsageShowAll] = useState(false);

  const {
    resourceUsage,
    reportDateType,
    reportType,
    nodes,
    jobTypeDistribution,
    jobTypeUsageTime,
    workloadCreation,
  } = report;
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
          <SubSection>
            <UserGpuUsageTable
              title={<SubTitle>사용자별 GPU 사용 비율</SubTitle>}
              showToggle={true}
              showAll={userGpuShowAll}
              onToggleShowAll={setUserGpuShowAll}
            />
          </SubSection>
        </Section>

        {/* Section 3: 노드 시스템 정보 */}
        <Section>
          <NodeSystemInfoTable
            title={<SectionTitle>3. 노드 시스템 정보</SectionTitle>}
            showToggle={true}
            showAll={nodeSystemShowAll}
            onToggleShowAll={setNodeSystemShowAll}
          />
        </Section>

        {/* Section 4: 시스템 이상 경고 */}
        <Section>
          <SectionTitle>4. 시스템 이상 경고</SectionTitle>
          <SubSection>
            <GpuTemperatureWarningTable
              title={<SubTitle>GPU 온도 90도 이상</SubTitle>}
              showToggle={true}
              showAll={gpuTempShowAll}
              onToggleShowAll={setGpuTempShowAll}
            />
          </SubSection>
          <SubSection>
            <CpuUsageWarningTable
              title={<SubTitle>CPU 사용률 90% 이상</SubTitle>}
              showToggle={true}
              showAll={cpuUsageShowAll}
              onToggleShowAll={setCpuUsageShowAll}
            />
          </SubSection>
          <SubSection>
            <MemoryUsageWarningTable
              title={<SubTitle>Memory 사용률 90% 이상</SubTitle>}
              showToggle={true}
              showAll={memoryUsageShowAll}
              onToggleShowAll={setMemoryUsageShowAll}
            />
          </SubSection>
          <SubSection>
            <DiskUsageWarningTable
              title={<SubTitle>Disk 사용률 90% 이상</SubTitle>}
              showToggle={true}
              showAll={diskUsageShowAll}
              onToggleShowAll={setDiskUsageShowAll}
            />
          </SubSection>
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

const CardRow = styled.div`
  display: flex;
  gap: 12px;
  width: 100%;

  > * {
    flex: 1;
  }
`;
