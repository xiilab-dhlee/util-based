"use client";

import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import styled from "styled-components";

import { MySpinner } from "@/components/common/spinner";

export function GlobalLoadingSpinner() {
  const isMutating = useIsMutating();
  const isLoading = useIsFetching();

  if (isMutating === 0 && isLoading === 0) {
    return null;
  }

  return (
    <LoadingWrapper>
      <MySpinner />
    </LoadingWrapper>
  );
}

const LoadingWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 20000;
  background-color: rgba(0, 0, 0, 0.3);
`;
