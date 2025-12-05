"use client";

import { useParams, useRouter } from "next/navigation";
import styled from "styled-components";
import { Button } from "xiilab-ui";

import { getNotificationTypeLabel } from "@/domain/notification/constants/notification.constant";
import { useGetNotification } from "@/domain/notification/hooks/use-get-notification";
import { DrawerCloseButton } from "@/shared/components/button/drawer-close-button";
import { DataErrorState } from "@/shared/components/feedback/data-error-state";
import { NOTIFICATION_EVENTS } from "@/shared/constants/pubsub.constant";
import { ROUTES } from "@/shared/constants/routes.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import { formatDateTimeSafely } from "@/shared/utils/date.util";
import {
  AsideDetailArticle,
  AsideDetailArticleBody,
  AsideDetailArticleColumn,
  AsideDetailArticleHeader,
  AsideDetailArticleItem,
  AsideDetailArticleKey,
  AsideDetailArticleTitle,
  AsideDetailArticleValue,
  AsideDetailContainer,
  AsideDetailFooter,
  AsideDetailHeader,
  AsideDetailHeaderTitle,
} from "@/styles/layers/aside-detail-layers.styled";

/**
 * NotificationDetailMain 컴포넌트
 *
 * URL params의 id를 통해 알림의 상세 정보를 표시하는 컴포넌트입니다.
 * Figma 디자인 기반으로 알림 유형, 발생 일시, 알림 내용을 표시합니다.
 */
export function NotificationDetailMain() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const notificationId = params.id;

  const { data, isLoading, isError, refetch } =
    useGetNotification(notificationId);

  const publish = usePublish();

  /**
   * 드로어 닫기 핸들러
   *
   * 알림 목록 페이지로 이동합니다.
   */
  const handleClose = () => {
    router.replace(ROUTES.ADMIN_NOTIFICATION);
  };

  /**
   * 삭제 버튼 클릭 핸들러
   *
   * 삭제 확인 모달을 엽니다.
   */
  const handleDelete = () => {
    publish(NOTIFICATION_EVENTS.sendDeleteNotification, notificationId);
  };

  return (
    <AsideDetailContainer $isFloat={true}>
      {/* 드로어 헤더 - 제목과 닫기 버튼 */}
      <AsideDetailHeader>
        <AsideDetailHeaderTitle>상세 정보</AsideDetailHeaderTitle>
        <DrawerCloseButton onClick={handleClose} />
      </AsideDetailHeader>

      {/* 알림 상세 정보 아티클 */}
      <AsideDetailArticle>
        {isError && <DataErrorState onRetry={refetch} />}
        {!isError && (
          <AsideDetailArticleBody>
            <AsideDetailArticleItem>
              <AsideDetailArticleHeader>
                <AsideDetailArticleTitle>알림 상세</AsideDetailArticleTitle>
              </AsideDetailArticleHeader>

              <AsideDetailArticleColumn>
                <AsideDetailArticleKey>알림 유형</AsideDetailArticleKey>
                <AsideDetailArticleValue>
                  {data?.type ? getNotificationTypeLabel(data.type) : "-"}
                </AsideDetailArticleValue>
              </AsideDetailArticleColumn>

              <AsideDetailArticleColumn>
                <AsideDetailArticleKey>발생 일시</AsideDetailArticleKey>
                <AsideDetailArticleValue>
                  {formatDateTimeSafely(data?.createdDate) ?? "-"}
                </AsideDetailArticleValue>
              </AsideDetailArticleColumn>

              <AsideDetailArticleColumn>
                <AsideDetailArticleKey>알림 내용</AsideDetailArticleKey>
                <AsideDetailArticleValue>
                  <NotificationContentTitle>
                    {data?.contentTitle ?? "-"}
                  </NotificationContentTitle>
                </AsideDetailArticleValue>
              </AsideDetailArticleColumn>

              {data?.content && (
                <AsideDetailArticleColumn>
                  <AsideDetailArticleKey />
                  <AsideDetailArticleValue>
                    {data.content}
                  </AsideDetailArticleValue>
                </AsideDetailArticleColumn>
              )}
            </AsideDetailArticleItem>
          </AsideDetailArticleBody>
        )}
      </AsideDetailArticle>

      {/* 하단 버튼 영역 */}
      <NotificationDetailFooter>
        <NotificationDetailFooterActions>
          <Button
            variant="outlined"
            onClick={handleDelete}
            disabled={isLoading || isError}
            size="small"
          >
            삭제
          </Button>
        </NotificationDetailFooterActions>
      </NotificationDetailFooter>
    </AsideDetailContainer>
  );
}

const NotificationDetailFooter = styled(AsideDetailFooter)`
  margin-top: auto;
  padding-top: var(--column-gutter-size);
`;

const NotificationDetailFooterActions = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
`;

const NotificationContentTitle = styled.p`
  color: #22272f;
  font-weight: 600;
  font-size: 14px;
  line-height: 16px;
`;
