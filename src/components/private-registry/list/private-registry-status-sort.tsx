"use client";

import { useAtom } from "jotai";

import { privateRegistryListAtom } from "@/atoms/private-registry/private-registry-list.atom";
import { MySelect } from "@/components/common/select";
import privateRegistryListConstants from "@/constants/private-registry/private-registry-list.constant";

/**
 * 내부 레지스트리 상태 필터 드롭다운 컴포넌트
 */
export function PrivateRegistryStatusSort() {
  const [filterState, setFilterState] = useAtom(privateRegistryListAtom);

  /** 상태 변경 핸들러 */
  const handleChange = (value: string | null) => {
    setFilterState((prev) => ({
      ...prev,
      status:
        value && value !== "" ? (value as "RUNNING" | "SUCCESSED") : undefined,
      page: 1, // 필터 변경 시 첫 페이지로 이동
    }));
  };

  return (
    <MySelect
      options={privateRegistryListConstants.status}
      placeholder="상태"
      setValue={handleChange}
      value={filterState.status || ""}
      width={100}
      height={30}
    />
  );
}

