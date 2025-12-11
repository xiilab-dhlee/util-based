"use client";

import classNames from "classnames";
import type { HTMLAttributes, MouseEvent } from "react";

import type { CredentialListType } from "@/domain/credential/schemas/credential.schema";
import { SYSTEM_SETTING_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";

interface CredentialRowProps extends HTMLAttributes<HTMLTableRowElement> {
  rowData: CredentialListType;
}

/**
 * CredentialRow 컴포넌트
 *
 * 크레덴셜 목록 테이블의 행 컴포넌트입니다.
 * 행을 클릭하면 크레덴셜 상세 모달이 열립니다.
 *
 * @param rowData - 크레덴셜 목록 데이터
 * @returns 크레덴셜 테이블 행 컴포넌트
 */
export function CredentialRow({
  children,
  rowData,
  className,
  ...restProps
}: CredentialRowProps) {
  const publish = usePublish();

  const handleClickRow = (evt: MouseEvent) => {
    evt.stopPropagation();

    publish(SYSTEM_SETTING_EVENTS.openCredentialDetailModal, rowData.id);
  };

  return (
    <tr
      {...restProps}
      className={classNames("pointer", className)}
      onClick={handleClickRow}
    >
      {children}
    </tr>
  );
}
