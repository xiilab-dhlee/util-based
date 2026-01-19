"use client";

import type { CredentialListItemResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { EmptyState } from "@/shared/components/empty-state/empty-state";
import { MySpinner } from "@/shared/components/spinner";
import { TABLE_MESSAGE } from "@/shared/constants/core.constant";
import { GridList, ListWrapper } from "@/styles/layers/list-page-layers.styled";
import { CredentialCard } from "./credential-card";

interface SettingCredentialListBodyProps {
  /** 크리덴셜 목록 데이터 */
  content: CredentialListItemResponse[];
  /** 로딩 상태 */
  loading: boolean;
  /** 에러 상태 */
  isError: boolean;
}

/**
 * 설정 크리덴셜 목록 본문 컴포넌트
 *
 * 크리덴셜 목록의 카드 그리드를 표시합니다.
 *
 * 상태 우선순위: loading > error > empty > content
 * - 각 상태는 상호 배타적으로 하나만 렌더링됩니다.
 */
export function SettingCredentialListBody({
  content,
  loading,
  isError,
}: SettingCredentialListBodyProps) {
  // 1. 로딩 상태
  if (loading) {
    return (
      <ListWrapper>
        <MySpinner />
      </ListWrapper>
    );
  }

  // 2. 에러 상태
  if (isError) {
    return (
      <ListWrapper>
        <EmptyState title={TABLE_MESSAGE.ERROR} />
      </ListWrapper>
    );
  }

  // 3. 빈 목록 상태
  if (content.length === 0) {
    return (
      <ListWrapper>
        <EmptyState />
      </ListWrapper>
    );
  }

  // 4. 데이터 표시
  return (
    <ListWrapper>
      <GridList>
        {content.map((credential) => (
          <CredentialCard key={credential.credentialId} {...credential} />
        ))}
      </GridList>
    </ListWrapper>
  );
}
