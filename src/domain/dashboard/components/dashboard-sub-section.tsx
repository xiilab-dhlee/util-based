import styled from "styled-components";

import { workloadListMock } from "@/mocks/data/workload.mock";
import { createWorkloadColumn } from "@/shared/components/column/create-workload-column";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { DashboardSectionTitle } from "@/styles/layers/dashboard-layers.styled";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";

export function DashboardSubSection() {
  return (
    <Container>
      <Pane>
        <ArticleTitle>
          <SectionTitle>고정 워크로드 정보</SectionTitle>
          <ArticleDescription>
            고정한 워크로드 정보를 확인할 수 있습니다.
          </ArticleDescription>
        </ArticleTitle>
        <ListWrapper>
          <CustomizedTable
            columns={createWorkloadColumn([
              { dataIndex: "workloadName" },
              { dataIndex: "jobType" },
              { dataIndex: "creatorName" },
              { dataIndex: "labels" },
              { dataIndex: "status" },
              { dataIndex: "elapsedTime" },
            ])}
            columnHeight={38}
            activePadding
            data={workloadListMock}
            pagination={{
              onChange: () => {
                alert("준비 중입니다.");
              },
              pageSize: 8,
              total: 10,
            }}
          />
        </ListWrapper>
      </Pane>
      <Pane>
        <ArticleTitle>
          <SectionTitle>자원회수 워크로드 정보</SectionTitle>
          <ArticleDescription>
            자원회수가 예정된 워크로드 정보를 확인할 수 있습니다.
          </ArticleDescription>
        </ArticleTitle>
        <ListWrapper>
          <CustomizedTable
            columns={createWorkloadColumn([
              // { dataIndex: "workloadName", title: "이름" },
              { dataIndex: "workloadName" },
              { dataIndex: "jobType" },
              { dataIndex: "creatorName", title: "사용자" },
              { dataIndex: "labels", title: "라벨" },
              { dataIndex: "status" },
              { dataIndex: "elapsedTime" },
            ])}
            columnHeight={38}
            activePadding
            data={workloadListMock}
            pagination={{
              onChange: () => {
                alert("준비 중입니다.");
              },
              pageSize: 8,
              total: 10,
            }}
          />
        </ListWrapper>
      </Pane>
    </Container>
  );
}

const Container = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  height: 492px;
`;

const Pane = styled.article`
  flex: 1;
  height: 100%;
  padding: 23px;
  padding-bottom: 0;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.15);
`;

// const Right = styled(Left)`
//   flex: 0;
//   flex-basis: 620px;
// `;

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
`;

const SectionTitle = styled(DashboardSectionTitle)`
  color: #070913;
`;
