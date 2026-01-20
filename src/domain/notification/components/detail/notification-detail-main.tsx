"use client";

import { useParams, useRouter } from "next/navigation";

import { DrawerCloseButton } from "@/shared/components/button/drawer-close-button";
import { EmptyState } from "@/shared/components/empty-state/empty-state";
import { ROUTES } from "@/shared/constants/routes.constant";
import {
  AsideDetailArticle,
  AsideDetailContainer,
  AsideDetailHeader,
  AsideDetailHeaderTitle,
} from "@/styles/layers/aside-detail-layers.styled";

/**
 * NotificationDetailMain 컴포넌트
 *
 * 알림 상세 정보를 표시하는 컴포넌트입니다.
 * TODO: 상세 API 추가 후 연동 필요
 */
export function NotificationDetailMain() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const notificationId = params.id;

  console.log(notificationId);

  /**
   * 드로어 닫기 핸들러
   */
  const handleClose = () => {
    router.replace(ROUTES.ADMIN_NOTIFICATION);
  };

  return (
    <AsideDetailContainer $isFloat={true}>
      <AsideDetailHeader>
        <AsideDetailHeaderTitle>상세 정보</AsideDetailHeaderTitle>
        <DrawerCloseButton onClick={handleClose} />
      </AsideDetailHeader>

      <AsideDetailArticle>
        <EmptyState />
      </AsideDetailArticle>
    </AsideDetailContainer>
  );
}
