"use client";

import type { RegistryImageFilterRequestImageSourceType } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { SelectOptionCard } from "@/shared/components/card/select-option-card";

// =============================================================================
// Types
// =============================================================================

interface RegistryTypeCardProps {
  type: RegistryImageFilterRequestImageSourceType;
  onClick: (type: string) => void;
}

// =============================================================================
// Constants
// =============================================================================

const CARD_DATA: Record<
  RegistryImageFilterRequestImageSourceType,
  {
    from: string;
    title: string;
    description: string;
  }
> = {
  SNAPSHOT: {
    from: "Workload",
    title: "Snapshot",
    description: "워크로드의 현재 상태를 스냅샷으로 저장합니다.",
  },
  EXTERNAL: {
    from: "External",
    title: "External",
    description: "외부 레지스트리에서 이미지를 가져와 등록합니다.",
  },
};

// =============================================================================
// Component
// =============================================================================

/**
 * 레지스트리 구분 선택 카드 컴포넌트
 *
 * 사용자가 레지스트리 이미지를 생성할 때 구분을 선택할 수 있는 카드입니다.
 * Snapshot과 External 두 가지 옵션을 제공합니다.
 * 클릭 시 PubSub을 통해 divisionType을 전달합니다.
 */
export function RegistryTypeCard({ type, onClick }: RegistryTypeCardProps) {
  const cardData = CARD_DATA[type];

  if (!cardData) {
    throw new Error(`Invalid type: ${type}`);
  }

  return (
    <SelectOptionCard
      from={cardData.from}
      title={cardData.title}
      type={type}
      description={cardData.description}
      onClick={onClick}
    />
  );
}
