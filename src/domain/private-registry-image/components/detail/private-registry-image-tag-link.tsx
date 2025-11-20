"use client";

import { useParams } from "next/navigation";

import { ColumnLink } from "@/styles/layers/column-layer.styled";

interface PrivateRegistryImageNameLinkProps {
  tagId: number;
  tagName: string;
}

export function PrivateRegistryImageTagLink({
  tagId,
  tagName,
}: PrivateRegistryImageNameLinkProps) {
  const { id } = useParams();

  return (
    <ColumnLink href={`/user/private-registry-image/${id}/tag/${tagId}`}>
      {tagName}
    </ColumnLink>
  );
}
