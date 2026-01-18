"use client";

import { useAtom } from "jotai";

import { kubernetesEventPageAtom } from "@/domain/kubernetes-monitoring/atom/kubernetes-monitoring.atom";
import { KUBERNETES_EVENT_LIST_PAGE_SIZE } from "@/domain/kubernetes-monitoring/constants/kubernetes-monitoring.constant";
import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";

interface KubernetesEventListFooterProps {
  total: number;
  isLoading?: boolean;
}

export function KubernetesEventListFooter({
  total,
  isLoading = false,
}: KubernetesEventListFooterProps) {
  const [page, setPage] = useAtom(kubernetesEventPageAtom);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <ListPageFooter
      total={total}
      page={page}
      pageSize={KUBERNETES_EVENT_LIST_PAGE_SIZE}
      onChange={handlePageChange}
      isLoading={isLoading}
    />
  );
}
