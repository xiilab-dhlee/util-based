"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import type { TabsSeparatedItem } from "xiilab-ui";

import { useWorkloadStatusPolling } from "@/domain/workload/hooks/use-workload-status-polling";
import { getWorkloadActionStates } from "@/domain/workload/utils/workload.util";
import { RouteTab } from "@/shared/components/tab";

interface WorkloadDetailTabsProps {
  workloadId: string;
}

/**
 * 워크로드 상세 탭 컴포넌트
 * 워크로드 상태에 따라 탭의 활성화/비활성화를 동적으로 처리합니다.
 */
export function WorkloadDetailTabs({ workloadId }: WorkloadDetailTabsProps) {
  const searchParams = useSearchParams();
  const workspaceIdStr = searchParams?.get("workspaceId");

  // 워크로드 상태 실시간 폴링 (10초마다 상태만 조회)
  const { status: polledStatus } = useWorkloadStatusPolling({
    workspaceId: workspaceIdStr ? Number(workspaceIdStr) : 0,
    workloadResourceName: workloadId,
    enabled: Boolean(workspaceIdStr && workloadId),
  });

  const tabItems: TabsSeparatedItem[] = useMemo(() => {
    // 워크로드 상태에 따른 접근 가능 여부 확인
    const actionStates = getWorkloadActionStates(polledStatus || "PENDING");

    return [
      {
        key: "",
        label: "상세정보",
        icon: "Information",
      },
      {
        key: "log",
        label: "로그",
        icon: "Log",
        disabled: !actionStates.canAccessLog,
      },
      {
        key: "terminal",
        label: "웹터미널",
        icon: "Terminal",
        disabled: !actionStates.canAccessTerminal,
      },
      {
        key: "monitoring",
        label: "모니터링",
        icon: "Monitoring02",
        disabled: !actionStates.canAccessMonitoring,
      },
      {
        key: "file",
        label: "파일 목록",
        icon: "Folder",
        disabled: !actionStates.canAccessFileList,
      },
      // {
      //   key: "security",
      //   label: "보안 취약점",
      //   icon: "Security",
      // },
    ];
  }, [polledStatus]);

  return <RouteTab items={tabItems} />;
}
