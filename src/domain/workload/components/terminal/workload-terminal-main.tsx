"use client";

import { useParams, useSearchParams } from "next/navigation";
import styled from "styled-components";
import { Icon } from "xiilab-ui";

import { ViewWorkloadMonitoringModal } from "@/domain/workload/components/detail/view-workload-monitoring-modal";
import { useGetWorkloadByMode } from "@/domain/workload/hooks/use-get-workload-by-mode";
import { openViewWorkloadMonitoringDrawerAtom } from "@/domain/workload/state/workload.atom";
import { TerminalThemeButton } from "@/shared/components/button/terminal-theme-button";
import { WorkloadTerminal } from "@/shared/components/terminal/workload-terminal";
import { WORKLOAD_SELECTOR } from "@/shared/constants/selector.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import {
  DetailContentButton,
  DetailContentHeader,
  DetailContentTitle,
  DetailContentTitleTool,
} from "@/styles/layers/detail-page-layers.styled";
import { terminalDrawerStyle } from "@/styles/mixins/drawer";
import { AsideWorkloadMonitoring } from "../aside-workload-monitoring";

export function WorkloadTerminalMain() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const { open, onToggle } = useGlobalModal(
    openViewWorkloadMonitoringDrawerAtom,
  );

  const workspaceId = searchParams?.get("workspaceId") || "";

  const { data } = useGetWorkloadByMode({
    workspaceId,
    workloadId: id as string,
  });

  const handleToggleMonitoring = () => {
    onToggle();
  };

  const handleClickNewTerminal = () => {
    const width = 600;
    const height = 500;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    const url = `/terminal?id=${id}&workspaceId=${workspaceId}&type=${data?.jobType}`;
    const windowName = "_blank";
    const features = `noopener, noreferrer, width=${width}, height=${height}, top=${top}, left=${left}`;

    window.open(url, windowName, features);
  };

  return (
    <>
      {/* 로그 페이지 영역 */}
      <DetailContentHeader>
        <DetailContentTitle>웹터미널</DetailContentTitle>
        <DetailContentTitleTool>
          <div style={{ width: 90, height: 30 }}>
            <DetailContentButton
              onClick={handleToggleMonitoring}
              data-testid={WORKLOAD_SELECTOR.TERMINAL_MONITORING_BUTTON}
            >
              <Icon name="Monitoring01" color="var(--icon-fill)" />
              모니터링
            </DetailContentButton>
          </div>
          <div style={{ width: 30, height: 30 }}>
            <DetailContentButton onClick={handleClickNewTerminal}>
              <Icon name="Pip" color="var(--icon-fill)" size={16} />
            </DetailContentButton>
          </div>
          <div style={{ width: 30, height: 30 }}>
            <TerminalThemeButton
              data-testid={WORKLOAD_SELECTOR.TERMINAL_THEME_BUTTON}
            />
          </div>
        </DetailContentTitleTool>
      </DetailContentHeader>
      <TerminalContent>
        {/* 워크로드 터미널 */}
        <TerminalWrapper>
          <WorkloadTerminal
            workspaceId={workspaceId as string}
            workloadId={id as string}
            workloadType={data?.jobType || ""}
          />
        </TerminalWrapper>
        {open && <AsideWorkloadMonitoring />}
      </TerminalContent>
      {/* 워크로드 모니터링 모달 */}
      <ViewWorkloadMonitoringModal />
    </>
  );
}

const TerminalContent = styled.div`
  position: relative;
  flex: 1;
  height: 600px;
  min-height: 400px;
  max-height: 800px;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  gap: 10px;
  border-radius: 4px;

  ${terminalDrawerStyle}
`;

const TerminalWrapper = styled.div`
  flex: 1;
  min-width: 0;
  height: 100%;
  border-radius: 4px;
  overflow: hidden;
`;
