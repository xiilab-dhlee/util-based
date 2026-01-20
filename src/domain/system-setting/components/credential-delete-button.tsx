"use client";

import { useSession } from "next-auth/react";
import { Button } from "xiilab-ui";

import type { AdminCredentialListItemResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { CREDENTIAL_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import {
  checkIsSuperAdmin,
  getSessionAccountId,
} from "@/shared/utils/auth.util";

interface CredentialDeleteButtonProps extends AdminCredentialListItemResponse {}

/**
 * 크리덴셜 삭제 버튼 컴포넌트
 *
 * SUPER_ADMIN 또는 생성자만 삭제 가능합니다.
 * 클릭 시 크리덴셜 삭제 모달을 표시합니다.
 */
export function CredentialDeleteButton({
  creatorId,
  credentialId,
}: CredentialDeleteButtonProps) {
  const { data: session } = useSession();
  const publish = usePublish();

  const isSuperAdmin = checkIsSuperAdmin(session);
  const isCreator = getSessionAccountId(session) === creatorId;
  const canDelete = isSuperAdmin || isCreator;

  const handleClick = () => {
    publish(CREDENTIAL_EVENTS.openDeleteModal, {
      accountId: creatorId,
      credentialId,
    });
  };

  return (
    <Button
      variant="text"
      size="small"
      onClick={handleClick}
      icon="Delete"
      disabled={!canDelete}
    />
  );
}
