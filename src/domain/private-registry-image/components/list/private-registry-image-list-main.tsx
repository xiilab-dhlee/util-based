"use client";

import { Icon } from "xiilab-ui";

import { PrivateRegistryImageListBody } from "@/domain/private-registry-image/components/list/private-registry-image-list-body";
import { PrivateRegistryImageListFilter } from "@/domain/private-registry-image/components/list/private-registry-image-list-filter";
import { PrivateRegistryImageListFooter } from "@/domain/private-registry-image/components/list/private-registry-image-list-footer";
import { openCreatePrivateRegistryImageModalAtom } from "@/domain/private-registry-image/state/private-registry-image.atom";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { PageGuide } from "@/shared/layouts/common/page-guide";
import { PageHeader } from "@/shared/layouts/common/page-header";
import { PageImageGuide } from "@/shared/layouts/common/page-image-guide";
import type { CoreGuide, CoreGuideImage } from "@/shared/types/core.model";
import {
  ListPageAside,
  ListPageBody,
  ListPageMain,
} from "@/styles/layers/list-page-layers.styled";
import { DeletePrivateRegistryImageModal } from "../delete-private-registry-image-modal";
import { CreatePrivateRegistryImageModal } from "./create-private-registry-image-modal";

const GUIDE_IMAGES: CoreGuideImage[] = [
  {
    id: "1",
    src: "/images/private-registry-guide1.png",
    alt: "워크로드 가이드 1",
  },
  {
    id: "2",
    src: "/images/private-registry-guide2.png",
    alt: "워크로드 가이드 2",
  },
  {
    id: "3",
    src: "/images/private-registry-guide3.png",
    alt: "워크로드 가이드 3",
  },
];

const GUIDES: CoreGuide[] = [
  {
    icon: <Icon name="Image" color="var(--icon-fill)" />,
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
        breadcrumbKey="standard.private-registry-image"
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
            backgroundImageName="private-registry-intro-background.png"
            guides={GUIDES}
            buttonOptions={{
              enabled: true,
              text: "컨테이너 이미지 생성하기",
              onClick: handleCreatePrivateRegistryImage,
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
