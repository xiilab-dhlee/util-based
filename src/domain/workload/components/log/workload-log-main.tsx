"use client";

import styled from "styled-components";
import { Icon } from "xiilab-ui";

import { openViewWorkloadMonitoringDrawerAtom } from "@/domain/workload/state/workload.atom";
import { TerminalThemeButton } from "@/shared/components/button/terminal-theme-button";
import { WORKLOAD_SELECTOR } from "@/shared/constants/selector.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import {
  DetailContentButton,
  DetailContentHeader,
  DetailContentTitle,
  DetailContentTitleTool,
} from "@/styles/layers/detail-page-layers.styled";
import { AsideWorkloadMonitoring } from "../aside-workload-monitoring";
import { ViewWorkloadMonitoringModal } from "../detail/view-workload-monitoring-modal";
import { WorkloadLogBody } from "./workload-log-body";

export function WorkloadLogMain() {
  const { open, onToggle } = useGlobalModal(
    openViewWorkloadMonitoringDrawerAtom,
  );

  const handleToggleMonitoring = () => {
    onToggle();
  };

  return (
    <>
      <DetailContentHeader>
        <DetailContentTitle>로그</DetailContentTitle>
        <DetailContentTitleTool>
          <div style={{ width: 90, height: 30 }}>
            <DetailContentButton
              onClick={handleToggleMonitoring}
              data-testid={WORKLOAD_SELECTOR.LOG_MONITORING_BUTTON}
            >
              <Icon name="Monitoring01" color="var(--icon-fill)" />
              모니터링
            </DetailContentButton>
          </div>
          <div style={{ width: 30, height: 30 }}>
            <TerminalThemeButton
              data-testid={WORKLOAD_SELECTOR.LOG_THEME_BUTTON}
            />
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
