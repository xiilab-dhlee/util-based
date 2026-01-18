"use client";

import { Icon } from "xiilab-ui";

import type { VolumeStorageType } from "@/domain/volume/schemas/volume.schema";
import { SelectOptionCard } from "@/shared/components/card/select-option-card";

interface VolumeStorageCardProps {
  storageType: VolumeStorageType;
  onClick: (storageType: VolumeStorageType) => void;
}

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

export function VolumeStorageCard({
  storageType,
  onClick,
}: VolumeStorageCardProps) {
  const cardData = STORAGE_CARD_DATA[storageType];

  if (!cardData) {
    throw new Error(`Invalid storage type: ${storageType}`);
  }

  return (
    <SelectOptionCard
      from={cardData.from}
      title={cardData.title}
      type={storageType}
      icon={cardData.icon}
      description={cardData.description}
      onClick={(type) => onClick(type as VolumeStorageType)}
    />
  );
}
