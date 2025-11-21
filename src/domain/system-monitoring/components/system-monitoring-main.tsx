"use client";

import styled from "styled-components";
import { DateRange, Dropdown, Icon, Typography } from "xiilab-ui";

import { MONITORING_MENU_ICON } from "@/domain/monitoring/constants/monitoring.constant";
import { SystemMonitoringCard } from "@/domain/system-monitoring/components/system-monitoring-card";
import { PageHeader } from "@/shared/components/layouts/page-header";
import { hideScrollbar } from "@/styles/mixins/scrollbar";

export function SystemMonitoringMain() {
  return (
    <>
      <PageHeader
        title="시스템 모니터링"
        icon={MONITORING_MENU_ICON}
        description="System monitoring"
        breadcrumbKey="admin.system-monitoring"
      />
      <Container>
        <ArticleHeader>
          <Typography.Text variant="title-2">
            시스템 모니터링 정보
          </Typography.Text>
          <ArticleHeaderRight>
            <SelectLabel>노드 목록</SelectLabel>
            <Dropdown
              options={[]}
              onChange={() => {}}
              value={null}
              width={160}
              height={30}
            />
          </ArticleHeaderRight>
        </ArticleHeader>
        <SummaryArticle>
          <SummaryArticleItem>
            <SummaryIconWrapper>
              <Icon name="SingleNode" color="#000000" size={30} />
            </SummaryIconWrapper>
            <SummaryArticleBody>
              <SummaryArticleKey>a5000</SummaryArticleKey>
              <SummaryArticleValue>10.61.3.138</SummaryArticleValue>
            </SummaryArticleBody>
          </SummaryArticleItem>
          <SummaryArticleItem>
            <SummaryIconWrapper>
              <Icon name="Gpu" color="#A353FF" size={30} />
            </SummaryIconWrapper>
            <SummaryArticleBody>
              <SummaryArticleKey>GPU</SummaryArticleKey>
              <SummaryArticleValue>16개</SummaryArticleValue>
            </SummaryArticleBody>
          </SummaryArticleItem>
          <SummaryArticleItem>
            <SummaryIconWrapper>
              <Icon name="Cpu" color="#5792FF" size={30} />
            </SummaryIconWrapper>
            <SummaryArticleBody>
              <SummaryArticleKey>CPU</SummaryArticleKey>
              <SummaryArticleValue>32.0 CORE</SummaryArticleValue>
            </SummaryArticleBody>
          </SummaryArticleItem>
          <SummaryArticleItem>
            <SummaryIconWrapper>
              <Icon name="Mem" color="#55D398" size={30} />
            </SummaryIconWrapper>
            <SummaryArticleBody>
              <SummaryArticleKey>MEMORY</SummaryArticleKey>
              <SummaryArticleValue>62.8 GB</SummaryArticleValue>
            </SummaryArticleBody>
          </SummaryArticleItem>
          <SummaryArticleItem>
            <SummaryIconWrapper>
              <Icon name="Play" color="#17CDE5" size={30} />
            </SummaryIconWrapper>
            <SummaryArticleBody>
              <SummaryArticleKey>DISK</SummaryArticleKey>
              <SummaryArticleValue>62.8 GB</SummaryArticleValue>
            </SummaryArticleBody>
          </SummaryArticleItem>
        </SummaryArticle>
        <ArticleHeader>
          <Typography.Text variant="title-2">그래프</Typography.Text>
          <ArticleHeaderRight>
            <Dropdown
              options={[]}
              onChange={() => {}}
              value={null}
              width={160}
              height={30}
            />
            <DateWrapper>
              <DateIconWrapper>
                <Icon name="Play" color="#4042D5" size={20} />
              </DateIconWrapper>
              <DateRange
                height={30}
                width={250}
                startDate={new Date()}
                endDate={new Date()}
                withTime
                onChange={() => {}}
                maxDate={new Date()}
              />
            </DateWrapper>
          </ArticleHeaderRight>
        </ArticleHeader>
        <ChartArticle>
          <ChartSingleRow>
            <SystemMonitoringCard type="gpu-utilization" />
          </ChartSingleRow>
          <ChartMultiRow>
            <SystemMonitoringCard type="cpu-utilization" />
            <SystemMonitoringCard type="memory-utilization" />
          </ChartMultiRow>
          <ChartMultiRow>
            <SystemMonitoringCard type="cpu-usage" />
            <SystemMonitoringCard type="memory-usage" />
          </ChartMultiRow>
          <ChartMultiRow>
            <SystemMonitoringCard type="disk-utilization" />
            <SystemMonitoringCard type="disk-usage" />
          </ChartMultiRow>
          <ChartMultiRow>
            <SystemMonitoringCard type="gpu-memory" />
            <SystemMonitoringCard type="memory-usage" />
          </ChartMultiRow>
          <ChartMultiRow>
            <SystemMonitoringCard type="cpu-usage" />
            <SystemMonitoringCard type="memory-usage" />
          </ChartMultiRow>
        </ChartArticle>
      </Container>
    </>
  );
}

const Container = styled.div`
  overflow-y: auto;
  position: relative;
  padding: 24px 26px;
  height: 100%;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.15);
  background-color: #fafafa;

  ${hideScrollbar}
`;

const ArticleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const ArticleHeaderRight = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
`;

const SelectLabel = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: #000;
`;

const SummaryArticle = styled.article`
  padding: 22px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background-color: #f7f9fb;
  margin-bottom: 10px;
`;

const SummaryArticleItem = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;

  & + & {
    border-left: 1px solid #e0e0e0;
    padding-left: 20px;
    margin-left: 20px;
  }
`;

const SummaryIconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #fafafa;
  border-radius: 2px;
  border: 1px solid #d1d5dc;
`;

const SummaryArticleBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  justify-content: center;
`;

const SummaryArticleKey = styled.div`
  font-weight: 500;
  font-size: 16px;
  line-height: 18px;
  color: #000;
`;

const SummaryArticleValue = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  color: #6b6b6b;
`;

const DateWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background-color: #f2f7ff;

  & input {
    border-top-left-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
  }
`;

const DateIconWrapper = styled.button`
  display: flex;
  width: 30px;
  height: 30px;
  justify-content: center;
  align-items: center;
  border: 1px solid #ced2d6;
  border-right-width: 0;
  border-top-left-radius: 2px;
  border-bottom-left-radius: 2px;
`;

const ChartSingleRow = styled.div`
  height: 390px;
  margin-bottom: 10px;
`;

const ChartMultiRow = styled.div`
  height: 390px;
  display: flex;
  flex-direction: row;
  gap: 10px;
  margin-bottom: 10px;
`;

const ChartArticle = styled.article`
  height: 2370px;
  margin-bottom: 24px;
`;
