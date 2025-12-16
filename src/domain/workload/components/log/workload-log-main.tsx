"use client";

import styled from "styled-components";

import { openViewWorkloadMonitoringDrawerAtom } from "@/domain/workload/state/workload.atom";
import { TerminalThemeButton } from "@/shared/components/button/terminal-theme-button";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import {
  DetailContentHeader,
  DetailContentTitle,
  DetailContentTitleTool,
} from "@/styles/layers/detail-page-layers.styled";
import { AsideWorkloadMonitoring } from "../aside-workload-monitoring";
import { ViewWorkloadMonitoringModal } from "../detail/view-workload-monitoring-modal";
import { WorkloadMonitoringButton } from "../workload-monitoring-button";
import { WorkloadLogBody } from "./workload-log-body";

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
