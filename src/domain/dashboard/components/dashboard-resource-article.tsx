import styled from "styled-components";
import { Dropdown } from "xiilab-ui";

import { DashboardGraphChart } from "@/domain/dashboard/components/dashboard-graph-chart";
import {
  DASHBOARD_RESOURCE_OPTIONS,
  DASHBOARD_SERIES_DEMO,
} from "@/domain/dashboard/constants/dashboard.constant";
import { useSelect } from "@/shared/hooks/use-select";
import { DashboardCategoryTitle } from "@/styles/layers/dashboard-layers.styled";

export function DashboardResourceArticle() {
  // 선택된 자원
  const resourceSelect = useSelect<string>("GPU", DASHBOARD_RESOURCE_OPTIONS);

  // value가 null이 아니고 유효한 리소스 타입인지 확인

  const seriesData = resourceSelect.value
    ? DASHBOARD_SERIES_DEMO[resourceSelect.value]
    : null;

  return (
    <Container>
      {/* CPU 그래프 영역 */}
      <Graph>
        <GraphHeader>
          <DashboardCategoryTitle>
            {resourceSelect.value} 그래프
          </DashboardCategoryTitle>
        </GraphHeader>
        <GraphBody>
          {/* 선택된 옵션이 변경될 때마다 컴포넌트를 리렌더링하기 위한 key 속성 추가 */}
          {seriesData && (
            <DashboardGraphChart
              key={resourceSelect.value}
              series={seriesData.series}
              unit={seriesData.unit}
            />
          )}
        </GraphBody>
      </Graph>
      {/* 그래프 선택 영역 */}
      <GraphSelect>
        <Dropdown
          options={resourceSelect.options}
          onChange={resourceSelect.onChange}
          value={resourceSelect.value}
          placeholder="선택"
          theme="dark"
          width="100%"
        />
      </GraphSelect>
    </Container>
  );
}

const Container = styled.article`
  flex: 1;
  /* min-width: 680px; */
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  position: relative;

  padding-right: 10px;

  --gpu-bg-color: #8a5ef3;
  --cpu-bg-color: #5d6dff;
  --mem-bg-color: #38e2af;
`;

const Graph = styled.div`
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const GraphHeader = styled.div`
  padding-left: 20px;
  padding-bottom: 10px;
`;

const GraphBody = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const GraphSelect = styled.div`
  position: absolute;
  top: 0;
  right: 20px;
  width: 84px;
  height: 30px;
`;
