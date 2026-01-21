"use client";

import { useAtom, useAtomValue } from "jotai";
import { useResetAtom } from "jotai/utils";

import { REGISTRY_PAGE_SIZE } from "@/domain/registry/constants/registry-list.constant";
import {
  registryCheckedListAtom,
  registryPageAtom,
} from "@/domain/registry/state/registry-list.atom";
import { ListDeleteButton } from "@/shared/components/button/list-delete-button";
import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";
import { PRIVATE_REGISTRY_EVENTS } from "@/shared/constants/pubsub.constant";
import { SELECTOR } from "@/shared/constants/selector.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";

interface RegistryListFooterProps {
  totalSize: number;
  isLoading: boolean;
}

export function RegistryListFooter({
  totalSize,
  isLoading,
}: RegistryListFooterProps) {
  const [page, setPage] = useAtom(registryPageAtom);
  const resetCheckedList = useResetAtom(registryCheckedListAtom);
  const publish = usePublish();
  const selectedRegistries = useAtomValue(registryCheckedListAtom);

  const handlePage = (page: number) => {
    resetCheckedList();
    setPage(page);
  };

  const handleClickDelete = () => {
    publish(
      PRIVATE_REGISTRY_EVENTS.openDeleteModal,
      Array.from(selectedRegistries),
    );
  };

  return (
    <ListPageFooter
      total={totalSize}
      page={page}
      pageSize={REGISTRY_PAGE_SIZE}
      onChange={handlePage}
      isLoading={isLoading}
      paginationTestId={SELECTOR.LIST_PAGINATION}
      rightChildren={
        <ListDeleteButton
          onClick={handleClickDelete}
          disabled={selectedRegistries.size === 0}
        />
      }
    />
  );
}
