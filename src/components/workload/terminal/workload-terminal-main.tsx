"use client";

import { useSetAtom } from "jotai";
import { useParams, useSearchParams } from "next/navigation";
import styled from "styled-components";

import { openViewWorkloadMonitoringDrawerAtom } from "@/atoms/workload/workload-detail.atom";
import { TerminalThemeButton } from "@/components/common/button/terminal-theme-button";
import { MonitoringDrawer } from "@/components/common/drawer/monitoring-drawer";
import { MyIcon } from "@/components/common/icon";
import { WorkloadTerminal } from "@/components/common/terminal/workload-terminal";
import { ViewWorkloadMonitoringModal } from "@/components/workload/detail/view-workload-monitoring-modal";
import { useGetWorkloadByMode } from "@/hooks/workload/use-get-workload-by-mode";
import {
  DetailContentButton,
  DetailContentHeader,
  DetailContentTitle,
  DetailContentTitleTool,
} from "@/styles/layers/detail-page-layers.styled";
import { terminalDrawerStyle } from "@/styles/mixins/drawer";

export function WorkloadTerminalMain() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const setOpenDrawer = useSetAtom(openViewWorkloadMonitoringDrawerAtom);

  const workspaceId = searchParams?.get("workspaceId") || "";

  const { data } = useGetWorkloadByMode({
    workspaceId,
    workloadId: id as string,
  });

  const handleToggleMonitoring = () => {
    setOpenDrawer((prev) => !prev);
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
            <DetailContentButton onClick={handleToggleMonitoring}>
              <MyIcon name="Monitoring01" color="var(--icon-fill)" />
              모니터링
            </DetailContentButton>
          </div>
          <div style={{ width: 30, height: 30 }}>
            <DetailContentButton onClick={handleClickNewTerminal}>
              <MyIcon name="Pip" color="var(--icon-fill)" size={16} />
            </DetailContentButton>
          </div>
          <div style={{ width: 30, height: 30 }}>
            <TerminalThemeButton />
          </div>
        </DetailContentTitleTool>
      </DetailContentHeader>
      <TerminalContent>
        {/* 모니터링 드로어 */}
        <MonitoringDrawer />
        {/* 워크로드 터미널 */}
        <WorkloadTerminal
          workspaceId={workspaceId as string}
          workloadId={id as string}
          workloadType={data?.jobType || ""}
        />
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
  flex-direction: column;
  border-radius: 4px;

  ${terminalDrawerStyle}
`;
