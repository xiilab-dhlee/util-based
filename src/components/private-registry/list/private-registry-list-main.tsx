"use client";

import { useState } from "react";

import { MyBreadcrumb } from "@/components/common/breadcrumb";
import { PrivateRegistryListClientWrapper } from "@/components/private-registry/list/private-registry-list-client-wrapper";
import { PrivateRegistryListFilter } from "@/components/private-registry/list/private-registry-list-filter";
import { PrivateRegistryListFooter } from "@/components/private-registry/list/private-registry-list-footer";
import { CreateContainerImageModal } from "@/components/private-registry/modal/create-container-image-modal";
import privateRegistryListConstants from "@/constants/private-registry/private-registry-list.constant";
import { PageGuide } from "@/layouts/common/page-guide";
import { PageHeader } from "@/layouts/common/page-header";
import { PageImageGuide } from "@/layouts/common/page-image-guide";
import {
  ListPageAside,
  ListPageBody,
  ListPageMain,
} from "@/styles/layers/list-page-layers.styled";
import type { CoreBreadcrumbItem } from "@/types/common/core.model";
import type { PrivateRegistryImage } from "@/types/private-registry/private-registry.model";

const BREADCRUMB_ITEMS: CoreBreadcrumbItem[] = [
  {
    title: "대시보드",
    icon: "Dashboard",
    href: "/standard",
  },
  { title: "내부 레지스트리" },
];

interface PrivateRegistryListMainProps {
  /** 서버에서 전달받은 초기 내부 레지스트리 이미지 데이터 */
  initialImages?: PrivateRegistryImage[];
}

/**
 * 내부 레지스트리 목록 페이지의 메인 컴포넌트
 *
 * 이 컴포넌트는 내부 레지스트리 이미지 목록을 표시하는 페이지의 주요 레이아웃을 담당합니다.
 * 컨테이너 이미지 생성 가이드, 필터링, 목록 표시, 페이지네이션 등의 기능을 포함합니다.
 */
export function PrivateRegistryListMain({
  initialImages = [],
}: PrivateRegistryListMainProps) {
  // 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateImage = () => {
    setIsModalOpen(true);
  };

  const handleSubmitImage = (data: {
    name: string;
    tag: string;
    workloads: string[];
  }) => {
    console.log("Creating container image:", data);
    // TODO: API 호출 구현
  };

  return (
    <>
      {/* 페이지 요약 정보 및 브레드크럼 */}
      <PageHeader
        title="내부 레지스트리"
        icon="Image"
        description="Private Registry"
      >
        <MyBreadcrumb items={BREADCRUMB_ITEMS} />
      </PageHeader>

      {/* 내부 레지스트리 목록 페이지 메인 영역 */}
      <ListPageMain>
        {/* 내부 레지스트리 목록 페이지 - 왼쪽 영역 (가이드 및 생성 카드) */}
        <ListPageAside $width={400}>
          <PageGuide
            titleEng="Add Container Image"
            title="컨테이너 이미지 생성"
            icon="Plus"
            description={[
              "이름, 태그, 레지스트리 타입 등 정보를 입력해",
              "내부 레지스트리 내 컨테이너 이미지를 생성하세요.",
              "컨테이너 이미지를 사용하면 복잡한 설치 과정 없이 누구나",
              "동일한 환경에서 쉽게 애플리케이션을 실행가능합니다.",
            ]}
            backgroundImageName="workload-intro-background.png"
            guides={privateRegistryListConstants.guides}
            buttonOptions={{
              enabled: true,
              text: "컨테이너 이미지 생성하기",
              onClick: handleCreateImage,
            }}
          />

          {/* 내부 레지스트리 가이드 이미지 카드 */}
          <PageImageGuide
            title="내부 레지스트리 가이드"
            guideImages={privateRegistryListConstants.guideImages}
          />
        </ListPageAside>

        {/* 내부 레지스트리 목록 페이지 - 오른쪽 영역 (필터, 목록, 페이지네이션) */}
        <ListPageBody>
          {/* 내부 레지스트리 목록 필터 */}
          <PrivateRegistryListFilter />

          {/* 내부 레지스트리 목록 본문 - 서버 데이터를 클라이언트 컴포넌트에 전달 */}
          <PrivateRegistryListClientWrapper initialImages={initialImages} />

          {/* 내부 레지스트리 목록 페이지네이션 */}
          <PrivateRegistryListFooter />
        </ListPageBody>
      </ListPageMain>

      {/* 컨테이너 이미지 생성 모달 */}
      <CreateContainerImageModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitImage}
      />
    </>
  );
}
