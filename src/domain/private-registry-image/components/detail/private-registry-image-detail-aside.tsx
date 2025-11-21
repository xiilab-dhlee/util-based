"use client";

import styled from "styled-components";

import { PrivateRegistryImageDetailIntroCard } from "@/domain/private-registry-image/components/detail/private-registry-image-detail-intro-card";
import { useGetWaitingRequestImages } from "@/domain/request-image/hooks/use-get-waiting-request-images";
import { AsideFillCard } from "@/shared/components/layouts/aside-fill-card";
import { DetailPageAside } from "@/styles/layers/detail-page-layers.styled";
import { customScrollbar } from "@/styles/mixins/scrollbar";
import { PendingRequestImageCard } from "./pending-request-image-card";

export function PrivateRegistryImageDetailAside() {
  const { data } = useGetWaitingRequestImages({
    page: 1,
    size: 100,
    searchText: "",
  });

  return (
    <DetailPageAside>
      {/* 이미지 기본 정보 카드 */}
      <PrivateRegistryImageDetailIntroCard />
      <AsideFillCard
        title="이미지 사용 요청 승인 대기 목록"
        titleExtra={`총 ${data?.totalSize}개`}
      >
        <CardWrapper>
          {data?.content?.map((item) => (
            <PendingRequestImageCard key={item.id} {...item} />
          ))}
        </CardWrapper>
      </AsideFillCard>
    </DetailPageAside>
  );
}

const CardWrapper = styled.div`
  overflow-y: auto;
  max-height: 440px;

  ${customScrollbar()}
`;
