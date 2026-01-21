"use client";

import { useAtom, useAtomValue } from "jotai";
import { useResetAtom } from "jotai/utils";

import { REGISTRY_TAG_PAGE_SIZE } from "@/domain/registry/constants/registry-detail.constant";
import {
  registryTagCheckedListAtom,
  registryTagPageAtom,
} from "@/domain/registry/state/registry-detail.atom";
import { ListDeleteButton } from "@/shared/components/button/list-delete-button";
import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";
import { PRIVATE_REGISTRY_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";

interface RegistryDetailFooterProps {
  totalSize: number;
  isLoading: boolean;
}

/**
 * 레지스트리 이미지 태그 목록 페이지네이션 컴포넌트
 *
 * 페이지네이션과 삭제 버튼을 제공합니다.
 */
export function RegistryDetailFooter({
  totalSize,
  isLoading,
}: RegistryDetailFooterProps) {
  const publish = usePublish();
  const [page, setPage] = useAtom(registryTagPageAtom);
  const resetCheckedList = useResetAtom(registryTagCheckedListAtom);
  const checkedList = useAtomValue(registryTagCheckedListAtom);

  const handlePage = (newPage: number) => {
    resetCheckedList();
    setPage(newPage);
  };

  const handleClickDelete = () => {
    publish(
      PRIVATE_REGISTRY_EVENTS.openDeleteTagModal,
      Array.from(checkedList).map((id) => Number(id)),
    );
  };

  return (
    <ListPageFooter
      total={totalSize}
      page={page}
      pageSize={REGISTRY_TAG_PAGE_SIZE}
      onChange={handlePage}
      isLoading={isLoading}
      rightChildren={
        <ListDeleteButton
          onClick={handleClickDelete}
          disabled={checkedList.size === 0}
          isLoading={isLoading}
        />
      }
    />
  );
}
