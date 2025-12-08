"use client";

import styled from "styled-components";
import { Button, Typography } from "xiilab-ui";

import { SettingBox } from "@/domain/system-setting/components/setting-box";
import { useGetHpe } from "@/domain/system-setting/hooks/use-get-hpe";
import { DataErrorState } from "@/shared/components/feedback/data-error-state";
import { SYSTEM_SETTING_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import {
  AsideDetailArticleColumn,
  AsideDetailArticleKey,
  AsideDetailArticleValue,
} from "@/styles/layers/aside-detail-layers.styled";

/**
 * HPE One View 연동 설정 컴포넌트
 * 자체적으로 API 호출 및 상태 관리를 담당
 */
export function HpeOneviewSetting() {
  const publish = usePublish();
  const { data, isLoading, isError, refetch } = useGetHpe();

  const isEmpty = !data && !isLoading;

  const handleConnect = () => {
    publish(SYSTEM_SETTING_EVENTS.openHpeConnectionModal, {});
  };

  if (isError) {
    return (
      <SettingBox title="HPE One View 연동" height={160}>
        <DataErrorState onRetry={refetch} />
      </SettingBox>
    );
  }

  return (
    <SettingBox
      title="HPE One View 연동"
      height={160}
      extra={
        <Button
          variant="outlined"
          size="small"
          onClick={handleConnect}
          disabled={isLoading}
        >
          {data ? "수정" : "연동"}
        </Button>
      }
    >
      {isEmpty ? (
        <EmptyWrapper>
          <EmptyTitle>HPE OneView가 연동되어 있지 않습니다.</EmptyTitle>
          <EmptyDescription>
            HPE OneView 정보를 입력하여 연동해 주세요.
          </EmptyDescription>
        </EmptyWrapper>
      ) : (
        <>
          <AsideDetailArticleColumn>
            <AsideDetailArticleKey>ID</AsideDetailArticleKey>
            <AsideDetailArticleValue>
              {data?.id ?? "-"}
            </AsideDetailArticleValue>
          </AsideDetailArticleColumn>

          <AsideDetailArticleColumn>
            <AsideDetailArticleKey>Server IP</AsideDetailArticleKey>
            <AsideDetailArticleValue>
              {data?.serverIp ?? "-"}
            </AsideDetailArticleValue>
          </AsideDetailArticleColumn>
        </>
      )}
    </SettingBox>
  );
}

const EmptyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 8px;
`;

const EmptyTitle = styled(Typography.Text).attrs({
  variant: "subtitle-2-1",
})`
  color: var(--color-gray-03);
`;

const EmptyDescription = styled(Typography.Text).attrs({
  variant: "body-2-4",
})`
  color: var(--color-gray-05);
`;
