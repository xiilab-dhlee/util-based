"use client";

import { EmptyState } from "@/shared/components/empty-state/empty-state";
import {
  AsideDetailContainer,
  AsideDetailEmpty,
} from "@/styles/layers/aside-detail-layers.styled";

/**
 * 관리자 자원 프리셋 페이지
 * 목록에서 선택되지 않은 상태의 기본 화면
 */
export default function AdminResourcePresetPage() {
  return (
    <AsideDetailContainer>
      <AsideDetailEmpty>
        <EmptyState
          title="선택된 자원 프리셋이 없습니다"
          content="좌측 목록에서 자원 프리셋을 선택해주세요."
        />
      </AsideDetailEmpty>
    </AsideDetailContainer>
  );
}
