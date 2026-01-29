"use client";

import { useAtom } from "jotai";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import styled from "styled-components";
import { Dropdown, Icon } from "xiilab-ui";

import {
  useGetDistributedPods,
  useGetWorkloadDetail,
} from "@/api/generated/workload/workload";
import { AsideWorkloadMonitoring } from "@/domain/workload/components/aside-workload-monitoring";
import { ViewWorkloadMonitoringModal } from "@/domain/workload/components/detail/view-workload-monitoring-modal";
import { WorkloadMonitoringButton } from "@/domain/workload/components/workload-monitoring-button";
import { WORKLOAD_JOB_TYPES } from "@/domain/workload/constants/workload.constant";
import {
  openViewWorkloadMonitoringDrawerAtom,
  terminalSelectedPodNameAtom,
} from "@/domain/workload/state/workload.atom";
import { TerminalThemeButton } from "@/shared/components/button/terminal-theme-button";
import { WorkloadTerminal } from "@/shared/components/terminal/workload-terminal";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
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
  const { open } = useGlobalModal(openViewWorkloadMonitoringDrawerAtom);

  const workspaceId = searchParams?.get("workspaceId") || "";

  const { data } = useGetWorkloadDetail(Number(workspaceId), id as string, {
    query: {
      enabled: Boolean(workspaceId) && Boolean(id),
    },
  });

  const workloadType = data?.workloadJobType;
  const isDistributed = workloadType === WORKLOAD_JOB_TYPES.DISTRIBUTED;

  // DISTRIBUTED 워크로드인 경우 Pod 목록 조회
  const { data: podsData } = useGetDistributedPods(
    Number(workspaceId),
    id as string,
    {
      query: {
        enabled: isDistributed && Boolean(workspaceId) && Boolean(id),
      },
    },
  );

  // Pod 선택 상태
  const [selectedPodName, setSelectedPodName] = useAtom(
    terminalSelectedPodNameAtom,
  );

  // Pod 선택 옵션 생성
  // customInstance에서 BaseResponse의 data 필드를 자동 unwrap하므로
  // podsData는 DistributedPodResponse 타입
  const podOptions = useMemo(() => {
    const podNames = podsData?.podNames || [];
    return podNames.map((name) => ({
      label: name,
      value: name,
    }));
  }, [podsData?.podNames]);

  // DISTRIBUTED 워크로드일 때 첫 번째 Pod 자동 선택
  useEffect(() => {
    if (isDistributed && podOptions.length > 0 && !selectedPodName) {
      setSelectedPodName(podOptions[0].value);
    }
  }, [isDistributed, podOptions, selectedPodName, setSelectedPodName]);

  // 워크로드가 변경되면 선택된 Pod 초기화
  useEffect(() => {
    return () => {
      setSelectedPodName(null);
    };
  }, [setSelectedPodName]);

  const handleChangePod = (value: string | null) => {
    setSelectedPodName(value);
  };

  const handleClickNewTerminal = () => {
    const width = 600;
    const height = 500;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    const podQuery = selectedPodName
      ? `&podName=${encodeURIComponent(selectedPodName)}`
      : "";
    const url = `/terminal?id=${id}&workspaceId=${workspaceId}&type=${workloadType}${podQuery}`;
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
          {/* DISTRIBUTED 워크로드인 경우 Pod 선택 드롭다운 표시 */}
          {isDistributed && (
            <Dropdown
              options={podOptions}
              placeholder="Pod 선택"
              onChange={handleChangePod}
              value={selectedPodName}
              width={200}
              height={30}
              disabled={podOptions.length === 0}
            />
          )}
          <WorkloadMonitoringButton />
          <div style={{ width: 30, height: 30 }}>
            <DetailContentButton onClick={handleClickNewTerminal}>
              <Icon name="Pip" color="var(--icon-fill)" size={16} />
            </DetailContentButton>
          </div>
          <div style={{ width: 30, height: 30 }}>
            <TerminalThemeButton />
          </div>
        </DetailContentTitleTool>
      </DetailContentHeader>
      <TerminalContent>
        {/* 워크로드 터미널 */}
        <TerminalWrapper>
          <WorkloadTerminal
            workspaceId={workspaceId as string}
            workloadId={id as string}
            workloadType={workloadType || ""}
            podName={selectedPodName || undefined}
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
