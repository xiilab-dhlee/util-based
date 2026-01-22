"use client";

import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import styled from "styled-components";

import { useGetAdminNotificationDetail } from "@/api/generated/admin-account-notification/admin-account-notification";
import { DrawerCloseButton } from "@/shared/components/button/drawer-close-button";
import { EmptyState } from "@/shared/components/empty-state/empty-state";
import {
  getAdminNotificationSetLabel,
  getNotificationTypeLabel,
} from "@/shared/constants/notification";
import { ROUTES } from "@/shared/constants/routes.constant";
import { getSessionAccountId } from "@/shared/utils/auth.util";
import { formatDateTimeSafely } from "@/shared/utils/date.util";
import {
  AsideDetailArticle,
  AsideDetailArticleBody,
  AsideDetailArticleColumn,
  AsideDetailArticleKey,
  AsideDetailArticleValue,
  AsideDetailContainer,
  AsideDetailHeader,
  AsideDetailHeaderTitle,
  AsideDetailScrollableContent,
} from "@/styles/layers/aside-detail-layers.styled";

/**
 * NotificationDetailMain 컴포넌트
 *
 * 알림 상세 정보를 표시하는 컴포넌트입니다.
 */
export function NotificationDetailMain() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const notificationId = Number(params.id);

  const { data: session } = useSession();
  const accountId = getSessionAccountId(session) ?? "";

  const { data, isError } = useGetAdminNotificationDetail(
    accountId,
    notificationId,
    {
      query: {
        enabled: Boolean(accountId) && !Number.isNaN(notificationId),
      },
    },
  );

  const handleClose = () => {
    router.replace(ROUTES.ADMIN_NOTIFICATION);
  };

  const renderContent = () => {
    if (isError || !data) {
      return <EmptyState />;
    }

    return (
      <AsideDetailScrollableContent>
        <AsideDetailArticle>
          <AsideDetailArticleBody>
            <AsideDetailArticleColumn>
              <AsideDetailArticleKey>알림 유형</AsideDetailArticleKey>
              <AsideDetailArticleValue>
                {getNotificationTypeLabel(data.notificationType)}
              </AsideDetailArticleValue>
            </AsideDetailArticleColumn>

            <AsideDetailArticleColumn>
              <AsideDetailArticleKey>알림 이름</AsideDetailArticleKey>
              <AsideDetailArticleValue>
                {getAdminNotificationSetLabel(data.notificationSetName)}
              </AsideDetailArticleValue>
            </AsideDetailArticleColumn>

            <AsideDetailArticleColumn>
              <AsideDetailArticleKey>발생일시</AsideDetailArticleKey>
              <AsideDetailArticleValue>
                {formatDateTimeSafely(data.createdAt)}
              </AsideDetailArticleValue>
            </AsideDetailArticleColumn>
          </AsideDetailArticleBody>
        </AsideDetailArticle>

        <AsideDetailArticle>
          <AsideDetailArticleBody>
            <AsideDetailArticleColumn>
              <AsideDetailArticleKey>내용</AsideDetailArticleKey>
            </AsideDetailArticleColumn>
            <ContentText>{data.notificationContent}</ContentText>
          </AsideDetailArticleBody>
        </AsideDetailArticle>
      </AsideDetailScrollableContent>
    );
  };

  return (
    <AsideDetailContainer $isFloat={true}>
      <AsideDetailHeader>
        <AsideDetailHeaderTitle>상세 정보</AsideDetailHeaderTitle>
        <DrawerCloseButton onClick={handleClose} />
      </AsideDetailHeader>
      {renderContent()}
    </AsideDetailContainer>
  );
}

const ContentText = styled.div`
  font-size: 14px;
  line-height: 1.6;
  color: #333;
  white-space: pre-wrap;
  word-break: break-word;
`;
