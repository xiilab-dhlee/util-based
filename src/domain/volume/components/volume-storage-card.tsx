"use client";

import { Icon } from "xiilab-ui";

import type { VolumeStorageType } from "@/domain/volume/schemas/volume.schema";
import { SelectOptionCard } from "@/shared/components/card/select-option-card";

// =============================================================================
// Types
// =============================================================================

interface VolumeStorageCardProps {
  /** 선택할 스토리지 타입 (ASTRAGO 또는 LOCAL) */
  storageType: VolumeStorageType;
  onClick: (storageType: string) => void;
}

// =============================================================================
// Constants
// =============================================================================

/** 스토리지 타입별 카드 데이터 */
const STORAGE_CARD_DATA: Record<
  VolumeStorageType,
  {
    from: string;
    title: string;
    icon: React.ReactNode;
    description: string;
  }
> = {
  ASTRAGO: {
    from: "Local",
    title: "AstraGo Storage",
    icon: <Icon name="Astrago" color="#5b29c7" size={32} />,
    description:
      "AstraGo로 관리되어지는 File 스토리지에 데이터가 업로드 됩니다.",
  },
  LOCAL: {
    from: "External Data Source",
    title: "On-premise Storage",
    icon: (
      <Icon name="OnPremiseStorage" color="rgba(0, 20, 197, 60%)" size={24} />
    ),
    description:
      "On-premise 환경의 사용자 스토리지(NFS)를 연결하여 파일을 업로드 됩니다.",
  },
};

// =============================================================================
// Component
// =============================================================================

/**
 * 볼륨 스토리지 타입 선택 카드 컴포넌트
 *
 * 사용자가 볼륨을 생성할 때 스토리지 타입을 선택할 수 있는 카드입니다.
 * AstraGo Storage와 On-premise Storage 두 가지 옵션을 제공합니다.
 */
export function VolumeStorageCard({
  storageType,
  onClick,
}: VolumeStorageCardProps) {
  const cardData = STORAGE_CARD_DATA[storageType];

  if (!cardData) {
    return null;
  }

  return (
    <SelectOptionCard
      from={cardData.from}
      title={cardData.title}
      type={storageType}
      icon={cardData.icon}
      description={cardData.description}
      onClick={onClick}
    />
  );
}
