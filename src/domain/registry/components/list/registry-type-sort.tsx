"use client";

import { useAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { Dropdown } from "xiilab-ui";

import type { GetPrivateRegistryListImageSourceType } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { IMAGE_SOURCE_TYPE_OPTIONS } from "@/domain/registry/constants/registry-list.constant";
import {
  registryCheckedListAtom,
  registryImageSourceTypeAtom,
  registryPageAtom,
} from "@/domain/registry/state/registry-list.atom";
import { ALL_OPTION } from "@/shared/constants/core.constant";
import { REGISTRY_SELECTOR } from "@/shared/constants/selector.constant";

interface RegistryTypeSortProps {
  disabled?: boolean;
}

/**
 * 개인 레지스트리 구분별 정렬 컴포넌트
 *
 * 해당 구분의 개인 레지스트리만 필터링할 수 있는 드롭다운 선택기를 제공합니다.
 *
 * @param disabled - 비활성화 여부
 * @returns 개인 레지스트리 구분 선택 드롭다운 컴포넌트
 */
export function RegistryTypeSort({ disabled }: RegistryTypeSortProps) {
  const [imageSourceType, setImageSourceType] = useAtom(
    registryImageSourceTypeAtom,
  );
  const resetPage = useResetAtom(registryPageAtom);
  const resetCheckedList = useResetAtom(registryCheckedListAtom);

  /**
   * 구분 변경 핸들러
   * 구분 변경 시 페이지와 체크리스트를 초기화
   */
  const handleChange = (value: GetPrivateRegistryListImageSourceType | "") => {
    resetCheckedList();
    resetPage();
    setImageSourceType(value || undefined);
  };

  return (
    <div data-testid={REGISTRY_SELECTOR.FILTER_TYPE}>
      <Dropdown
        options={[ALL_OPTION, ...IMAGE_SOURCE_TYPE_OPTIONS]}
        value={imageSourceType ?? ""}
        onChange={handleChange}
        placeholder="구분"
        width={120}
        height={30}
        disabled={disabled}
      />
    </div>
  );
}
