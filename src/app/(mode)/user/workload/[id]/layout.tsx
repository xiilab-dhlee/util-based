import type { PropsWithChildren } from "react";

import { DeleteWorkloadModal } from "@/domain/workload/components/delete-workload-modal";
import { WorkloadDetailPageAside } from "@/domain/workload/components/detail/workload-detail-page-aside";
import { WorkloadDetailTabs } from "@/domain/workload/components/detail/workload-detail-tabs";
import { RestartWorkloadModal } from "@/domain/workload/components/restart-workload-modal";
import { StopWorkloadModal } from "@/domain/workload/components/stop-workload-modal";
import { UpdateWorkloadModal } from "@/domain/workload/components/update-workload-modal";
import { PageHeader } from "@/shared/components/layouts/page-header";
import {
  DetailContentSection,
  DetailPageBody,
  DetailPageContent,
} from "@/styles/layers/detail-page-layers.styled";

/**
 * 워크로드 상세 레이아웃 컴포넌트
 * 워크로드 상태에 따라 탭의 활성화/비활성화를 동적으로 처리합니다.
 */
export default async function WorkloadDetailLayout({
  children,
  params,
}: PropsWithChildren<{ params: Promise<{ id: string }> }>) {
  const { id } = await params;

  return (
    <>
      {/* 페이지 요약 정보 및 브레드크럼 네비게이션 */}
      <PageHeader
        pageKey="user.workload.detail"
        pageParams={{ id }}
        description="Workload Information"
      />

      {/* 상세 페이지 메인 콘텐츠 영역 */}
      <DetailPageBody>
        {/* 왼쪽 사이드바 영역 - 워크로드 요약 정보 */}
        <WorkloadDetailPageAside />

        {/* 오른쪽 메인 콘텐츠 영역 */}
        <DetailPageContent>
          {/* 상단 탭 네비게이션 - 워크로드 상태에 따라 동적으로 탭 활성화/비활성화 */}
          <WorkloadDetailTabs workloadId={id} />
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
