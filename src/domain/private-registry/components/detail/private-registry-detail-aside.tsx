"use client";

import { PendingRequestImageList } from "@/domain/private-registry/components/detail/pending-request-image-list";
import { PrivateRegistryDetailIntroCard } from "@/domain/private-registry/components/detail/private-registry-detail-intro-card";
import { useGetWaitingRequestImages } from "@/domain/request-image/hooks/use-get-waiting-request-images";
import { AsideFillCard } from "@/shared/components/layouts/aside-fill-card";
import { DetailPageAside } from "@/styles/layers/detail-page-layers.styled";

export function PrivateRegistryDetailAside() {
  const { data } = useGetWaitingRequestImages({
    page: 1,
    size: 100,
    searchText: "",
  });

  return (
    <DetailPageAside>
      {/* 이미지 기본 정보 카드 */}
      <PrivateRegistryDetailIntroCard />
      <AsideFillCard
        title="이미지 사용 요청 승인 대기 목록"
        titleExtra={`총 ${data?.totalSize}개`}
      >
        <PendingRequestImageList />
      </AsideFillCard>
    </DetailPageAside>
  );
}
