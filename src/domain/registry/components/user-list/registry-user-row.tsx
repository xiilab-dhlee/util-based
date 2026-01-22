"use client";

import classNames from "classnames";
import { useAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import type { HTMLAttributes, MouseEvent } from "react";

import type { PrivateImageUsageResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  registryUserSelectedAccountIdAtom,
  registryUserTagPageAtom,
} from "@/domain/registry/state/registry-user-list.atom";

interface RegistryUserRowProps extends HTMLAttributes<HTMLTableRowElement> {
  rowData: PrivateImageUsageResponse;
}

/**
 * RegistryUserRow 컴포넌트
 *
 * 사용자별 이미지 등록 현황 테이블의 행 컴포넌트입니다.
 * 행을 클릭하면 해당 사용자가 선택되어 활성 상태로 표시됩니다.
 *
 * @param rowData - 사용자별 이미지 등록 현황 데이터
 * @returns 사용자 테이블 행 컴포넌트
 */
export function RegistryUserRow({
  children,
  rowData,
  className,
  ...restProps
}: RegistryUserRowProps) {
  const [selectedAccountId, setSelectedAccountId] = useAtom(
    registryUserSelectedAccountIdAtom,
  );
  const resetTagPage = useResetAtom(registryUserTagPageAtom);

  const isActive = selectedAccountId === rowData?.accountId;

  const handleClickRow = (evt: MouseEvent) => {
    evt.stopPropagation();

    if (rowData?.accountId !== undefined) {
      setSelectedAccountId(rowData.accountId);
      // 태그 목록 페이지 초기화
      resetTagPage();
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
