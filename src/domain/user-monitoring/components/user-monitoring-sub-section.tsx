import { useAtomValue } from "jotai";
import styled from "styled-components";

import { RunningWorkloadListMain } from "@/domain/workload/components/running-workload-list/running-workload-list-main";
import { createWorkloadColumn } from "@/shared/components/column/create-workload-column";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { USER_MONITORING_SELECTOR } from "@/shared/constants/selector.constant";
import { selectedWorkspaceAtom } from "@/shared/state/core.atom";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";
import { UserMonitoringSectionTitle } from "@/styles/layers/user-monitoring-layers.styled";

export function UserMonitoringSubSection() {
  const selectedWorkspace = useAtomValue(selectedWorkspaceAtom);
  const workspaceId = selectedWorkspace?.workspaceId;
  return (
    <Container>
      <Left data-testid={USER_MONITORING_SELECTOR.RUNNING_WORKLOAD_LIST}>
        <RunningWorkloadListMain workspaceId={workspaceId} />
      </Left>
      <Right data-testid={USER_MONITORING_SELECTOR.RECOVERY_WORKLOAD_LIST}>
        <ArticleTitle>
          <SectionTitle>리소스 회수 예정 워크로드 정보</SectionTitle>
        </ArticleTitle>
        <ListWrapper>
          <CustomizedTable
            columns={createWorkloadColumn([
              {
                key: "workloadName",
                title: "이름",
                width: 130,
                ellipsis: true,
                sorter: true,
              },
              { key: "creatorName" },
              { key: "status" },
              { key: "elapsedTime" },
              { key: "jobType", title: "누적 경고 횟수" },
            ])}
            columnHeight={40}
            data={[]}
            activePadding
            pagination={{
              onChange: () => {
                alert("준비 중입니다.");
              },
              pageSize: 8,
              total: 0,
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
