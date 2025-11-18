"use client";

import { useParams } from "next/navigation";
import styled from "styled-components";

import { useGetPrivateRegistryImageTags } from "@/hooks/private-registry-image/use-get-private-registry-image-tags";
import { AsideFillCard } from "@/layouts/aside/aside-fill-card";
import { DetailPageAside } from "@/styles/layers/detail-page-layers.styled";
import { PrivateRegistryImageTagDetailIntroCard } from "./private-registry-image-tag-detail-intro-card";

/**
 * 내부 레지스트리 이미지 상세 페이지 왼쪽 영역 컴포넌트
 *
 * 이미지 기본 정보 카드를 포함합니다.
 */
export function PrivateRegistryImageTagDetailAside() {
  const { id } = useParams();

  const { data } = useGetPrivateRegistryImageTags({
    page: 1,
    size: 3,
    searchText: "",
    imageId: Number(id),
  });

  return (
    <DetailPageAside>
      {/* 이미지 기본 정보 카드 */}
      <PrivateRegistryImageTagDetailIntroCard />
      <AsideFillCard
        title="검증 진행중인 목록"
        titleExtra={`총 ${data?.totalSize}개`}
      >
        <TagBody></TagBody>
      </AsideFillCard>
    </DetailPageAside>
  );
}

const TagBody = styled.div`
  flex: 1;
  max-height: 390px;
  overflow-y: auto;
  width: 100%;
`;
