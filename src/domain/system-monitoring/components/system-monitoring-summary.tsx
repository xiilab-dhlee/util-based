import styled from "styled-components";
import { Icon } from "xiilab-ui";

import type { SystemResourcesSummaryResponse } from "@/domain/system-monitoring/types/system-monitoring.type";
import type { ResourceSummary } from "@/domain/system-monitoring/utils/system-monitoring.util";

export interface SystemMonitoringSummaryProps {
  nodeSummary?: SystemResourcesSummaryResponse;
  selectedNode: string;
  resourceSummary: ResourceSummary;
}

export const SystemMonitoringSummary = ({
  nodeSummary,
  selectedNode,
  resourceSummary,
}: SystemMonitoringSummaryProps) => {
  return (
    <SummaryArticle>
      <SummaryArticleItem>
        <SummaryIconWrapper>
          <Icon name="SingleNode" color="#000000" size={30} />
        </SummaryIconWrapper>
        <SummaryArticleBody>
          <SummaryArticleKey>
            {nodeSummary?.nodeName || selectedNode}
          </SummaryArticleKey>
          <SummaryArticleValue>
            {nodeSummary?.nodeIp || "-"}
          </SummaryArticleValue>
        </SummaryArticleBody>
      </SummaryArticleItem>
      <SummaryArticleItem>
        <SummaryIconWrapper>
          <Icon name="Gpu" color={resourceSummary.gpu.info.color} size={30} />
        </SummaryIconWrapper>
        <SummaryArticleBody>
          <SummaryArticleKey>{resourceSummary.gpu.info.text}</SummaryArticleKey>
          <SummaryArticleValue>
            {`${resourceSummary.gpu.count} ${resourceSummary.gpu.info.unit}`}
          </SummaryArticleValue>
        </SummaryArticleBody>
      </SummaryArticleItem>
      <SummaryArticleItem>
        <SummaryIconWrapper>
          <Icon name="Cpu" color={resourceSummary.cpu.info.color} size={30} />
        </SummaryIconWrapper>
        <SummaryArticleBody>
          <SummaryArticleKey>{resourceSummary.cpu.info.text}</SummaryArticleKey>
          <SummaryArticleValue>
            {`${resourceSummary.cpu.core} ${resourceSummary.cpu.info.unit}`}
          </SummaryArticleValue>
        </SummaryArticleBody>
      </SummaryArticleItem>
      <SummaryArticleItem>
        <SummaryIconWrapper>
          <Icon
            name="Mem"
            color={resourceSummary.memory.info.color}
            size={30}
          />
        </SummaryIconWrapper>
        <SummaryArticleBody>
          <SummaryArticleKey>
            {resourceSummary.memory.info.text}
          </SummaryArticleKey>
          <SummaryArticleValue>
            {`${resourceSummary.memory.amount} ${resourceSummary.memory.info.unit}`}
          </SummaryArticleValue>
        </SummaryArticleBody>
      </SummaryArticleItem>
      <SummaryArticleItem>
        <SummaryIconWrapper>
          <Icon name="Disk" color={resourceSummary.disk.info.color} size={30} />
        </SummaryIconWrapper>
        <SummaryArticleBody>
          <SummaryArticleKey>
            {resourceSummary.disk.info.text}
          </SummaryArticleKey>
          <SummaryArticleValue>
            {`${resourceSummary.disk.amount} ${resourceSummary.disk.info.unit}`}
          </SummaryArticleValue>
        </SummaryArticleBody>
      </SummaryArticleItem>
    </SummaryArticle>
  );
};

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
