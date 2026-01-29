"use client";

import { Dropdown } from "xiilab-ui";

import {
  IMAGE_TAG_DISABLED_PLACEHOLDER,
  IMAGE_TAG_PLACEHOLDER,
} from "@/domain/workload/constants/registry.constant";
import { useImageTagOptions } from "@/domain/workload/hooks/use-image-tag-options";
import { DROPDOWN_LIST_HEIGHT } from "@/shared/constants/core.constant";
import { useDebouncedSearch } from "@/shared/hooks/use-debounced-search";
import { useDropdownInfiniteScroll } from "@/shared/hooks/use-infinite-scroll";

interface RegistryImageTagDropdownProps {
  registryType: "PRIVATE" | "PUBLIC";
  harborImageName: string | null;
  value: string | null;
  onChange: (value: string | null) => void;
  disabled?: boolean;
}

/**
 * 레지스트리 이미지 태그 선택 드롭다운
 *
 * Cascade 의존성을 가지며, harborImageName이 선택되어야 활성화됩니다.
 * 무한 스크롤과 검색 기능을 제공합니다.
 *
 * @example
 * <RegistryImageTagDropdown
 *   registryType="PRIVATE"
 *   harborImageName={harborImageName}
 *   value={imageTagName}
 *   onChange={setImageTagName}
 * />
 */
export function RegistryImageTagDropdown({
  registryType,
  harborImageName,
  value,
  onChange,
  disabled = false,
}: RegistryImageTagDropdownProps) {
  const { keyword, handleSearch, resetKeyword } = useDebouncedSearch();

  const { options, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useImageTagOptions({ registryType, harborImageName, keyword });

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

  // Cascade 로직: 이미지가 선택되지 않았으면 비활성화
  const isDisabled = disabled || !harborImageName;
  const placeholder = isDisabled
    ? IMAGE_TAG_DISABLED_PLACEHOLDER
    : IMAGE_TAG_PLACEHOLDER;

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
      disabled={isDisabled}
      listHeight={DROPDOWN_LIST_HEIGHT}
    />
  );
}
