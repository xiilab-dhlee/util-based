"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { isString } from "es-toolkit";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useCallback, useEffect } from "react";
import { Dropdown } from "xiilab-ui";

import { GetBuiltInImageListFrameworkType } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { getBuiltInImageList } from "@/api/generated/built-in-registry/built-in-registry";
import {
  distributedTypeAtom,
  harborImageNameAtom,
  imageTagNameAtom,
  isDistributedLearningAtom,
} from "@/domain/workload/state/create-workload.atom";
import { DROPDOWN_LIST_HEIGHT } from "@/shared/constants/core.constant";
import { useDropdownInfiniteScroll } from "@/shared/hooks/use-infinite-scroll";

const BUILT_IN_IMAGE_SELECT_QUERY_KEY = "built-in-image-select";
const PAGE_SIZE = 30;

type BuiltInImageOption = {
  label: string;
  value: string;
  harborImageName: string;
  tagName: string;
};

const FRAMEWORK_TYPES = Object.values(GetBuiltInImageListFrameworkType).filter(
  (value): value is GetBuiltInImageListFrameworkType => isString(value),
);

const isFrameworkType = (
  value: string | null,
): value is GetBuiltInImageListFrameworkType =>
  value !== null && FRAMEWORK_TYPES.some((type) => type === value);

function useBuiltInImageOptions(
  frameworkType?: GetBuiltInImageListFrameworkType,
) {
  const query = useInfiniteQuery<
    Awaited<ReturnType<typeof getBuiltInImageList>>,
    Error,
    BuiltInImageOption[]
  >({
    queryKey: [BUILT_IN_IMAGE_SELECT_QUERY_KEY, PAGE_SIZE, frameworkType],
    queryFn: ({ pageParam, signal }) => {
      const pageNo = pageParam as number;
      return getBuiltInImageList(
        {
          frameworkType,
          pageNo,
          pageSize: PAGE_SIZE,
        },
        signal,
      );
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage) return undefined;
      const { currentPageNo, totalPageNum } = lastPage;
      return currentPageNo < totalPageNum - 1 ? currentPageNo + 1 : undefined;
    },
    initialPageParam: 0,
    staleTime: 0,
    select: (data) =>
      data.pages.flatMap(
        (page) =>
          page.content?.map((item) => ({
            label: `${item.imageDisplayName}:${item.imageTagId}`,
            value: String(item.imageTagId),
            harborImageName: item.harborImageName,
            tagName: item.tagName,
          })) ?? [],
      ),
  });

  return {
    options: query.data ?? [],
    isLoading: query.isLoading,
    hasNextPage: query.hasNextPage ?? false,
    isFetchingNextPage: query.isFetchingNextPage,
    fetchNextPage: query.fetchNextPage,
  };
}

interface CreateWorkloadBuiltInImageSelectProps {
  onHarborImageNameChange: (value: string) => void;
  onImageTagNameChange: (value: string) => void;
}

export function CreateWorkloadBuiltInImageSelect({
  onHarborImageNameChange,
  onImageTagNameChange,
}: CreateWorkloadBuiltInImageSelectProps) {
  const [harborImageName, setHarborImageName] = useAtom(harborImageNameAtom);
  const distributedType = useAtomValue(distributedTypeAtom);
  const isDistributedLearning = useAtomValue(isDistributedLearningAtom);
  const imageTagName = useAtomValue(imageTagNameAtom);
  const setImageTagName = useSetAtom(imageTagNameAtom);
  const frameworkType =
    isDistributedLearning && isFrameworkType(distributedType)
      ? distributedType
      : undefined;
  const { options, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useBuiltInImageOptions(frameworkType);
  const { handlePopupScroll } = useDropdownInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  const selectedValue =
    options.find(
      (item) =>
        item.harborImageName === harborImageName &&
        item.tagName === imageTagName,
    )?.value ?? null;
  const hasPersistedSelection = harborImageName !== "" || imageTagName !== "";
  const isSelectionMissingInOptions = hasPersistedSelection && !selectedValue;

  const resetSelection = useCallback(() => {
    onHarborImageNameChange("");
    onImageTagNameChange("");
    setHarborImageName("");
    setImageTagName("");
  }, [
    onHarborImageNameChange,
    onImageTagNameChange,
    setHarborImageName,
    setImageTagName,
  ]);

  useEffect(() => {
    if (!isLoading && !hasNextPage && isSelectionMissingInOptions) {
      resetSelection();
    }
  }, [isLoading, hasNextPage, isSelectionMissingInOptions, resetSelection]);

  const handleChangeImage = (value: string | null) => {
    if (!value) {
      resetSelection();
      return;
    }

    const selectedImage = options.find((item) => item.value === value);
    if (!selectedImage) {
      resetSelection();
      return;
    }

    const { harborImageName: nextHarborImageName, tagName: nextImageTagName } =
      selectedImage;

    onHarborImageNameChange(nextHarborImageName);
    onImageTagNameChange(nextImageTagName);
    setHarborImageName(nextHarborImageName);
    setImageTagName(nextImageTagName);
  };

  return (
    <Dropdown
      placeholder="빌트인 이미지를 선택해 주세요."
      options={options}
      value={selectedValue}
      onChange={handleChangeImage}
      width="100%"
      onPopupScroll={handlePopupScroll}
      loading={isLoading || isFetchingNextPage}
      listHeight={DROPDOWN_LIST_HEIGHT}
    />
  );
}
