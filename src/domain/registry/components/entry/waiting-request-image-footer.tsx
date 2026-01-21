"use client";

import { useAtom } from "jotai";

import { waitingRequestImagePageAtom } from "@/domain/registry/state/registry.atom";
import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";

interface WaitingRequestImageFooterProps {
  totalSize: number;
  isLoading: boolean;
}

export function WaitingRequestImageFooter({
  totalSize,
  isLoading,
}: WaitingRequestImageFooterProps) {
  const [page, setPage] = useAtom(waitingRequestImagePageAtom);

  const handlePage = (page: number) => {
    setPage(page);
  };

  return (
    <ListPageFooter
      total={totalSize}
      page={page}
      pageSize={5}
      onChange={handlePage}
      isLoading={isLoading}
    />
  );
}
