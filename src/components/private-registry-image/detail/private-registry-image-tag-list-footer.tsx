"use client";

import { useAtom, useAtomValue } from "jotai";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";

import {
  privateRegistryImageTagCheckedListAtom,
  privateRegistryImageTagPageAtom,
  privateRegistryImageTagSearchTextAtom,
} from "@/atoms/private-registry-image/private-registry-image.atom";
import { ListDeleteButton } from "@/components/common/buttons/list-delete-button";
import { LIST_PAGE_SIZE } from "@/constants/common/core.constant";
import { PRIVATE_REGISTRY_IMAGE_EVENTS } from "@/constants/common/pubsub.constant";
import { usePublish } from "@/hooks/common/use-pub-sub";
import { useGetPrivateRegistryImageTags } from "@/hooks/private-registry-image/use-get-private-registry-image-tags";
import { ListPageFooter } from "@/layouts/list/list-page-footer";

/**
 * 내부 레지스트리 이미지 태그 목록 페이지네이션 컴포넌트
 *
 * 페이지네이션과 삭제 버튼을 제공합니다.
 */
export function PrivateRegistryImageTagListFooter() {
  const { id } = useParams();

  const publish = usePublish();
  // 페이지 번호
  const [page, setPage] = useAtom(privateRegistryImageTagPageAtom);
  // 검색어
  const searchText = useAtomValue(privateRegistryImageTagSearchTextAtom);
  // 체크된 태그 목록
  const checkedList = useAtomValue(privateRegistryImageTagCheckedListAtom);

  const { data, isLoading } = useGetPrivateRegistryImageTags({
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
      PRIVATE_REGISTRY_IMAGE_EVENTS.sendDeleteImageTag,
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
