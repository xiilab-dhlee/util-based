"use client";

import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";

interface RequestResourceFooterProps {
  total: number;
  page: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
}

export function RequestResourceFooter({
  total,
  page,
  isLoading,
  onPageChange,
}: RequestResourceFooterProps) {
  return (
    <ListPageFooter
      total={total}
      page={page}
      pageSize={LIST_PAGE_SIZE}
      onChange={onPageChange}
      isLoading={isLoading}
    />
  );
}
