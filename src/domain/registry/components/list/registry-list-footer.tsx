"use client";

import { useAtom, useAtomValue } from "jotai";
import { useResetAtom } from "jotai/utils";
import { useSession } from "next-auth/react";

import { REGISTRY_PAGE_SIZE } from "@/domain/registry/constants/registry-list.constant";
import {
  registryCheckedListAtom,
  registryPageAtom,
} from "@/domain/registry/state/registry-list.atom";
import type { RegistryMode } from "@/domain/registry/types/registry.type";
import { ListDeleteButton } from "@/shared/components/button/list-delete-button";
import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";
import { REGISTRY_EVENTS } from "@/shared/constants/pubsub.constant";
import { SELECTOR } from "@/shared/constants/selector.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import { checkIsSuperAdmin } from "@/shared/utils/auth.util";

interface RegistryListFooterProps {
  totalSize: number;
  isLoading: boolean;
  mode: RegistryMode;
}

export function RegistryListFooter({
  totalSize,
  isLoading,
  mode,
}: RegistryListFooterProps) {
  const { data: session } = useSession();
  const [page, setPage] = useAtom(registryPageAtom);
  const resetCheckedList = useResetAtom(registryCheckedListAtom);
  const publish = usePublish();
  const selectedRegistries = useAtomValue(registryCheckedListAtom);

  const isSuperAdmin = checkIsSuperAdmin(session);
  // public 모드에서는 관리자만 삭제 가능
  const canDelete = mode === "private" || isSuperAdmin;

  const handlePage = (page: number) => {
    resetCheckedList();
    setPage(page);
  };

  const handleClickDelete = () => {
    publish(REGISTRY_EVENTS.openDeleteModal, Array.from(selectedRegistries));
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
        canDelete ? (
          <ListDeleteButton
            onClick={handleClickDelete}
            disabled={selectedRegistries.size === 0}
          />
        ) : null
      }
    />
  );
}
