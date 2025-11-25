"use client";

import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";

interface KubernetesResourceListFooterProps {
  total: number;
  page: number;
  pageSize: number;
  onChange: (page: number) => void;
  isLoading: boolean;
}

export function KubernetesResourceListFooter({
  total,
  page,
  pageSize,
  onChange,
  isLoading,
}: KubernetesResourceListFooterProps) {
  return (
    <ListPageFooter
      total={total}
      page={page}
      pageSize={pageSize}
      onChange={onChange}
      isLoading={isLoading}
    />
  );
}
