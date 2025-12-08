"use client";

import { useCallback, useState } from "react";
import styled from "styled-components";
import { Icon, InfoModal } from "xiilab-ui";

import { useGetCredentialDetail } from "@/domain/system-setting/hooks/use-get-credential-detail";
import { DataErrorState } from "@/shared/components/feedback/data-error-state";
import { SYSTEM_SETTING_EVENTS } from "@/shared/constants/pubsub.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";
import { formatDateSafely } from "@/shared/utils/date.util";
import {
  AsideDetailArticle,
  AsideDetailArticleBody,
  AsideDetailArticleColumn,
  AsideDetailArticleItem,
  AsideDetailArticleKey,
  AsideDetailArticleTitle,
  AsideDetailArticleValue,
} from "@/styles/layers/aside-detail-layers.styled";

/**
 * 크레덴셜 상세 모달
 */
export function ViewCredentialDetailModal() {
  const [open, setOpen] = useState(false);
  const [credentialId, setCredentialId] = useState<number | null>(null);

  useSubscribe(
    SYSTEM_SETTING_EVENTS.openCredentialDetailModal,
    useCallback((id: number) => {
      setCredentialId(id);
      setOpen(true);
    }, []),
  );

  const handleClose = () => {
    setOpen(false);
    setCredentialId(null);
  };

  const { data, isLoading, isError, refetch } =
    useGetCredentialDetail(credentialId);

  if (!open || credentialId === null) return null;

  if (isError) {
    return (
      <InfoModal
        title="크레덴셜 상세"
        type="primary"
        open={open}
        onClose={handleClose}
        modalWidth={370}
        centered
        showHeaderBorder
        icon={<Icon name="Information" color="#fff" size={20} />}
      >
        <DataErrorState onRetry={refetch} />
      </InfoModal>
    );
  }

  return (
    <InfoModal
      title="크레덴셜 상세"
      type="primary"
      open={open}
      onClose={handleClose}
      modalWidth={370}
      loading={isLoading}
      centered
      showHeaderBorder
      icon={<Icon name="Information" color="#fff" size={20} />}
    >
      <ScrollableContainer>
        <AsideDetailArticle>
          <AsideDetailArticleBody>
            {/* 기본 정보 */}
            <LocalArticleItem>
              <SectionTitle>기본 정보</SectionTitle>

              <AlignStartColumn>
                <AsideDetailArticleKey>타입</AsideDetailArticleKey>
                <AsideDetailArticleValue>
                  {data?.type ?? "-"}
                </AsideDetailArticleValue>
              </AlignStartColumn>

              <AlignStartColumn>
                <AsideDetailArticleKey>이름</AsideDetailArticleKey>
                <AsideDetailArticleValue>
                  {data?.name ?? "-"}
                </AsideDetailArticleValue>
              </AlignStartColumn>

              <AlignStartColumn>
                <AsideDetailArticleKey>설명</AsideDetailArticleKey>
                <AsideDetailArticleValue>
                  {data?.description ?? "-"}
                </AsideDetailArticleValue>
              </AlignStartColumn>
            </LocalArticleItem>

            {/* 설정 내용 */}
            <LocalArticleItem>
              <SectionTitle>설정 내용</SectionTitle>

              <AlignStartColumn>
                <AsideDetailArticleKey>아이디</AsideDetailArticleKey>
                <AsideDetailArticleValue>
                  {data?.userId ?? "-"}
                </AsideDetailArticleValue>
              </AlignStartColumn>

              {/* 내부 레지스트리 URL (선택적) */}
              {data?.registryUrl && (
                <UrlSection>
                  <UrlKey>내부 레지스트리 URL</UrlKey>
                  <UrlBox>
                    <UrlIconWrapper>
                      <Icon name="Port" size={20} />
                    </UrlIconWrapper>
                    <UrlLabel>URL</UrlLabel>
                    <UrlDivider />
                    <UrlValue>{data?.registryUrl}</UrlValue>
                  </UrlBox>
                </UrlSection>
              )}
            </LocalArticleItem>

            {/* 생성 정보 */}
            <LocalArticleItem>
              <SectionTitle>생성 정보</SectionTitle>
              <AlignStartColumn>
                <AsideDetailArticleKey>생성자</AsideDetailArticleKey>
                <AsideDetailArticleValue>
                  {data?.creatorName ?? "-"}
                </AsideDetailArticleValue>
              </AlignStartColumn>
              <AlignStartColumn>
                <AsideDetailArticleKey>생성일</AsideDetailArticleKey>
                <AsideDetailArticleValue>
                  {formatDateSafely(data?.creatorDate, "yyyy.MM.dd", "-")}
                </AsideDetailArticleValue>
              </AlignStartColumn>
            </LocalArticleItem>
          </AsideDetailArticleBody>
        </AsideDetailArticle>
      </ScrollableContainer>
    </InfoModal>
  );
}

const SectionTitle = styled(AsideDetailArticleTitle)`
  margin-bottom: 8px;
`;

const LocalArticleItem = styled(AsideDetailArticleItem)`
  & + & {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid #e0e0e0;
  }
`;

const ScrollableContainer = styled.div`
  max-height: 450px;
  overflow-y: auto;
`;

const AlignStartColumn = styled(AsideDetailArticleColumn)`
  align-items: flex-start;
`;

const UrlKey = styled(AsideDetailArticleKey)`
  width: 100%;
`;

const UrlSection = styled(AsideDetailArticleColumn)`
  flex-direction: column;
  align-items: stretch;
  row-gap: 8px;
`;

const UrlBox = styled.div`
  display: flex;
  align-items: center;
  min-height: 28px;
  width: 100%;
  background-color: #f3f5f7;
  border: 1px solid #c1c7ce;
  border-radius: 2px;
  padding: 0 10px;
`;

const UrlIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const UrlLabel = styled.span`
  font-weight: 500;
  font-size: 12px;
  line-height: 14px;
  color: #484848;
  margin-left: 2px;
`;

const UrlDivider = styled.div`
  width: 1px;
  height: 14px;
  background-color: #c1c7ce;
  margin-left: 10px;
`;

const UrlValue = styled.span`
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: #292b32;
  margin-left: 10px;
  flex: 1 1 auto;
  word-break: break-all;
  overflow-wrap: anywhere;
`;
