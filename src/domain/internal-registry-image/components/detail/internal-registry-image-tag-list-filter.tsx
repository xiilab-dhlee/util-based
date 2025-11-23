"use client";

import { Button } from "xiilab-ui";

import {
  internalregistryImageTagSearchTextAtom,
  openCreateInternalRegistryImageTagModalAtom,
} from "@/domain/internal-registry-image/state/internal-registry-image.atom";
import { SearchInput } from "@/shared/components/input/search-input";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSearch } from "@/shared/hooks/use-search";

/**
 * 내부 레지스트리 이미지 태그 목록 필터 컴포넌트
 *
 * 태그 검색을 위한 필터를 제공합니다.
 */
export function InternalRegistryImageTagListFilter() {
  const { onOpen } = useGlobalModal(
    openCreateInternalRegistryImageTagModalAtom,
  );

  const { onSubmit } = useSearch(internalregistryImageTagSearchTextAtom);

  const handleCreateTag = () => {
    onOpen();
  };

  const handleCreateRequestImage = () => {
    alert("준비 중입니다.");
  };

  const handleCreateScan = () => {
    alert("준비 중입니다.");
  };

  return (
    <MySearchFilter title="태그 목록" total={0}>
      <form onSubmit={onSubmit}>
        <SearchInput />
      </form>
      <Button
        color="primary"
        icon="Request"
        iconPosition="left"
        variant="gradient"
        width={100}
        height={30}
        onClick={handleCreateRequestImage}
      >
        사용 요청
      </Button>
      <Button
        color="primary"
        icon="Verification01"
        iconPosition="left"
        variant="gradient"
        width={100}
        height={30}
        onClick={handleCreateScan}
      >
        검증하기
      </Button>
      <Button
        color="primary"
        icon="Plus"
        iconPosition="left"
        variant="gradient"
        width={100}
        height={30}
        onClick={handleCreateTag}
      >
        태그 추가
      </Button>
    </MySearchFilter>
  );
}
