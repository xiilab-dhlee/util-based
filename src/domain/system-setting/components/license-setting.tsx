"use client";

import styled from "styled-components";
import { Button, Typography } from "xiilab-ui";

import { useGetLatestLicense } from "@/api/generated/license/license";
import { SettingBox } from "@/domain/system-setting/components/setting-box";
import { DataErrorState } from "@/shared/components/feedback/data-error-state";
import { SYSTEM_SETTING_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import { formatDateSafely } from "@/shared/utils/date.util";
import { getResourceInfo } from "@/shared/utils/resource.util";
import {
  AsideDetailArticleColumn,
  AsideDetailArticleKey,
  AsideDetailArticleValue,
} from "@/styles/layers/aside-detail-layers.styled";

/**
 * 라이선스 설정 컴포넌트
 * 자체적으로 API 호출 및 상태 관리를 담당
 */
export function LicenseSetting() {
  const publish = usePublish();
  const { data, isLoading, isError, refetch } = useGetLatestLicense();

  const isEmpty = !data && !isLoading;

  const handleRenew = () => {
    publish(SYSTEM_SETTING_EVENTS.openCreateLicenseModal, {});
  };

  if (isError) {
    return (
      <SettingBox title="라이선스" height={160}>
        <DataErrorState onRetry={refetch} />
      </SettingBox>
    );
  }

  return (
    <SettingBox
      title="라이선스"
      height={160}
      extra={
        <Button
          variant="outlined"
          size="small"
          onClick={handleRenew}
          disabled={isLoading}
        >
          갱신
        </Button>
      }
    >
      {isEmpty ? (
        <EmptyWrapper>
          <EmptyTitle>라이선스가 등록되어 있지 않습니다.</EmptyTitle>
          <EmptyDescription>
            라이선스 키를 등록하여 시스템을 활성화해 주세요.
          </EmptyDescription>
        </EmptyWrapper>
      ) : (
        <>
          <AsideDetailArticleColumn>
            <AsideDetailArticleKey>버전</AsideDetailArticleKey>
            <AsideDetailArticleValue>
              {data?.version ?? "-"}
            </AsideDetailArticleValue>
          </AsideDetailArticleColumn>

          <AsideDetailArticleColumn>
            <AsideDetailArticleKey>GPU 개수</AsideDetailArticleKey>
            <AsideDetailArticleValue>
              {data?.gpuCount ?? "-"}
              {getResourceInfo("GPU").unit}
            </AsideDetailArticleValue>
          </AsideDetailArticleColumn>

          <AsideDetailArticleColumn>
            <AsideDetailArticleKey>만료기간</AsideDetailArticleKey>
            <AsideDetailArticleValue>
              {formatDateSafely(data?.expiredAt)}까지
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
