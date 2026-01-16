"use client";

import classNames from "classnames";
import { useAtom } from "jotai";
import type { HTMLAttributes, MouseEvent } from "react";

import type { ImageTagListResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { privateRegistryTagSelectedAtom } from "@/domain/private-registry/state/private-registry-tag.atom";

interface PrivateRegistryTagRowProps
  extends HTMLAttributes<HTMLTableRowElement> {
  rowData: ImageTagListResponse;
}

/**
 * PrivateRegistryTagRow 컴포넌트
 *
 * 프라이빗 레지스트리 태그 목록 테이블의 행 컴포넌트입니다.
 * 행을 클릭하면 해당 태그가 선택되어 활성 상태로 표시됩니다.
 *
 * @param rowData - 태그 목록 데이터
 * @returns 태그 테이블 행 컴포넌트
 */
export function PrivateRegistryTagRow({
  children,
  rowData,
  className,
  ...restProps
}: PrivateRegistryTagRowProps) {
  const [selectedTag, setSelectedTag] = useAtom(privateRegistryTagSelectedAtom);

  const isActive = selectedTag?.harborArtifactId === rowData?.harborArtifactId;

  const handleClickRow = (evt: MouseEvent) => {
    evt.stopPropagation();

    if (rowData.harborArtifactId !== undefined) {
      setSelectedTag(rowData);
    }
  };

  return (
    <tr
      {...restProps}
      className={classNames("pointer", { active: isActive }, className)}
      onClick={handleClickRow}
    >
      {children}
    </tr>
  );
}
