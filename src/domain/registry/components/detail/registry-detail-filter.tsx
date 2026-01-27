"use client";

import { useSetAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { useParams } from "next/navigation";
import { Button, Input } from "xiilab-ui";

import {
  registryTagCheckedListAtom,
  registryTagPageAtom,
  registryTagSearchTextAtom,
} from "@/domain/registry/state/registry-detail.atom";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";
import { REGISTRY_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";

interface RegistryDetailFilterProps {
  totalSize?: number;
  loading: boolean;
}

/**
 * 레지스트리 이미지 태그 목록 필터 컴포넌트
 *
 * 태그 검색을 위한 필터를 제공합니다.
 */
export function RegistryDetailFilter({
  totalSize,
  loading,
}: RegistryDetailFilterProps) {
  const { name } = useParams<{ name: string }>();
  const harborImageName = name ? decodeURIComponent(name) : "";

  const setSearchText = useSetAtom(registryTagSearchTextAtom);
  const resetPage = useResetAtom(registryTagPageAtom);
  const resetCheckedList = useResetAtom(registryTagCheckedListAtom);

  const publish = usePublish();

  const handleSearch = (value: string) => {
    resetCheckedList();
    resetPage();
    setSearchText(value.trim());
  };

  const handleCreate = () => {
    publish(REGISTRY_EVENTS.openCreateTagModal, harborImageName);
  };

  return (
    <MySearchFilter title="태그 목록" total={totalSize}>
      <Input.Search
        name="search"
        placeholder="태그를 입력하세요."
        onSearch={handleSearch}
        autoComplete="off"
        width={220}
        height={30}
        disabled={loading}
      />

      <Button
        color="primary"
        icon="Plus"
        iconPosition="left"
        variant="gradient"
        width={100}
        height={30}
        onClick={handleCreate}
        disabled={loading}
      >
        태그 추가
      </Button>
    </MySearchFilter>
  );
}
