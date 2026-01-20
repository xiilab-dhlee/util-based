"use client";

import { Button } from "xiilab-ui";

import { MySearchFilter } from "@/shared/components/layouts/search-filter";
import { CREDENTIAL_EVENTS } from "@/shared/constants/pubsub.constant";
import { SETTING_SELECTOR } from "@/shared/constants/selector.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";

interface SettingCredentialListFilterProps {
  /** 전체 크리덴셜 수 */
  total: number;
  /** 로딩 상태 */
  loading: boolean;
}

/**
 * 설정 크리덴셜 목록 필터 컴포넌트
 *
 * 크리덴셜 목록의 상단 필터 영역을 표시합니다.
 * (제목, 총 개수, 추가 버튼)
 */
export function SettingCredentialListFilter({
  total,
  loading,
}: SettingCredentialListFilterProps) {
  const publish = usePublish();

  const handleCreateCredential = () => {
    publish(CREDENTIAL_EVENTS.openCreateModal);
  };

  return (
    <MySearchFilter title="크리덴셜 목록" total={total}>
      <Button
        color="primary"
        icon="Plus"
        iconPosition="left"
        variant="gradient"
        width={120}
        height={30}
        onClick={handleCreateCredential}
        disabled={loading}
        data-testid={SETTING_SELECTOR.CREDENTIAL_ADD_BUTTON}
      >
        크리덴셜 추가
      </Button>
    </MySearchFilter>
  );
}
