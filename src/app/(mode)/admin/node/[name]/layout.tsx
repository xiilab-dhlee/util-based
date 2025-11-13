"use client";

import { usePathname } from "next/navigation";
import type { PropsWithChildren } from "react";
import type { TabsSeparatedItem } from "xiilab-ui";

import { MyBreadcrumb } from "@/components/common/breadcrumb";
import { RouteTab } from "@/components/common/tab";
import { NodeDetailPageAside } from "@/components/node/detail/node-detail-page-aside";
import { PageHeader } from "@/layouts/common/page-header";
import {
  DetailContentSection,
  DetailPageBody,
  DetailPageContent,
} from "@/styles/layers/detail-page-layers.styled";
import type { CoreBreadcrumbItem } from "@/types/common/core.model";

const BREADCRUMB_ITEMS: CoreBreadcrumbItem[] = [
  {
    title: "대시보드",
    icon: "Dashboard",
    href: "/admin",
  },
  { title: "노드 관리", href: "/admin/node" },
  { title: "노드 정보" },
];

const TAB_ITEMS: TabsSeparatedItem[] = [
  {
    key: "",
    label: "노드 자원 상세정보 · 리소스 정보",
    // icon: "Shield",
  },
  {
    key: "redfish",
    label: "하드웨어 장치 및 구성 정보",
    icon: "CirclesExt",
  },
  {
    key: "log",
    label: "로그",
    icon: "Alarm",
  },
];

/**
 * 워크로드 상세 페이지 레이아웃
 *
 * 이 레이아웃은 workload/[id] 하위의 모든 페이지에 적용됩니다.
 */
export default function AdminNodeDetailLayout({ children }: PropsWithChildren) {
  const pathname = usePathname();

  const lastSegment = pathname.split("/").filter(Boolean).pop();

  let title: string;
  let description: string;
  if (lastSegment === "redfish") {
    title = "하드웨어 장치 및 구성 정보";
    description = "Hardware device and configuration information";
  } else if (lastSegment === "log") {
    title = "로그 알림";
    description = "Log Notification";
  } else {
    title = "노드 자원 상세정보 · 리소스 정보";
    description = "Node resource details · Resource information";
  }

  return (
    <>
      {/* 페이지 요약 정보 및 브레드크럼 네비게이션 */}
      <PageHeader
        title={title}
        icon="Back"
        description={description}
        customPathname="/admin/node"
      >
        <MyBreadcrumb items={BREADCRUMB_ITEMS} />
      </PageHeader>

      {/* 상세 페이지 메인 콘텐츠 영역 */}
      <DetailPageBody>
        {/* 왼쪽 사이드바 영역 - 워크로드 요약 정보 */}
        <NodeDetailPageAside />
        {/* 오른쪽 메인 콘텐츠 영역 */}
        <DetailPageContent>
          {/* 상단 탭 네비게이션 */}
          <RouteTab items={TAB_ITEMS} />
          {/* 탭별 콘텐츠 영역 */}
          <DetailContentSection>{children}</DetailContentSection>
        </DetailPageContent>
      </DetailPageBody>
    </>
  );
}
