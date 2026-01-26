import { useAtomValue } from "jotai";
import styled from "styled-components";
import { Dropdown } from "xiilab-ui";

import type { WorkspaceMetricType } from "@/domain/user-monitoring/constants/workspace-monitoring.constant";
import {
  WORKSPACE_MONITORING_CHART_COLOR_OPTIONS,
  WORKSPACE_MONITORING_RESOURCE_OPTIONS,
} from "@/domain/user-monitoring/constants/workspace-monitoring.constant";
import { useWorkspaceMetrics } from "@/domain/user-monitoring/hooks/use-workspace-metrics.hook";
import { useWorkspaceMetricsStream } from "@/domain/user-monitoring/hooks/use-workspace-metrics-stream.hook";
import { getWorkspaceMetricInfo } from "@/domain/user-monitoring/utils/workspace-monitoring.util";
import { MonitoringChart } from "@/shared/components/chart/monitoring-chart";
import { USER_MONITORING_SELECTOR } from "@/shared/constants/selector.constant";
import { useSelect } from "@/shared/hooks/use-select";
import { selectedWorkspaceAtom } from "@/shared/state/core.atom";
import { UserMonitoringCategoryTitle } from "@/styles/layers/user-monitoring-layers.styled";

export function UserMonitoringResourceArticle() {
  const selectedWorkspace = useAtomValue(selectedWorkspaceAtom);
  const workspaceId = selectedWorkspace?.workspaceId;

  const resourceSelect = useSelect<WorkspaceMetricType>(
    WORKSPACE_MONITORING_RESOURCE_OPTIONS[0].value,
    WORKSPACE_MONITORING_RESOURCE_OPTIONS,
  );

  const metricType =
    resourceSelect.value ?? WORKSPACE_MONITORING_RESOURCE_OPTIONS[0].value;

  const historyMetrics = useWorkspaceMetrics({
    workspaceId,
    metricType,
    enabled: Boolean(workspaceId),
  });

  const streamMetrics = useWorkspaceMetricsStream({
    workspaceId,
    metricType,
    lastHistoryTimestamp: historyMetrics.lastTimestamp,
    initialData: historyMetrics.data,
    enabled: Boolean(workspaceId) && !historyMetrics.isLoading,
  });

  const currentData = streamMetrics.data;
  const metricInfo = getWorkspaceMetricInfo(metricType);
  const unit = metricInfo.unit;
  const colors = metricInfo.colors;

  return (
    <Container data-testid={USER_MONITORING_SELECTOR.RESOURCE_GRAPH}>
      <Graph>
        <GraphHeader>
          <UserMonitoringCategoryTitle>
            {metricInfo.text} 그래프
          </UserMonitoringCategoryTitle>
        </GraphHeader>

        <GraphBody>
          <MonitoringChart
            key={metricType}
            series={currentData}
            unit={unit}
            colors={colors}
            isLoading={historyMetrics.isLoading}
            isError={historyMetrics.isError}
            chartType="area"
            height={320}
            // width={650}
            customOptions={WORKSPACE_MONITORING_CHART_COLOR_OPTIONS}
            isDarkMode={true}
          />
        </GraphBody>
      </Graph>
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

  padding-right: 10px;

  --gpu-bg-color: #8a5ef3;
  --cpu-bg-color: #5d6dff;
  --mem-bg-color: #38e2af;
`;

const Graph = styled.div`

  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
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
  position: relative;
`;

const GraphSelect = styled.div`
  position: absolute;
  top: 0;
  right: 20px;
  width: 130px;
  height: 30px;
`;
