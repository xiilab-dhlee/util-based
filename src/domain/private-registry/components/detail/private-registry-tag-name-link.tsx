"use client";

import { useParams } from "next/navigation";

import type { ImageTagListResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { ROUTES } from "@/shared/constants/routes.constant";
import { ColumnLink } from "@/styles/layers/column-layer.styled";

interface PrivateRegistryTagNameLinkProps extends ImageTagListResponse {}

/**
 * 프라이빗 레지스트리 태그 이름 링크 컴포넌트
 * 클릭하면 태그 상세 페이지로 이동
 *
 */
export function PrivateRegistryTagNameLink({
  imageTagId,
  imageTagName,
}: PrivateRegistryTagNameLinkProps) {
  const { name } = useParams();
  const harborImageName = decodeURIComponent(name as string);

  const href = ROUTES.USER_PRIVATE_REGISTRY_TAG(
    encodeURIComponent(harborImageName),
    (imageTagId ?? -1).toString(),
  );

  return (
    <ColumnLink href={href}>
      <span className="truncate">{imageTagName || "-"}</span>
    </ColumnLink>
  );
}
