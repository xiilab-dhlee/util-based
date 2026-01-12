"use client";

import { useAtom } from "jotai";
import { useResetAtom } from "jotai/utils";

import {
  privateregistryCheckedListAtom,
  privateregistryPageAtom,
} from "@/domain/private-registry/state/private-registry.atom";
import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";

interface PrivateRegistryListFooterProps {
  totalSize: number;
  isLoading: boolean;
}

export function PrivateRegistryListFooter({
  totalSize,
  isLoading,
}: PrivateRegistryListFooterProps) {
  const [page, setPage] = useAtom(privateregistryPageAtom);
  const resetCheckedList = useResetAtom(privateregistryCheckedListAtom);

  const handlePage = (page: number) => {
    resetCheckedList();
    setPage(page);
  };

  return (
    <ListPageFooter
      total={totalSize}
      page={page}
      pageSize={LIST_PAGE_SIZE}
      onChange={handlePage}
      isLoading={isLoading}
    />
  );
}
