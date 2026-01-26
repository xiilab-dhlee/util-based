"use client";

import classNames from "classnames";
import { useParams, usePathname, useRouter } from "next/navigation";
import type { HTMLAttributes, MouseEvent } from "react";

import type { SourceCodeListResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { ROUTES } from "@/shared/constants/routes.constant";
import { isUserMode } from "@/shared/utils/router.util";

interface SourcecodeRowProps extends HTMLAttributes<HTMLTableRowElement> {
  rowData: SourceCodeListResponse;
}

/**
 * SourcecodeRow 컴포넌트
 *
 * 소스코드 목록 테이블의 행 컴포넌트입니다.
 * 행을 클릭하면 해당 소스코드 상세 페이지로 라우팅됩니다.
 * 현재 선택된 소스코드와 일치하는 행은 활성 상태로 표시됩니다.
 *
 * @param rowData - 소스코드 목록 데이터
 * @returns 소스코드 테이블 행 컴포넌트
 */
export function SourcecodeRow({
  children,
  rowData,
  className,
  ...restProps
}: SourcecodeRowProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams<{ id?: string }>();

  const isUser = isUserMode(pathname);
  const parsedId = params.id ? Number(params.id) : Number.NaN;
  const selectedSourcecodeId = Number.isNaN(parsedId) ? -1 : parsedId;
  const isActive = selectedSourcecodeId === rowData?.sourceCodeId;

  const handleClickRow = (evt: MouseEvent) => {
    evt.stopPropagation();

    if (rowData && !isActive) {
      const detailRoute = isUser
        ? ROUTES.USER_SOURCECODE_DETAIL(rowData.sourceCodeId)
        : ROUTES.ADMIN_SOURCECODE_DETAIL(rowData.sourceCodeId);
      router.push(detailRoute);
    }
  };

  return (
    <tr
      {...restProps}
      className={classNames("pointer", { active: isActive }, className)}
      onClick={handleClickRow}
      data-sourcecode-id={rowData?.sourceCodeId}
      data-selected={isActive}
    >
      {children}
    </tr>
  );
}
