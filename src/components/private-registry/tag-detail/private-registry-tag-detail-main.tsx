"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Breadcrumb } from "xiilab-ui";

import { PageHeader } from "@/layouts/common/page-header";
import {
  ListPageAside,
  ListPageBody,
  ListPageMain,
} from "@/styles/layers/list-page-layers.styled";
import TagLogViewModal from "../modal/tag-log-view-modal";
import PrivateRegistryTagDetailAside from "./private-registry-tag-detail-aside";
import PrivateRegistryTagDetailBody, {
  CriticalVulnerabilityList,
} from "./private-registry-tag-detail-body";

interface TagDetailMainProps {
  tagId: string;
  isVerifying?: boolean;
}

export function PrivateRegistryTagDetailMain({
  tagId,
  isVerifying = false,
}: TagDetailMainProps) {
  const router = useRouter();

  // 검증 중인 경우 5초 후 자동으로 완료 상태로 전환 (실제에서는 API 응답에 따라)
  useEffect(() => {
    if (isVerifying) {
      const timer = setTimeout(() => {
        router.replace(`/standard/private-registry/tag/${tagId}`);
      }, 5000); // 5초 후 검증 완료

      return () => clearTimeout(timer);
    }
  }, [isVerifying, tagId, router]);

  // 브레드크럼 데이터
  const breadcrumbItems = [
    { title: "대시보드", href: "/standard/dashboard" },
    { title: "내부 레지스트리", href: "/standard/private-registry" },
    {
      title: "컨테이너 이미지 상세정보",
      href: "/standard/private-registry/detail",
    },
    { title: "태그 상세정보" },
  ];

  return (
    <>
      {/* 페이지 헤더 */}
      <PageHeader
        title="태그 상세정보"
        icon="Back"
        description="Tag Information"
      >
        <Breadcrumb items={breadcrumbItems} />
      </PageHeader>

      {/* 태그 상세 페이지 메인 영역 */}
      <ListPageMain>
        {/* 태그 상세 페이지 - 왼쪽 영역 (태그 정보 및 Critical 취약점 목록) */}
        <ListPageAside $width={400}>
          <PrivateRegistryTagDetailAside />
          <CriticalVulnerabilityList />
        </ListPageAside>

        {/* 태그 상세 페이지 - 오른쪽 영역 (취약점 목록) */}
        <ListPageBody>
          {/* 취약점 목록 본문 */}
          <PrivateRegistryTagDetailBody isVerifying={isVerifying} />
        </ListPageBody>
      </ListPageMain>

      {/* 로그 보기 모달 */}
      <TagLogViewModal />
    </>
  );
}
