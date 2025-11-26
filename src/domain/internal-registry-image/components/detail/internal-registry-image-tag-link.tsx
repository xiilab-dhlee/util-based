"use client";

import { useParams } from "next/navigation";

import { ColumnLink } from "@/styles/layers/column-layer.styled";

interface InternalRegistryImageNameLinkProps {
  tagId: number;
  tagName: string;
}

export function InternalRegistryImageTagLink({
  tagId,
  tagName,
}: InternalRegistryImageNameLinkProps) {
  const { id } = useParams();

  return (
    <ColumnLink href={`/user/internal-registry-image/${id}/tag/${tagId}`}>
      {tagName}
    </ColumnLink>
  );
}
