"use client";

import { useAtom, useAtomValue } from "jotai";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";

import { useGetInternalRegistryImageTags } from "@/domain/internal-registry-image/hooks/use-get-internal-registry-image-tags";
import {
  internalregistryImageTagCheckedListAtom,
  internalregistryImageTagPageAtom,
  internalregistryImageTagSearchTextAtom,
} from "@/domain/internal-registry-image/state/internal-registry-image.atom";
import { ListDeleteButton } from "@/shared/components/button/list-delete-button";
import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { INTERNAL_REGISTRY_IMAGE_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";

/**
 * 내부 레지스트리 이미지 태그 목록 페이지네이션 컴포넌트
 *
 * 페이지네이션과 삭제 버튼을 제공합니다.
 */
export function InternalRegistryImageTagListFooter() {
  const { id } = useParams();

  const publish = usePublish();
  // 페이지 번호
  const [page, setPage] = useAtom(internalregistryImageTagPageAtom);
  // 검색어
  const searchText = useAtomValue(internalregistryImageTagSearchTextAtom);
  // 체크된 태그 목록
  const checkedList = useAtomValue(internalregistryImageTagCheckedListAtom);

  const { data, isLoading } = useGetInternalRegistryImageTags({
    page,
    size: LIST_PAGE_SIZE,
    searchText,
    imageId: Number(id),
  });

  const handleDelete = () => {
    if (checkedList.size === 0) {
      toast.error("삭제할 태그를 선택해주세요.");
      return;
    }
    publish(
      INTERNAL_REGISTRY_IMAGE_EVENTS.sendDeleteImageTag,
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
