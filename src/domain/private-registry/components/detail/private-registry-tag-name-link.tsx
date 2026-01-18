"use client";

import { useParams } from "next/navigation";

import type { ImageTagListResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { ROUTES } from "@/shared/constants/routes.constant";
import { ColumnLink } from "@/styles/layers/column-layer.styled";

interface PrivateRegistryTagNameLinkProps extends ImageTagListResponse {}

/**
 * 프라이빗 레지스트리 태그 이름 링크 컴포넌트
 * 클릭하면 태그 상세 페이지로 이동
 * hasMetadata가 false인 경우 상세 조회 불가하므로 링크 비활성화
 */
export function PrivateRegistryTagNameLink({
  imageTagId,
  imageTagName,
  hasMetadata,
}: PrivateRegistryTagNameLinkProps) {
  const { name } = useParams<{ name: string }>();
  const harborImageName = name ? decodeURIComponent(name) : "";

  // 메타데이터가 없으면 상세 조회 불가
  if (!hasMetadata || !imageTagId) {
    return <span className="truncate">{imageTagName || "-"}</span>;
  }

  const href = ROUTES.USER_PRIVATE_REGISTRY_TAG(
    encodeURIComponent(harborImageName),
    imageTagId.toString(),
  );

  return (
    <ColumnLink href={href}>
      <span className="truncate">{imageTagName || "-"}</span>
    </ColumnLink>
  );
}
