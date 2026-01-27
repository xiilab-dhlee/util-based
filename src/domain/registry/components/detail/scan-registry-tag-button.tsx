"use client";

import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Icon } from "xiilab-ui";

import type { ImageTagListResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { REGISTRY_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import { checkIsUser, getSessionAccountId } from "@/shared/utils/auth.util";
import {
  ColumnAlignCenterWrap,
  ColumnIconWrap,
} from "@/styles/layers/column-layer.styled";

interface ScanRegistryTagButtonProps {
  record: ImageTagListResponse;
}

export function ScanRegistryTagButton({ record }: ScanRegistryTagButtonProps) {
  const { name } = useParams<{ name: string }>();
  const harborImageName = name ? decodeURIComponent(name) : "";

  const { data: session } = useSession();
  const publish = usePublish();

  // 권한 체크: 생성자이거나 관리자(admin/super admin)만 활성화
  const isUser = checkIsUser(session);
  const sessionAccountId = getSessionAccountId(session);
  const isOwner = record.creatorId === sessionAccountId;
  const canScan = !!session && (!isUser || isOwner);

  const handleClickIcon = () => {
    if (!canScan) return;
    publish(REGISTRY_EVENTS.openScanTagModal, {
      harborImageName,
      tagName: record.imageTagName,
    });
  };

  return (
    <ColumnAlignCenterWrap>
      <ColumnIconWrap
        type="button"
        onClick={handleClickIcon}
        disabled={!canScan}
      >
        <Icon name="SecurityCheck" color="var(--icon-fill)" size={16} />
      </ColumnIconWrap>
    </ColumnAlignCenterWrap>
  );
}
