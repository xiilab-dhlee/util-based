"use client";

import { useAtom } from "jotai";

import { privateRegistryListAtom } from "@/atoms/private-registry/private-registry-list.atom";
import { MySelect } from "@/components/common/select";
import privateRegistryListConstants from "@/constants/private-registry/private-registry-list.constant";

/**
 * 내부 레지스트리 정렬 드롭다운 컴포넌트
 */
export function PrivateRegistrySortOrder() {
  const [filterState, setFilterState] = useAtom(privateRegistryListAtom);

  /** 정렬 순서 변경 핸들러 */
  const handleChange = (value: string | null) => {
    setFilterState((prev) => ({
      ...prev,
      sortOrder:
        value && value !== ""
          ? (value as "latest" | "oldest" | "name")
          : "latest",
      page: 1, // 정렬 변경 시 첫 페이지로 이동
    }));
  };

  return (
    <MySelect
      options={privateRegistryListConstants.sortOrder}
      placeholder="최신순"
      setValue={handleChange}
      value={filterState.sortOrder || "latest"}
      width={100}
      height={30}
    />
  );
}

