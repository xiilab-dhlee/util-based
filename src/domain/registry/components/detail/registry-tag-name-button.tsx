"use client";

import { useParams } from "next/navigation";
import type { MouseEvent } from "react";
import styled from "styled-components";

import type { ImageTagListResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { REGISTRY_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";

interface RegistryTagNameButtonProps extends ImageTagListResponse {}

export function RegistryTagNameButton({
  imageTagId,
  imageTagName,
  hasMetadata,
}: RegistryTagNameButtonProps) {
  const { name } = useParams<{ name: string }>();
  const harborImageName = name ? decodeURIComponent(name) : "";

  const publish = usePublish();

  // 메타데이터가 없으면 상세 조회 불가
  if (!hasMetadata || !imageTagId) {
    return <span>{imageTagName || "-"}</span>;
  }

  const handleClick = (e: MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();

    publish(REGISTRY_EVENTS.openTagDetailModal, {
      harborImageName,
      imageTagId,
      imageTagName,
    });
  };

  return <Container onClick={handleClick}>{imageTagName || "-"}</Container>;
}

const Container = styled.span`
  cursor: pointer;
`;
