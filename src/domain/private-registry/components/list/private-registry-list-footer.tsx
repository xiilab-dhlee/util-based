"use client";

import { useAtom, useAtomValue } from "jotai";
import { useResetAtom } from "jotai/utils";

import {
  privateregistryCheckedListAtom,
  privateregistryPageAtom,
} from "@/domain/private-registry/state/private-registry.atom";
import { ListDeleteButton } from "@/shared/components/button/list-delete-button";
import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { PRIVATE_REGISTRY_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";

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
  const publish = usePublish();
  const selectedRegistries = useAtomValue(privateregistryCheckedListAtom);

  const handlePage = (page: number) => {
    resetCheckedList();
    setPage(page);
  };

  const handleClickDelete = () => {
    publish(
      PRIVATE_REGISTRY_EVENTS.sendDeletePrivateRegistry,
      Array.from(selectedRegistries),
    );
  };

  return (
    <ListPageFooter
      total={totalSize}
      page={page}
      pageSize={LIST_PAGE_SIZE}
      onChange={handlePage}
      isLoading={isLoading}
      rightChildren={
        <ListDeleteButton
          onClick={handleClickDelete}
          disabled={selectedRegistries.size === 0}
          isLoading={isLoading}
        />
      }
    />
  );
}
