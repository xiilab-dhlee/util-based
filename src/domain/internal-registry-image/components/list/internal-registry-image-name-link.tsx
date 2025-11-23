"use client";

import { usePathname } from "next/navigation";

import { isAdminMode } from "@/shared/utils/router.util";
import { ColumnLink } from "@/styles/layers/column-layer.styled";

interface InternalRegistryImageNameLinkProps {
  imageId: number;
  projectId: number;
  imageName: string;
}

export function InternalRegistryImageNameLink({
  imageId,
  projectId,
  imageName,
}: InternalRegistryImageNameLinkProps) {
  const pathname = usePathname();

  const isAdmin = isAdminMode(pathname);

  // 내부 레지스트리 이미지 상세 페이지 링크
  let href = `/user/internal-registry-image/${imageId}`;
  if (isAdmin) {
    href = `/admin/internal-registry-image/${imageId}?projectId=${projectId}`;
  }

  return <ColumnLink href={href}>{imageName}</ColumnLink>;
}
