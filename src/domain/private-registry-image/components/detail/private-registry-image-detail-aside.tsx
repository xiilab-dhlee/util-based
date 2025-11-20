"use client";

import { useParams } from "next/navigation";
import styled from "styled-components";

import { PrivateRegistryImageDetailIntroCard } from "@/domain/private-registry-image/components/detail/private-registry-image-detail-intro-card";
import { useGetPrivateRegistryImageTags } from "@/domain/private-registry-image/hooks/use-get-private-registry-image-tags";
import { AsideFillCard } from "@/shared/layouts/aside/aside-fill-card";
import { DetailPageAside } from "@/styles/layers/detail-page-layers.styled";
import { PrivateRegistryImageTagCard } from "./private-registry-image-tag-card";

/**
 * 내부 레지스트리 이미지 상세 페이지 왼쪽 영역 컴포넌트
 *
 * 이미지 기본 정보 카드를 포함합니다.
 */
export function PrivateRegistryImageDetailAside() {
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
      <PrivateRegistryImageDetailIntroCard />
      <AsideFillCard
        title="검증 진행중인 목록"
        titleExtra={`총 ${data?.totalSize}개`}
      >
        <TagBody>
          {data?.content?.map((item) => (
            <PrivateRegistryImageTagCard key={item.id} {...item} />
          ))}
        </TagBody>
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
