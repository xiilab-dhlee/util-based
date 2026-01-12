"use client";

import styled from "styled-components";

import { useGetWaitingRequestImages } from "@/domain/request-image/hooks/use-get-waiting-request-images";
import { EmptyState } from "@/shared/components/empty-state/empty-state";
import { ScrollShadowContainer } from "@/shared/components/layouts/scroll-shadow-container";
import { MySpinner } from "@/shared/components/spinner";
import { customScrollbar } from "@/styles/mixins/scrollbar";
import { PendingRequestImageCard } from "./pending-request-image-card";

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
        <EmptyState />
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
        {data?.content?.map((item) => (
          <PendingRequestImageCard key={item.id} {...item} />
        ))}
      </CardWrapper>
    </ScrollShadowContainer>
  );
}

const CardWrapper = styled.div`
  /* overflow-y: auto; */
  height: 503px;

  /* ${customScrollbar()} */
`;
