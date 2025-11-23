"use client";

import { Icon } from "xiilab-ui";

import { InternalRegistryImageListBody } from "@/domain/internal-registry-image/components/list/internal-registry-image-list-body";
import { InternalRegistryImageListFilter } from "@/domain/internal-registry-image/components/list/internal-registry-image-list-filter";
import { InternalRegistryImageListFooter } from "@/domain/internal-registry-image/components/list/internal-registry-image-list-footer";
import { openCreateInternalRegistryImageModalAtom } from "@/domain/internal-registry-image/state/internal-registry-image.atom";
import { PageGuide } from "@/shared/components/layouts/page-guide";
import { PageHeader } from "@/shared/components/layouts/page-header";
import { PageImageGuide } from "@/shared/components/layouts/page-image-guide";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import type { CoreGuide, CoreGuideImage } from "@/shared/types/core.model";
import {
  ListPageAside,
  ListPageBody,
  ListPageMain,
} from "@/styles/layers/list-page-layers.styled";
import { DeleteInternalRegistryImageModal } from "../delete-internal-registry-image-modal";
import { CreateInternalRegistryImageModal } from "./create-internal-registry-image-modal";

const GUIDE_IMAGES: CoreGuideImage[] = [
  {
    id: "1",
    src: "/images/internal-registry-guide1.png",
    alt: "워크로드 가이드 1",
  },
  {
    id: "2",
    src: "/images/internal-registry-guide2.png",
    alt: "워크로드 가이드 2",
  },
  {
    id: "3",
    src: "/images/internal-registry-guide3.png",
    alt: "워크로드 가이드 3",
  },
];

const GUIDES: CoreGuide[] = [
  {
    icon: <Icon name="InternalRegistry" color="var(--icon-fill)" />,
    title: "내부 레지스트리란?",
    description: [
      "조직 내부에서 사용하는 컨테이너 이미지를 저장하고 관리하는",
      "전용 저장소입니다. 인터넷 연결 없이 사용하실 수 있습니다.",
    ],
  },
  {
    icon: <Icon name="Security" color="var(--icon-fill)" />,
    title: "컨테이너 이미지란?",
    description: [
      "애플리케이션 실행에 필요한 프로그램, 라이브러리, 설정 파일 등을",
      "하나로 묶은 실행 패키지입니다.",
    ],
  },
];

export function InternalRegistryImageListMain() {
  const { onOpen } = useGlobalModal(openCreateInternalRegistryImageModalAtom);
  const handleCreateInternalRegistryImage = () => {
    onOpen();
  };

  return (
    <>
      <PageHeader
        pageKey="user.internal-registry-image"
        description="Internal Registry"
      />

      {/* 내부 레지스트리 이미지 목록 페이지 메인 영역 */}
      <ListPageMain>
        {/* 내부 레지스트리 이미지 목록 페이지 - 왼쪽 영역 (가이드 및 생성 카드) */}
        <ListPageAside $width={400}>
          <PageGuide
            titleEng="Create Container Image"
            title="컨테이너 이미지 생성"
            icon="Image"
            description={[
              "이름, 태그, 레지스트리 타입 등 정보를 입력해",
              "내부 레지스트리 내 컨테이너 이미지를 생성하세요.",
              "컨테이너 이미지를 사용하면 복잡한 설치 과정 없이 누구나",
              "동일한 환경에서 쉽게 애플리케이션을 실행가능합니다.",
            ]}
            backgroundImageName="internal-registry-intro-background.png"
            guides={GUIDES}
            buttonOptions={{
              enabled: true,
              text: "컨테이너 이미지 생성하기",
              onClick: handleCreateInternalRegistryImage,
            }}
          />

          {/* 내부 레지스트리 이미지 가이드 이미지 카드 */}
          <PageImageGuide
            title="내부 레지스트리 가이드"
            guideImages={GUIDE_IMAGES}
          />
        </ListPageAside>

        {/* 내부 레지스트리 이미지 목록 페이지 - 오른쪽 영역 (필터, 목록, 페이지네이션) */}
        <ListPageBody>
          {/* 내부 레지스트리 이미지 목록 필터 */}
          <InternalRegistryImageListFilter />
          {/* 내부 레지스트리 이미지 목록 본문 */}
          <InternalRegistryImageListBody />
          {/* 내부 레지스트리 이미지 목록 페이지네이션 */}
          <InternalRegistryImageListFooter />
        </ListPageBody>
      </ListPageMain>
      {/* 컨테이너 이미지 생성 모달 */}
      <CreateInternalRegistryImageModal />
      {/* 컨테이너 이미지 삭제 모달 */}
      <DeleteInternalRegistryImageModal />
    </>
  );
}
