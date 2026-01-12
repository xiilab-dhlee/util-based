"use client";

import { useAtom, useAtomValue } from "jotai";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";

import { useGetPrivateImageTagList } from "@/api/generated/private-registry/private-registry";
import {
  privateregistryImageTagCheckedListAtom,
  privateregistryImageTagPageAtom,
  privateregistryImageTagSearchTextAtom,
} from "@/domain/private-registry/state/private-registry.atom";
import { ListDeleteButton } from "@/shared/components/button/list-delete-button";
import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { PRIVATE_REGISTRY_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";

/**
 * 프라이빗 레지스트리 이미지 태그 목록 페이지네이션 컴포넌트
 *
 * 페이지네이션과 삭제 버튼을 제공합니다.
 */
export function PrivateRegistryTagListFooter() {
  const { id } = useParams();

  const publish = usePublish();
  // 페이지 번호
  const [page, setPage] = useAtom(privateregistryImageTagPageAtom);
  // 검색어
  const searchText = useAtomValue(privateregistryImageTagSearchTextAtom);
  // 체크된 태그 목록
  const checkedList = useAtomValue(privateregistryImageTagCheckedListAtom);

  const { data, isLoading } = useGetPrivateImageTagList({
    pageNo: page - 1,
    pageSize: LIST_PAGE_SIZE,
    keyword: searchText,
    harborImageName: decodeURIComponent(id as string),
  });

  const handleDelete = () => {
    if (checkedList.size === 0) {
      toast.error("삭제할 태그를 선택해주세요.");
      return;
    }
    publish(
      PRIVATE_REGISTRY_EVENTS.sendDeleteImageTag,
      Array.from(checkedList),
    );
  };

  const handlePage = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <ListPageFooter
      total={data?.totalSize || 0}
      page={page}
      pageSize={LIST_PAGE_SIZE}
      onChange={handlePage}
      isLoading={isLoading}
      rightChildren={<ListDeleteButton onClick={handleDelete} />}
    />
  );
}
