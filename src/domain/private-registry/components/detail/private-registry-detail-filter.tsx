"use client";

import { useSetAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { useParams } from "next/navigation";
import { Button, Input } from "xiilab-ui";

import {
  privateRegistryTagCheckedListAtom,
  privateRegistryTagPageAtom,
  privateRegistryTagSearchTextAtom,
} from "@/domain/private-registry/state/private-registry-tag.atom";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";
import { PRIVATE_REGISTRY_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";

interface PrivateRegistryDetailFilterProps {
  totalSize?: number;
  loading: boolean;
}

/**
 * 프라이빗 레지스트리 이미지 태그 목록 필터 컴포넌트
 *
 * 태그 검색을 위한 필터를 제공합니다.
 */
export function PrivateRegistryDetailFilter({
  totalSize,
  loading,
}: PrivateRegistryDetailFilterProps) {
  const { name } = useParams<{ name: string }>();
  const harborImageName = name ? decodeURIComponent(name) : "";

  const setSearchText = useSetAtom(privateRegistryTagSearchTextAtom);
  const resetPage = useResetAtom(privateRegistryTagPageAtom);
  const resetCheckedList = useResetAtom(privateRegistryTagCheckedListAtom);
  const publish = usePublish();

  const handleSearch = (value: string) => {
    resetCheckedList();
    resetPage();
    setSearchText(value.trim());
  };

  const handleCreate = () => {
    publish(PRIVATE_REGISTRY_EVENTS.sendCreateTagData, harborImageName);
  };

  const handleCreateRequestImage = () => {
    alert("준비 중입니다.");
  };

  const handleCreateScan = () => {
    alert("준비 중입니다.");
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
        icon="Request"
        iconPosition="left"
        variant="gradient"
        width={100}
        height={30}
        iconSize={20}
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
        onClick={handleCreate}
      >
        태그 추가
      </Button>
    </MySearchFilter>
  );
}
