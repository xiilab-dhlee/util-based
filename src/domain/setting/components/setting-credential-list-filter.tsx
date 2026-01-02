"use client";

import { Button } from "xiilab-ui";

import { MySearchFilter } from "@/shared/components/layouts/search-filter";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { openCreateCredentialModalAtom } from "@/shared/state/modal.atom";

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
  const { onOpen } = useGlobalModal(openCreateCredentialModalAtom);

  const handleCreateCredential = () => {
    onOpen();
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
      >
        크리덴셜 추가
      </Button>
    </MySearchFilter>
  );
}
