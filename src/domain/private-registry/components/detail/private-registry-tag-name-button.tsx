"use client";

import { useParams } from "next/navigation";
import styled from "styled-components";

import type { ImageTagListResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { PRIVATE_REGISTRY_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";

interface PrivateRegistryTagNameButtonProps extends ImageTagListResponse {}

export function PrivateRegistryTagNameButton({
  imageTagId,
  imageTagName,
  hasMetadata,
}: PrivateRegistryTagNameButtonProps) {
  const { name } = useParams<{ name: string }>();
  const harborImageName = name ? decodeURIComponent(name) : "";

  const publish = usePublish();

  // 메타데이터가 없으면 상세 조회 불가
  if (!hasMetadata || !imageTagId) {
    return <span>{imageTagName || "-"}</span>;
  }

  const handleClick = () => {
    publish(PRIVATE_REGISTRY_EVENTS.sendViewTagDetail, {
      harborImageName,
      imageTagId,
    });
  };

  return (
    <Container as="button" onClick={handleClick}>
      {imageTagName || "-"}
    </Container>
  );
}

const Container = styled.span`
  cursor: pointer;
`;
