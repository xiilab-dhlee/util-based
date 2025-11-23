"use client";

import { useAtom, useAtomValue } from "jotai";
import { toast } from "react-toastify";

import { useGetInternalRegistryImages } from "@/domain/internal-registry-image/hooks/use-get-internal-registry-images";
import {
  internalregistryImageCheckedListAtom,
  internalregistryImagePageAtom,
  internalregistryImageSearchTextAtom,
} from "@/domain/internal-registry-image/state/internal-registry-image.atom";
import { ListDeleteButton } from "@/shared/components/button/list-delete-button";
import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { INTERNAL_REGISTRY_IMAGE_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";

/**
 * 내부 레지스트리 이미지 목록 페이지 하단 푸터 컴포넌트
 *
 * 내부 레지스트리 이미지 목록 페이지에서 페이지 번호 및 검색어를 관리하고,
 * 총 내부 레지스트리 이미지 수를 표시하는 푸터 컴포넌트입니다.
 *
 * @returns 내부 레지스트리 이미지 목록 페이지 하단 푸터 컴포넌트
 */
export function InternalRegistryImageListFooter() {
  const publish = usePublish();
  // 페이지 번호
  const [page, setPage] = useAtom(internalregistryImagePageAtom);
  // 검색어
  const searchText = useAtomValue(internalregistryImageSearchTextAtom);
  // 체크된 이미지 목록
  const checkedList = useAtomValue(internalregistryImageCheckedListAtom);

  // ✅ 반응형: 데이터 변경 시 자동으로 업데이트
  const { data, isLoading } = useGetInternalRegistryImages({
    page,
    size: LIST_PAGE_SIZE,
    searchText,
  });

  // 페이지 변경 핸들러
  const handlePage = (page: number) => {
    setPage(page);
  };

  const handleDelete = () => {
    if (checkedList.size === 0) {
      toast.error("삭제할 컨테이너 이미지를 선택해 주세요.");
      return;
    }

    publish(
      INTERNAL_REGISTRY_IMAGE_EVENTS.sendDeleteImage,
      Array.from(checkedList),
    );
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
