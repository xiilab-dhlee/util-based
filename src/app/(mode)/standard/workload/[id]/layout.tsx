import type { Metadata } from "next";
import type { PropsWithChildren } from "react";
import type { TabsSeparatedItem } from "xiilab-ui";

import { UpdateWorkloadModal } from "@/domain/workload/components/detail/update-workload-modal";
import { WorkloadDetailPageAside } from "@/domain/workload/components/detail/workload-detail-page-aside";
import { RouteTab } from "@/shared/components/tab";
import { PageHeader } from "@/shared/layouts/common/page-header";
import {
  DetailContentSection,
  DetailPageBody,
  DetailPageContent,
} from "@/styles/layers/detail-page-layers.styled";

const TAB_ITEMS: TabsSeparatedItem[] = [
  {
    key: "",
    label: "상세정보",
    icon: "Information",
  },
  {
    key: "log",
    label: "로그",
    icon: "Log",
  },
  {
    key: "terminal",
    label: "웹터미널",
    icon: "Terminal",
  },
  {
    key: "monitoring",
    label: "모니터링",
    icon: "Monitoring01",
  },
  {
    key: "file",
    label: "파일 목록",
    icon: "Folder",
  },
  {
    key: "security",
    label: "보안 취약점",
    icon: "Security",
  },
];

export const metadata: Metadata = {
  title: "Workload",
};

export default async function WorkloadDetailLayout({
  children,
  params,
}: PropsWithChildren<{ params: Promise<{ id: string }> }>) {
  const { id } = await params;

  return (
    <>
      {/* 페이지 요약 정보 및 브레드크럼 네비게이션 */}
      <PageHeader
        title="워크로드 정보"
        icon="Back"
        description="Workload Information"
        customPathname="/standard/workload"
        breadcrumbKey="standard.workload.detail"
        breadcrumbParams={{ id }}
      />

      {/* 상세 페이지 메인 콘텐츠 영역 */}
      <DetailPageBody>
        {/* 왼쪽 사이드바 영역 - 워크로드 요약 정보 */}
        <WorkloadDetailPageAside />

        {/* 오른쪽 메인 콘텐츠 영역 */}
        <DetailPageContent>
          {/* 상단 탭 네비게이션 */}
          <RouteTab items={TAB_ITEMS} />
          {/* 탭별 콘텐츠 영역 */}
          <DetailContentSection>{children}</DetailContentSection>
        </DetailPageContent>
      </DetailPageBody>
      {/* 워크로드 수정 모달 */}
      <UpdateWorkloadModal />
    </>
  );
}
