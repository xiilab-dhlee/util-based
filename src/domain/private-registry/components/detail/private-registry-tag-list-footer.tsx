"use client";

import { useAtom, useAtomValue } from "jotai";
import { useResetAtom } from "jotai/utils";

import {
  privateregistryImageTagCheckedListAtom,
  privateregistryImageTagPageAtom,
} from "@/domain/private-registry/state/private-registry.atom";
import { ListDeleteButton } from "@/shared/components/button/list-delete-button";
import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";
import { PRIVATE_REGISTRY_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";

interface PrivateRegistryTagListFooterProps {
  totalSize: number;
  isLoading: boolean;
}

const PAGE_SIZE = 20;

/**
 * 프라이빗 레지스트리 이미지 태그 목록 페이지네이션 컴포넌트
 *
 * 페이지네이션과 삭제 버튼을 제공합니다.
 */
export function PrivateRegistryTagListFooter({
  totalSize,
  isLoading,
}: PrivateRegistryTagListFooterProps) {
  const publish = usePublish();
  const [page, setPage] = useAtom(privateregistryImageTagPageAtom);
  const resetCheckedList = useResetAtom(privateregistryImageTagCheckedListAtom);
  const checkedList = useAtomValue(privateregistryImageTagCheckedListAtom);

  const handlePage = (newPage: number) => {
    resetCheckedList();
    setPage(newPage);
  };

  const handleClickDelete = () => {
    publish(
      PRIVATE_REGISTRY_EVENTS.sendDeleteImageTag,
      Array.from(checkedList),
    );
  };

  return (
    <ListPageFooter
      total={totalSize}
      page={page}
      pageSize={PAGE_SIZE}
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
