import { useMemo } from "react";
import type { DropdownProps } from "xiilab-ui";
import { Dropdown } from "xiilab-ui";

import { useGetStorages } from "@/api/generated/admin-storage/admin-storage";

type StorageSelectProps = Omit<DropdownProps, "options" | "loading">;

/**
 * 스토리지 목록 선택 컴포넌트
 *
 * orval에서 생성된 useGetStorages API를 사용하여 스토리지 목록을 조회하고
 * Dropdown 컴포넌트로 표시합니다.
 */
export function StorageSelect(props: StorageSelectProps) {
  const { data, isLoading } = useGetStorages({ pageSize: 100 });

  const options = useMemo(() => {
    if (!data?.content) return [];

    return data.content.map((storage) => ({
      label: storage.storageName,
      value: String(storage.storageId),
    }));
  }, [data?.content]);

  return (
    <Dropdown
      {...props}
      options={options}
      loading={isLoading}
      placeholder={props.placeholder ?? "스토리지를 선택해 주세요."}
    />
  );
}
