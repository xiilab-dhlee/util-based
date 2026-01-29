"use client";

import { Dropdown } from "xiilab-ui";

import { REGISTRY_IMAGE_PLACEHOLDER } from "@/domain/workload/constants/registry.constant";
import { useRegistryImageOptions } from "@/domain/workload/hooks/use-registry-image-options";
import { DROPDOWN_LIST_HEIGHT } from "@/shared/constants/core.constant";
import { useDebouncedSearch } from "@/shared/hooks/use-debounced-search";
import { useDropdownInfiniteScroll } from "@/shared/hooks/use-infinite-scroll";

interface RegistryImageDropdownProps {
  registryType: "PRIVATE" | "PUBLIC";
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
}

/**
 * 레지스트리 이미지 선택 드롭다운
 *
 * 무한 스크롤과 검색 기능을 제공하는 재사용 가능한 이미지 선택 컴포넌트
 *
 * @example
 * <RegistryImageDropdown
 *   registryType="PRIVATE"
 *   value={harborImageName}
 *   onChange={setHarborImageName}
 * />
 */
export function RegistryImageDropdown({
  registryType,
  value,
  onChange,
  placeholder = REGISTRY_IMAGE_PLACEHOLDER,
}: RegistryImageDropdownProps) {
  const { keyword, handleSearch, resetKeyword } = useDebouncedSearch();

  const { options, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useRegistryImageOptions({ registryType, keyword });

  const { handlePopupScroll } = useDropdownInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  const handleChange = (v: string | number) => {
    if (typeof v === "string") {
      onChange(v);
      resetKeyword();
    }
  };

  return (
    <Dropdown
      placeholder={placeholder}
      options={options}
      value={value}
      onChange={handleChange}
      width="100%"
      showSearch
      filterOption={false}
      onSearch={handleSearch}
      onPopupScroll={handlePopupScroll}
      loading={isLoading || isFetchingNextPage}
      listHeight={DROPDOWN_LIST_HEIGHT}
    />
  );
}
