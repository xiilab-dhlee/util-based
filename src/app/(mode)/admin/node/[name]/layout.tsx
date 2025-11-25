"use client";

import { useParams, usePathname } from "next/navigation";
import type { PropsWithChildren } from "react";
import type { TabsSeparatedItem } from "xiilab-ui";

import { NodeDetailPageAside } from "@/domain/node/components/detail/node-detail-page-aside";
import { PageHeader } from "@/shared/components/layouts/page-header";
import { RouteTab } from "@/shared/components/tab";
import type { PageKey } from "@/shared/constants/page-meta.constant";
import {
  DetailContentSection,
  DetailPageBody,
  DetailPageContent,
} from "@/styles/layers/detail-page-layers.styled";

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

export default function AdminNodeDetailLayout({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const params = useParams();
  const name = params.name as string;

  const lastSegment = pathname.split("/").filter(Boolean).pop();

  const pageKey: PageKey =
    lastSegment === "redfish"
      ? "admin.node.redfish"
      : lastSegment === "log"
        ? "admin.node.log"
        : "admin.node.detail";

  let description: string;
  if (lastSegment === "redfish") {
    description = "Hardware device and configuration information";
  } else if (lastSegment === "log") {
    description = "Log Notification";
  } else {
    description = "Node resource details · Resource information";
  }

  return (
    <>
      {/* 페이지 요약 정보 및 브레드크럼 네비게이션 */}
      <PageHeader
        pageKey={pageKey}
        pageParams={{ name }}
        description={description}
      />

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
