"use client";

import { useAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { Dropdown } from "xiilab-ui";

import type { RegistryImageFilterRequestImageSourceType } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { IMAGE_SOURCE_TYPE_OPTIONS } from "@/domain/private-registry/constants/private-registry.constant";
import {
  imageJobImageSourceTypeAtom,
  imageJobPageAtom,
} from "@/domain/private-registry/state/private-registry.atom";
import { ALL_OPTION } from "@/shared/constants/core.constant";
import { PRIVATE_REGISTRY_SELECTOR } from "@/shared/constants/selector.constant";

interface PrivateRegistryJobTypeSortProps {
  disabled?: boolean;
}

/**
 * 등록 중인 이미지 구분별 정렬 컴포넌트
 *
 * 해당 구분의 등록 중인 이미지만 필터링할 수 있는 드롭다운 선택기를 제공합니다.
 *
 * @param disabled - 비활성화 여부
 * @returns 등록 중인 이미지 구분 선택 드롭다운 컴포넌트
 */
export function PrivateRegistryJobTypeSort({
  disabled,
}: PrivateRegistryJobTypeSortProps) {
  const [imageSourceType, setImageSourceType] = useAtom(
    imageJobImageSourceTypeAtom,
  );
  const resetPage = useResetAtom(imageJobPageAtom);

  /**
   * 구분 변경 핸들러
   * 구분 변경 시 페이지를 초기화
   */
  const handleChange = (
    value: RegistryImageFilterRequestImageSourceType | "",
  ) => {
    resetPage();
    setImageSourceType(value || undefined);
  };

  return (
    <div data-testid={PRIVATE_REGISTRY_SELECTOR.JOB_LIST_FILTER_TYPE}>
      <Dropdown
        options={[ALL_OPTION, ...IMAGE_SOURCE_TYPE_OPTIONS]}
        value={imageSourceType ?? ""}
        onChange={handleChange}
        placeholder="구분"
        width={100}
        height={30}
        disabled={disabled}
      />
    </div>
  );
}
