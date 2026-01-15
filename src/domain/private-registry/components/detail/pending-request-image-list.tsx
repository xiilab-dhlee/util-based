"use client";

import styled from "styled-components";

import { PendingRequestImageCard } from "@/domain/private-registry/components/detail/pending-request-image-card";
import { useGetWaitingRequestImages } from "@/domain/request-image/hooks/use-get-waiting-request-images";
import { EmptyState } from "@/shared/components/empty-state/empty-state";
import { ScrollShadowContainer } from "@/shared/components/layouts/scroll-shadow-container";
import { MySpinner } from "@/shared/components/spinner";

export function PendingRequestImageList() {
  const { data, isLoading, isError } = useGetWaitingRequestImages({
    page: 1,
    size: 100,
    searchText: "",
  });

  if (isLoading) {
    return (
      <CardWrapper>
        <MySpinner />
      </CardWrapper>
    );
  }

  if (isError) {
    return (
      <CardWrapper>
        <EmptyState title="데이터를 불러오는 중 오류가 발생했습니다" />
      </CardWrapper>
    );
  }

  if (data?.content.length === 0) {
    return (
      <CardWrapper>
        <EmptyState />
      </CardWrapper>
    );
  }

  return (
    <ScrollShadowContainer shadowColor="rgba(0, 0, 0, 0.15)" shadowHeight={20}>
      <CardWrapper>
        {data?.content.map((item) => (
          <PendingRequestImageCard key={item.id} {...item} />
        ))}
      </CardWrapper>
    </ScrollShadowContainer>
  );
}

const CardWrapper = styled.div`
  height: 503px;
`;
