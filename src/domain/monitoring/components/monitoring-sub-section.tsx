import styled from "styled-components";

import { MonitoringWorkloadStatus } from "@/domain/monitoring/components/monitoring-workload-status";
import { UserMonitoringRunningWorkloadCard } from "@/domain/user-monitoring/components/user-monitoring-running-workload-card";
import { VolumeWorkloadCard } from "@/domain/volume/components/detail/volume-workload-card";
import type { WorkloadStatusType } from "@/domain/workload/schemas/workload.schema";
import { workloadListMock } from "@/mocks/data/workload.mock";
import { workspaceListMock } from "@/mocks/data/workspace.mock";
import { createWorkloadColumn } from "@/shared/components/column/create-workload-column";
import { createWorkspaceColumn } from "@/shared/components/column/create-workspace-column";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { UserMonitoringSectionTitle } from "@/styles/layers/user-monitoring-layers.styled";
import { customScrollbar } from "@/styles/mixins/scrollbar";
import { statusTextStyle } from "@/styles/mixins/text";

export function MonitoringSubSection() {
  return (
    <Container>
      <Left>
        <LeftArticle>
          <ArticleHeader>
            <ArticleTitle>
              <SectionTitle>전체 워크스페이스</SectionTitle>
              <ArticleDescription>총 24개</ArticleDescription>
            </ArticleTitle>
            <Legend>
              <LegendKey>리소스 사용량</LegendKey>
              <LegendValue>
                <LegendSeries className="orange">60%~89%</LegendSeries>
                <LegendSeries className="red">90%~100%</LegendSeries>
              </LegendValue>
            </Legend>
          </ArticleHeader>
          <LeftBody>
            <CustomizedTable
              columns={createWorkspaceColumn([
                { dataIndex: "name" },
                { dataIndex: "gpu" },
                { dataIndex: "cpu" },
                { dataIndex: "mem" },
                { dataIndex: "running" },
                { dataIndex: "pending" },
                { dataIndex: "error" },
                { dataIndex: "creatorName" },
                { dataIndex: "creatorDate" },
              ])}
              data={workspaceListMock}
              activePadding
            />
          </LeftBody>
        </LeftArticle>
        <LeftArticle>
          <ArticleHeader>
            <ArticleTitle>
              <SectionTitle>사용자별 리소스 점유율</SectionTitle>
            </ArticleTitle>
          </ArticleHeader>

          <LeftBody>
            <CustomizedTable
              columns={createWorkloadColumn([
                { dataIndex: "creatorName", title: "사용자", width: 100 },
                { dataIndex: "labels" },
                { dataIndex: "status", width: 80 },
                { dataIndex: "elapsedTime" },
              ])}
              data={workloadListMock}
              activePadding
            />
          </LeftBody>
        </LeftArticle>
      </Left>
      <Right>
        <ArticleTitle style={{ marginBottom: "0" }}>
          <SectionTitle>워크로드 정보</SectionTitle>
        </ArticleTitle>
        <WorkloadStatuses>
          {["ALL", "RUNNING", "PENDING", "FAILED"].map((status) => (
            <MonitoringWorkloadStatus
              key={status}
              status={status as WorkloadStatusType}
              total={9999}
            />
          ))}
        </WorkloadStatuses>
        <ListArticle>
          <ListArticleTitle>에러 워크로드 목록</ListArticleTitle>
          <ListArticleBody>
            {workloadListMock.map((workload) => (
              <VolumeWorkloadCard key={workload.id} {...workload} />
            ))}
          </ListArticleBody>
        </ListArticle>
        <ListArticle>
          <ListArticleTitle>실행중 워크로드 목록</ListArticleTitle>
          <ListArticleBody>
            {workloadListMock.map((workload) => (
              <UserMonitoringRunningWorkloadCard
                key={workload.id}
                {...workload}
              />
            ))}
          </ListArticleBody>
        </ListArticle>
      </Right>
    </Container>
  );
}

const Container = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  height: 980px;

  --right-width: 620px;
`;

const Left = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: calc(100% - var(--right-width) - 16px);
`;

const LeftArticle = styled.article`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 23px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  background-color: #fafafa;
`;

const Right = styled.article`
  width: var(--right-width);
  flex-shrink: 0;
  height: 100%;
  padding: 23px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow: hidden;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.15);
  background-color: #fafafa;
`;

const ArticleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const ArticleTitle = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 6px;
  position: relative;
  padding-left: 5px;
  margin-bottom: 20px;
`;

const ArticleDescription = styled.div`
  font-weight: 400;
  font-size: 12px;
  color: #070913;
`;

const LeftBody = styled.div`
  flex: 1;
  width: 100%;
  height: 300px;
  overflow: hidden;
`;

const SectionTitle = styled(UserMonitoringSectionTitle)`
  color: #070913;
`;

const WorkloadStatuses = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 9px;
  height: 86px;

  --border-color: #ced2d6;
`;

const ListArticle = styled.article`
  flex: 1;
  padding: 20px;
  border-radius: 4px;
  border: 1px solid #e1e4e7;
  background-color: #fcfcfc;
  display: flex;
  flex-direction: column;
  gap: 14px;
  overflow: hidden;
`;

const ListArticleTitle = styled.div`
  font-weight: 600;
  font-size: 14px;
  line-height: 16px;
  color: #000;
`;

const ListArticleBody = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  width: 100%;
  row-gap: 12px;
  column-gap: 10px;
  overflow-y: auto;
  flex: 1;

  ${customScrollbar()}
`;

const Legend = styled.div`
  display: flex;
  padding: 5px 8px;
  border: 1px solid #d1d5dc;
  background-color: #f7f9fb;
  border-radius: 2px;
`;

const LegendKey = styled.div`
  font-weight: 600;
  font-size: 10px;
  line-height: 12px;
  text-align: right;
  color: #000;
  border-right: 1px solid #d1d5dc;
  padding-right: 9px;
  white-space: nowrap;
`;

const LegendValue = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LegendSeries = styled.span`
  ${statusTextStyle(6)}

  color: #000 !important;
  font-weight: 400 !important;
  margin-left: 20px;
`;
