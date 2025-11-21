"use client";

import { usePathname } from "next/navigation";

import { isAdminMode } from "@/shared/utils/router.util";
import { ColumnLink } from "@/styles/layers/column-layer.styled";

interface WorkloadNameLinkProps {
  workspaceId: string;
  workloadId: string;
  workloadName: string;
}

export function WorkloadNameLink({
  workspaceId,
  workloadId,
  workloadName,
}: WorkloadNameLinkProps) {
  const pathname = usePathname();

  const isAdmin = isAdminMode(pathname);

  // 워크로드 상세 페이지 링크
  let href = `/user/workload/${workloadId}?workspaceId=${workspaceId}`;
  if (isAdmin) {
    href = `/admin/workspace/workload/${workloadId}?workspaceId=${workspaceId}`;
  }

  return <ColumnLink href={href}>{workloadName}</ColumnLink>;
}
