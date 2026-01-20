"use client";

import { useAtom, useAtomValue } from "jotai";
import { useResetAtom } from "jotai/utils";

import { PRIVATE_REGISTRY_TAG_PAGE_SIZE } from "@/domain/private-registry/constants/private-registry-tag.constant";
import {
  privateRegistryTagCheckedListAtom,
  privateRegistryTagPageAtom,
} from "@/domain/private-registry/state/private-registry-tag.atom";
import { ListDeleteButton } from "@/shared/components/button/list-delete-button";
import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";
import { PRIVATE_REGISTRY_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";

interface PrivateRegistryDetailFooterProps {
  totalSize: number;
  isLoading: boolean;
}

/**
 * 프라이빗 레지스트리 이미지 태그 목록 페이지네이션 컴포넌트
 *
 * 페이지네이션과 삭제 버튼을 제공합니다.
 */
export function PrivateRegistryDetailFooter({
  totalSize,
  isLoading,
}: PrivateRegistryDetailFooterProps) {
  const publish = usePublish();
  const [page, setPage] = useAtom(privateRegistryTagPageAtom);
  const resetCheckedList = useResetAtom(privateRegistryTagCheckedListAtom);
  const checkedList = useAtomValue(privateRegistryTagCheckedListAtom);

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
      pageSize={PRIVATE_REGISTRY_TAG_PAGE_SIZE}
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
