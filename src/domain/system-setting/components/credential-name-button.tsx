"use client";

import styled from "styled-components";

import type { AdminCredentialListItemResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { CREDENTIAL_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";

interface CredentialNameButtonProps extends AdminCredentialListItemResponse {}

export function CredentialNameButton({
  credentialName,
  creatorId,
  credentialId,
}: CredentialNameButtonProps) {
  const publish = usePublish();

  const handleClick = () => {
    publish(CREDENTIAL_EVENTS.openDetailModal, {
      accountId: creatorId,
      credentialId,
    });
  };

  return <Container onClick={handleClick}>{credentialName || "-"}</Container>;
}

const Container = styled.span`
  cursor: pointer;
`;
