"use client";

import type { CredentialListType } from "@/domain/credential/schemas/credential.schema";
import { ListEmpty } from "@/shared/components/layouts/list-empty";
import { MySpinner } from "@/shared/components/spinner";
import { GridList, ListWrapper } from "@/styles/layers/list-page-layers.styled";
import { SettingCredentialCard } from "./setting-credential-card";

interface SettingCredentialListBodyProps {
  /** 크리덴셜 목록 데이터 */
  content: CredentialListType[];
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
        <ListEmpty
          title="오류가 발생했습니다."
          message="잠시 후 다시 시도해 주세요."
        />
      </ListWrapper>
    );
  }

  // 3. 빈 목록 상태
  if (content.length === 0) {
    return (
      <ListWrapper>
        <ListEmpty
          title="크리덴셜이 없습니다."
          message="크리덴셜을 생성하여 사용해보세요."
        />
      </ListWrapper>
    );
  }

  // 4. 데이터 표시
  return (
    <ListWrapper>
      <GridList>
        {content.map((credential) => (
          <SettingCredentialCard key={credential.id} {...credential} />
        ))}
      </GridList>
    </ListWrapper>
  );
}
