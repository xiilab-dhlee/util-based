"use client";

import { useMemo } from "react";

import { MySelect } from "@/components/common/select";
import { useGetAllStorages } from "@/hooks/storage/use-get-storages";
import type { CoreSetState } from "@/types/common/core.interface";

/**
 * 스토리지 선택 컴포넌트의 Props 인터페이스
 */
interface StorageSelectProps {
  /** 선택된 스토리지 ID */
  value: string | null;
  /** 스토리지 선택 변경 핸들러 */
  setValue: CoreSetState<string | null>;
}

/**
 * 스토리지 선택 컴포넌트
 *
 * 스토리지 목록을 가져와서 선택할 수 있는 드롭다운 컴포넌트입니다.
 * 내부적으로 useGetAllStorages 훅을 사용하여 스토리지 데이터를 가져옵니다.
 *
 * @param value - 선택된 스토리지 ID
 * @param setValue - 스토리지 선택 변경 핸들러
 * @returns 스토리지 선택 컴포넌트 JSX
 */
export function StorageSelect({ value, setValue }: StorageSelectProps) {
  // 스토리지 목록 조회
  const { data } = useGetAllStorages();

  // 스토리지 옵션 변환
  const storageOptions = useMemo(() => {
    if (!data?.storages) return [];

    return data.storages.map((storage) => ({
      label: storage.storageName,
      value: storage.storageId.toString(),
    }));
  }, [data?.storages]);

  return (
    <MySelect
      options={storageOptions}
      setValue={setValue}
      value={value}
      width="100%"
      placeholder="스토리지를 선택해 주세요."
    />
  );
}

