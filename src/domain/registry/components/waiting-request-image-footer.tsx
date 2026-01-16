"use client";

import { useAtom } from "jotai";

import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";
import { waitingRequestImagePageAtom } from "../state/registry.atom";

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
