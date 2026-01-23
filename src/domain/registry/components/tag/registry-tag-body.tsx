"use client";

import { createVulnerabilityColumn } from "@/shared/components/column/create-vulnerability-column";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";

interface RegistryTagBodyProps {
  // TODO: 취약점 목록 API 연동 시 타입 변경 필요
  data: unknown[];
  isLoading: boolean;
  isError: boolean;
}

/**
 * 개인 레지스트리 태그 취약점 목록 페이지 본문 컴포넌트
 *
 * 개인 레지스트리 태그 취약점 목록 페이지에서 개인 레지스트리 태그 취약점 목록을 표시하는 테이블을 제공합니다.
 *
 * @returns 개인 레지스트리 태그 취약점 목록 페이지 본문 컴포넌트
 */
export function RegistryTagBody({
  data,
  isLoading,
  isError,
}: RegistryTagBodyProps) {
  return (
    <ListWrapper>
      <CustomizedTable
        columns={createVulnerabilityColumn()}
        data={data}
        columnHeight={38}
        activePadding
        loading={isLoading}
        isError={isError}
      />
    </ListWrapper>
  );
}
