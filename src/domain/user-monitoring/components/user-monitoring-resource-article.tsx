import styled from "styled-components";
import { Dropdown } from "xiilab-ui";

import { UserMonitoringGraphChart } from "@/domain/user-monitoring/components/user-monitoring-graph-chart";
import {
  USER_MONITORING_RESOURCE_OPTIONS,
  USER_MONITORING_SERIES_DEMO,
} from "@/domain/user-monitoring/constants/user-monitoring.constant";
import { useSelect } from "@/shared/hooks/use-select";
import { UserMonitoringCategoryTitle } from "@/styles/layers/user-monitoring-layers.styled";

export function UserMonitoringResourceArticle() {
  // 선택된 자원
  const resourceSelect = useSelect<string>(
    "GPU",
    USER_MONITORING_RESOURCE_OPTIONS,
  );

  // value가 null이 아니고 유효한 리소스 타입인지 확인

  const seriesData = resourceSelect.value
    ? USER_MONITORING_SERIES_DEMO[resourceSelect.value]
    : null;

  return (
    <Container>
      {/* CPU 그래프 영역 */}
      <Graph>
        <GraphHeader>
          <UserMonitoringCategoryTitle>
            {resourceSelect.value} 그래프
          </UserMonitoringCategoryTitle>
        </GraphHeader>
        <GraphBody>
          {/* 선택된 옵션이 변경될 때마다 컴포넌트를 리렌더링하기 위한 key 속성 추가 */}
          {seriesData && (
            <UserMonitoringGraphChart
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
