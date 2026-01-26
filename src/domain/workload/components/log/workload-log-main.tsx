"use client";

import styled from "styled-components";

import { AsideWorkloadMonitoring } from "@/domain/workload/components/aside-workload-monitoring";
import { ViewWorkloadMonitoringModal } from "@/domain/workload/components/detail/view-workload-monitoring-modal";
import { WorkloadLogBody } from "@/domain/workload/components/log/workload-log-body";
import { WorkloadMonitoringButton } from "@/domain/workload/components/workload-monitoring-button";
import { openViewWorkloadMonitoringDrawerAtom } from "@/domain/workload/state/workload.atom";
import { TerminalThemeButton } from "@/shared/components/button/terminal-theme-button";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import {
  DetailContentHeader,
  DetailContentTitle,
  DetailContentTitleTool,
} from "@/styles/layers/detail-page-layers.styled";

export function WorkloadLogMain() {
  const { open } = useGlobalModal(openViewWorkloadMonitoringDrawerAtom);

  return (
    <>
      <DetailContentHeader>
        <DetailContentTitle>로그</DetailContentTitle>
        <DetailContentTitleTool>
          <WorkloadMonitoringButton />
          <div style={{ width: 30, height: 30 }}>
            <TerminalThemeButton />
          </div>
        </DetailContentTitleTool>
      </DetailContentHeader>
      <LogContent>
        <WorkloadLogBody />
        {open && <AsideWorkloadMonitoring />}
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
