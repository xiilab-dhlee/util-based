import styled from "styled-components";

import { MySelect } from "@/components/common/select";
import { DashboardGraphChart } from "@/components/dashboard/dashboard-graph-chart";
import { useSelect } from "@/hooks/common/use-select";
import { Dashboard } from "@/models/dashboard.model";
import { DashboardCategoryTitle } from "@/styles/layers/dashboard-layers.styled";

export function DashboardResourceArticle() {
  // 선택된 자원
  const { value, setValue } = useSelect(
    Dashboard.RESOURCE_OPTIONS[0].value,
    Dashboard.RESOURCE_OPTIONS,
  );

  const series = Dashboard.getGraphSeries(value);

  return (
    <Container>
      {/* CPU 그래프 영역 */}
      <Graph>
        <GraphHeader>
          <DashboardCategoryTitle>{value} 그래프</DashboardCategoryTitle>
        </GraphHeader>
        <GraphBody>
          {/* 선택된 옵션이 변경될 때마다 컴포넌트를 리렌더링하기 위한 key 속성 추가 */}
          <DashboardGraphChart key={value} series={[series]} unit="개" />
        </GraphBody>
      </Graph>
      {/* 그래프 선택 영역 */}
      <GraphSelect>
        <MySelect
          options={Dashboard.RESOURCE_OPTIONS}
          placeholder="선택"
          value={value}
          setValue={setValue}
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
