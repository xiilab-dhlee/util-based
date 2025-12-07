"use client";

import styled from "styled-components";
import { Button, Typography } from "xiilab-ui";

import type { DeleteSmtpModalPayload } from "@/domain/system-setting/components/delete-smtp-modal";
import { SettingBox } from "@/domain/system-setting/components/setting-box";
import type { SmtpModalPayload } from "@/domain/system-setting/components/smtp-modal";
import { useGetSmtp } from "@/domain/system-setting/hooks/use-get-smtp";
import { DataErrorState } from "@/shared/components/feedback/data-error-state";
import { MODAL_MODES } from "@/shared/constants/core.constant";
import { SYSTEM_SETTING_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import {
  AsideDetailArticleColumn,
  AsideDetailArticleKey,
  AsideDetailArticleValue,
} from "@/styles/layers/aside-detail-layers.styled";

/**
 * SMTP 계정 정보 설정 컴포넌트
 * 자체적으로 API 호출 및 상태 관리를 담당
 */
export function SmtpAccountSetting() {
  const publish = usePublish();
  const { data, isLoading, isError, refetch } = useGetSmtp();

  const isEmpty = !data && !isLoading;

  const handleRegister = () => {
    publish<SmtpModalPayload>(SYSTEM_SETTING_EVENTS.openSmtpModal, {
      mode: MODAL_MODES.CREATE,
    });
  };

  const handleEdit = () => {
    publish<SmtpModalPayload>(SYSTEM_SETTING_EVENTS.openSmtpModal, {
      mode: MODAL_MODES.UPDATE,
      data,
    });
  };

  const handleDelete = () => {
    if (!data?.id) return;
    publish<DeleteSmtpModalPayload>(SYSTEM_SETTING_EVENTS.openSmtpDeleteModal, {
      id: data.id,
    });
  };

  if (isError) {
    return (
      <SettingBox title="SMTP 계정 정보" height={162}>
        <DataErrorState onRetry={refetch} />
      </SettingBox>
    );
  }

  return (
    <SettingBox
      title="SMTP 계정 정보"
      height={162}
      extra={
        isEmpty ? (
          <Button
            variant="outlined"
            size="small"
            onClick={handleRegister}
            disabled={isLoading}
          >
            등록
          </Button>
        ) : (
          <ButtonGroup>
            <Button variant="outlined" size="small" onClick={handleEdit}>
              수정
            </Button>
            <Button variant="outlined" size="small" onClick={handleDelete}>
              삭제
            </Button>
          </ButtonGroup>
        )
      }
    >
      {isEmpty ? (
        <EmptyWrapper>
          <EmptyTitle>SMTP 계정이 등록되지 않았습니다.</EmptyTitle>
          <EmptyDescription>
            SMTP 기능을 사용하기 위해 계정 등록을 해주세요.
          </EmptyDescription>
        </EmptyWrapper>
      ) : (
        <>
          <AsideDetailArticleColumn>
            <AsideDetailArticleKey>SMTP 호스트</AsideDetailArticleKey>
            <AsideDetailArticleValue>
              {data?.isGoogle ? "Google" : "이외 호스트"}
            </AsideDetailArticleValue>
          </AsideDetailArticleColumn>

          <AsideDetailArticleColumn>
            <AsideDetailArticleKey>계정</AsideDetailArticleKey>
            <AsideDetailArticleValue>
              {data?.account ?? "-"}
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
  color: var(--Gray-Gray_03);
`;

const EmptyDescription = styled(Typography.Text).attrs({
  variant: "body-2-4",
})`
  color: var(--Gray-Gray_05);
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 4px;
`;
