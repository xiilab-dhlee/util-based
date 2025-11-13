"use client";

import { useState } from "react";
import { Breadcrumb } from "xiilab-ui";

import { PageHeader } from "@/layouts/common/page-header";
import {
  ListPageAside,
  ListPageBody,
  ListPageMain,
} from "@/styles/layers/list-page-layers.styled";
import PrivateRegistryDetailAside from "./private-registry-detail-aside";
import PrivateRegistryDetailBody from "./private-registry-detail-body";
import PrivateRegistryDetailFilter from "./private-registry-detail-filter";
import PrivateRegistryDetailFooter from "./private-registry-detail-footer";

interface PrivateRegistryDetailMainProps {
  /** URL에서 추출한 이미지 ID */
  imageId: string;
}

/**
 * 내부 레지스트리 상세 페이지의 메인 컴포넌트
 *
 * 이 컴포넌트는 내부 레지스트리 이미지의 상세 정보를 표시하는 페이지의 주요 레이아웃을 담당합니다.
 * 컨테이너 이미지 기본 정보, 검증 진행중인 목록, 태그 목록 등의 기능을 포함합니다.
 */
export function PrivateRegistryDetailMain({
  imageId,
}: PrivateRegistryDetailMainProps) {
  // 선택된 태그 수 상태
  const [selectedTagsCount, setSelectedTagsCount] = useState(0);

  // 브레드크럼 데이터
  const breadcrumbItems = [
    { title: "대시보드", href: "/standard/dashboard" },
    { title: "내부 레지스트리", href: "/standard/private-registry" },
    { title: "상세정보" },
  ];

  return (
    <>
      {/* 페이지 헤더 */}
      <PageHeader
        title="컨테이너 이미지 상세정보"
        icon="Image"
        description="Container Image Details"
      >
        <Breadcrumb items={breadcrumbItems} />
      </PageHeader>

      {/* 내부 레지스트리 상세 페이지 메인 영역 */}
      <ListPageMain>
        {/* 내부 레지스트리 상세 페이지 - 왼쪽 영역 (기본정보 및 검증 목록) */}
        <ListPageAside $width={400}>
          <PrivateRegistryDetailAside imageId={imageId} />
        </ListPageAside>

        {/* 내부 레지스트리 상세 페이지 - 오른쪽 영역 (태그 목록) */}
        <ListPageBody>
          {/* 태그 목록 필터 */}
          <PrivateRegistryDetailFilter selectedTagsCount={selectedTagsCount} />

          {/* 태그 목록 본문 */}
          <PrivateRegistryDetailBody
            onSelectedTagsChange={setSelectedTagsCount}
          />

          {/* 태그 목록 페이지네이션 */}
          <PrivateRegistryDetailFooter />
        </ListPageBody>
      </ListPageMain>
    </>
  );
}
