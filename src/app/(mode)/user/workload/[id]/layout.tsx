"use client";

import { useParams, useSearchParams } from "next/navigation";
import type { PropsWithChildren } from "react";
import { useMemo } from "react";
import type { TabsSeparatedItem } from "xiilab-ui";

import { DeleteWorkloadModal } from "@/domain/workload/components/delete-workload-modal";
import { UpdateWorkloadModal } from "@/domain/workload/components/detail/update-workload-modal";
import { WorkloadDetailPageAside } from "@/domain/workload/components/detail/workload-detail-page-aside";
import { RestartWorkloadModal } from "@/domain/workload/components/restart-workload-modal";
import { StopWorkloadModal } from "@/domain/workload/components/stop-workload-modal";
import { useGetWorkloadByMode } from "@/domain/workload/hooks/use-get-workload-by-mode";
import type { WorkloadStatusType } from "@/domain/workload/schemas/workload.schema";
import { PageHeader } from "@/shared/components/layouts/page-header";
import { RouteTab } from "@/shared/components/tab";
import {
  DetailContentSection,
  DetailPageBody,
  DetailPageContent,
} from "@/styles/layers/detail-page-layers.styled";

/**
 * 워크로드 상세 레이아웃 컴포넌트
 * 워크로드 상태에 따라 탭의 활성화/비활성화를 동적으로 처리합니다.
 */
export default function WorkloadDetailLayout({ children }: PropsWithChildren) {
  const params = useParams();
  const searchParams = useSearchParams();

  const workloadId = params?.id as string;
  const workspaceId = searchParams?.get("workspaceId") || "";

  // 워크로드 상세 정보 조회
  const { data: workload } = useGetWorkloadByMode({
    workspaceId,
    workloadId,
  });

  /**
   * 워크로드 상태에 따라 동적으로 탭 항목을 생성합니다.
   *
   * 활성화 조건:
   * - 로그: 실행 중(RUNNING), 종료(COMPLETED)
   * - 웹터미널: 실행 중(RUNNING)
   * - 모니터링: 실행 중(RUNNING), 종료(COMPLETED)
   * - 파일 목록: 실행 중(RUNNING)
   */
  const tabItems: TabsSeparatedItem[] = useMemo(() => {
    const status: WorkloadStatusType | undefined = workload?.status;

    const isRunning = status === "RUNNING";
    const isCompleted = status === "COMPLETED";
    const isRunningOrCompleted = isRunning || isCompleted;

    return [
      {
        key: "",
        label: "상세정보",
        icon: "Information",
        // 상세정보는 항상 활성화
      },
      {
        key: "log",
        label: "로그",
        icon: "Log",
        disabled: !isRunningOrCompleted,
      },
      {
        key: "terminal",
        label: "웹터미널",
        icon: "Terminal",
        disabled: !isRunning,
      },
      {
        key: "monitoring",
        label: "모니터링",
        icon: "Monitoring01",
        disabled: !isRunningOrCompleted,
      },
      {
        key: "file",
        label: "파일 목록",
        icon: "Folder",
        disabled: !isRunning,
      },
      // {
      //   key: "security",
      //   label: "보안 취약점",
      //   icon: "Security",
      // },
    ];
  }, [workload?.status]);

  return (
    <>
      {/* 페이지 요약 정보 및 브레드크럼 네비게이션 */}
      <PageHeader
        pageKey="user.workload.detail"
        pageParams={{ id: workloadId }}
        description="Workload Information"
      />

      {/* 상세 페이지 메인 콘텐츠 영역 */}
      <DetailPageBody>
        {/* 왼쪽 사이드바 영역 - 워크로드 요약 정보 */}
        <WorkloadDetailPageAside />

        {/* 오른쪽 메인 콘텐츠 영역 */}
        <DetailPageContent>
          {/* 상단 탭 네비게이션 */}
          <RouteTab items={tabItems} />
          {/* 탭별 콘텐츠 영역 */}
          <DetailContentSection>{children}</DetailContentSection>
        </DetailPageContent>
      </DetailPageBody>
      {/* 워크로드 수정 모달 */}
      <UpdateWorkloadModal />
      {/* 워크로드 삭제 모달 */}
      <DeleteWorkloadModal />
      {/* 워크로드 종료 모달 */}
      <StopWorkloadModal />
      {/* 워크로드 재시작 모달 */}
      <RestartWorkloadModal />
    </>
  );
}
