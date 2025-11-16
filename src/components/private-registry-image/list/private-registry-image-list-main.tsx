"use client";

import { openCreatePrivateRegistryImageModalAtom } from "@/atoms/private-registry-image/private-registry-image.atom";
import { MyBreadcrumb } from "@/components/common/breadcrumb";
import { PrivateRegistryImageListBody } from "@/components/private-registry-image/list/private-registry-image-list-body";
import { PrivateRegistryImageListFilter } from "@/components/private-registry-image/list/private-registry-image-list-filter";
import { PrivateRegistryImageListFooter } from "@/components/private-registry-image/list/private-registry-image-list-footer";
import {
  PRIVATE_REGISTRY_IMAGE_GUIDE_IMAGES,
  PRIVATE_REGISTRY_IMAGE_GUIDES,
} from "@/constants/private-registry-image/private-registry-image.constant";
import { useGlobalModal } from "@/hooks/common/use-global-modal";
import { PageGuide } from "@/layouts/common/page-guide";
import { PageHeader } from "@/layouts/common/page-header";
import { PageImageGuide } from "@/layouts/common/page-image-guide";
import {
  ListPageAside,
  ListPageBody,
  ListPageMain,
} from "@/styles/layers/list-page-layers.styled";
import type { CoreBreadcrumbItem } from "@/types/common/core.model";
import { DeletePrivateRegistryImageModal } from "../delete-private-registry-image-modal";
import { CreatePrivateRegistryImageModal } from "./create-private-registry-image-modal";

const BREADCRUMB_ITEMS: CoreBreadcrumbItem[] = [
  {
    title: "대시보드",
    icon: "Dashboard",
    href: "/standard/dashboard",
  },
  { title: "내부 레지스트리" },
];

export function PrivateRegistryImageListMain() {
  const { onOpen } = useGlobalModal(openCreatePrivateRegistryImageModalAtom);
  const handleCreatePrivateRegistryImage = () => {
    onOpen();
  };

  return (
    <>
      <PageHeader
        title="내부 레지스트리"
        icon="Image"
        description="Private Registry"
      >
        <MyBreadcrumb items={BREADCRUMB_ITEMS} />
      </PageHeader>

      {/* 내부 레지스트리 이미지 목록 페이지 메인 영역 */}
      <ListPageMain>
        {/* 내부 레지스트리 이미지 목록 페이지 - 왼쪽 영역 (가이드 및 생성 카드) */}
        <ListPageAside $width={400}>
          <PageGuide
            titleEng="Create Container Image"
            title="컨테이너 이미지 생성"
            icon="Plus"
            description={[
              "이름, 태그, 레지스트리 타입 등 정보를 입력해",
              "내부 레지스트리 내 컨테이너 이미지를 생성하세요.",
              "컨테이너 이미지를 사용하면 복잡한 설치 과정 없이 누구나",
              "동일한 환경에서 쉽게 애플리케이션을 실행가능합니다.",
            ]}
            backgroundImageName="workload-intro-background.png"
            guides={PRIVATE_REGISTRY_IMAGE_GUIDES}
            buttonOptions={{
              enabled: true,
              text: "컨테이너 이미지 생성하기",
              onClick: handleCreatePrivateRegistryImage,
            }}
          />

          {/* 내부 레지스트리 이미지 가이드 이미지 카드 */}
          <PageImageGuide
            title="내부 레지스트리 가이드"
            guideImages={PRIVATE_REGISTRY_IMAGE_GUIDE_IMAGES}
          />
        </ListPageAside>

        {/* 내부 레지스트리 이미지 목록 페이지 - 오른쪽 영역 (필터, 목록, 페이지네이션) */}
        <ListPageBody>
          {/* 내부 레지스트리 이미지 목록 필터 */}
          <PrivateRegistryImageListFilter />
          {/* 내부 레지스트리 이미지 목록 본문 */}
          <PrivateRegistryImageListBody />
          {/* 내부 레지스트리 이미지 목록 페이지네이션 */}
          <PrivateRegistryImageListFooter />
        </ListPageBody>
      </ListPageMain>
      {/* 컨테이너 이미지 생성 모달 */}
      <CreatePrivateRegistryImageModal />
      {/* 컨테이너 이미지 삭제 모달 */}
      <DeletePrivateRegistryImageModal />
    </>
  );
}
