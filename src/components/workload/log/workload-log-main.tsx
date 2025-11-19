"use client";

import styled from "styled-components";
import { Icon } from "xiilab-ui";

import { openViewWorkloadMonitoringDrawerAtom } from "@/atoms/workload.atom";
import { TerminalThemeButton } from "@/components/common/button/terminal-theme-button";
import { ViewWorkloadMonitoringModal } from "@/components/workload/detail/view-workload-monitoring-modal";
import { useGlobalModal } from "@/hooks/common/use-global-modal";
import {
  DetailContentButton,
  DetailContentHeader,
  DetailContentTitle,
  DetailContentTitleTool,
} from "@/styles/layers/detail-page-layers.styled";
import { WorkloadLogBody } from "./workload-log-body";

export function WorkloadLogMain() {
  const { onToggle } = useGlobalModal(openViewWorkloadMonitoringDrawerAtom);

  const handleToggleMonitoring = () => {
    onToggle();
  };

  return (
    <>
      {/* 로그 페이지 영역 */}
      <DetailContentHeader>
        <DetailContentTitle>로그</DetailContentTitle>
        <DetailContentTitleTool>
          <div style={{ width: 90, height: 30 }}>
            <DetailContentButton onClick={handleToggleMonitoring}>
              <Icon name="Monitoring01" color="var(--icon-fill)" />
              모니터링
            </DetailContentButton>
          </div>
          <div style={{ width: 30, height: 30 }}>
            <TerminalThemeButton />
          </div>
        </DetailContentTitleTool>
      </DetailContentHeader>
      <LogContent>
        <WorkloadLogBody />
      </LogContent>
      {/* 워크로드 모니터링 모달 */}
      <ViewWorkloadMonitoringModal />
    </>
  );
}

const LogContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  gap: 10px;
  overflow: hidden;
`;
