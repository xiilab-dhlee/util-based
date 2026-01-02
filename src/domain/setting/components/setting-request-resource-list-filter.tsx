"use client";

import { Button } from "xiilab-ui";

import { openCreateResourceRequestModalAtom } from "@/domain/setting/state/setting.atom";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";

interface SettingRequestResourceListFilterProps {
  /** 전체 리소스 요청 수 */
  total: number;
  /** 로딩 상태 */
  loading: boolean;
}

/**
 * 설정 리소스 요청 목록 필터 컴포넌트
 *
 * 리소스 요청 목록의 제목과 총 개수, 생성 버튼을 표시합니다.
 */
export function SettingRequestResourceListFilter({
  total,
  loading,
}: SettingRequestResourceListFilterProps) {
  const { onOpen } = useGlobalModal(openCreateResourceRequestModalAtom);

  const handleCreateRequestResource = () => {
    onOpen();
  };

  return (
    <MySearchFilter title="리소스 요청 목록" total={total}>
      <Button
        color="primary"
        icon="RequestResource"
        iconPosition="left"
        variant="gradient"
        width={110}
        height={30}
        onClick={handleCreateRequestResource}
        disabled={loading}
      >
        리소스 요청
      </Button>
    </MySearchFilter>
  );
}
