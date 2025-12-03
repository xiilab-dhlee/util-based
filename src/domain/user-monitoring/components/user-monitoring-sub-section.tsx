import styled from "styled-components";

import { workloadListMock } from "@/mocks/data/workload.mock";
import { createWorkloadColumn } from "@/shared/components/column/create-workload-column";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";
import { UserMonitoringSectionTitle } from "@/styles/layers/user-monitoring-layers.styled";

export function UserMonitoringSubSection() {
  return (
    <Container>
      <Left>
        <ArticleTitle>
          <SectionTitle>실행중인 워크로드 목록</SectionTitle>
          {/* <ArticleDescription>
            고정한 워크로드 정보를 확인할 수 있습니다.
          </ArticleDescription> */}
        </ArticleTitle>
        <ListWrapper>
          <CustomizedTable
            columns={createWorkloadColumn([
              {
                dataIndex: "workloadName",
                align: "left",
                ellipsis: true,
                sorter: true,
              },
              { dataIndex: "jobType", width: "20%", sorter: true },
              { dataIndex: "creatorName", width: "20%" },
              // { dataIndex: "labels" },
              // { dataIndex: "status", width: "10%" },
              {
                dataIndex: "elapsedTime",
                width: "20%",
                align: "center",
              },
            ])}
            columnHeight={40}
            activePadding
            data={workloadListMock}
            pagination={{
              onChange: () => {
                alert("준비 중입니다.");
              },
              pageSize: 8,
              total: workloadListMock.length,
            }}
          />
        </ListWrapper>
      </Left>
      <Right>
        <ArticleTitle>
          <SectionTitle>리소스 회수 예정 워크로드 정보</SectionTitle>
          {/* <ArticleDescription>
            자원회수가 예정된 워크로드 정보를 확인할 수 있습니다.
          </ArticleDescription> */}
        </ArticleTitle>
        <ListWrapper>
          <CustomizedTable
            columns={createWorkloadColumn([
              {
                dataIndex: "workloadName",
                title: "이름",
                width: 130,
                ellipsis: true,
                sorter: true,
              },
              { dataIndex: "creatorName" },
              { dataIndex: "status", sorter: true },
              { dataIndex: "elapsedTime" },
              { dataIndex: "jobType", title: "누적 경고 횟수" },
            ])}
            columnHeight={40}
            activePadding
            data={workloadListMock}
            pagination={{
              onChange: () => {
                alert("준비 중입니다.");
              },
              pageSize: 8,
              total: workloadListMock.length,
            }}
            loading
          />
        </ListWrapper>
      </Right>
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

const Left = styled.article`
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

const Right = styled(Left)`
  flex: 0;
  flex-basis: 620px;
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

// const ArticleDescription = styled.div`
//   font-weight: 400;
//   font-size: 12px;
// `;

const SectionTitle = styled(UserMonitoringSectionTitle)`
  color: #070913;
`;
