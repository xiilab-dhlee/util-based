"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import styled from "styled-components";
import { Button } from "xiilab-ui";

import type { DeleteStorageModalPayload } from "@/domain/system-setting/components/delete-storage-modal";
import { SettingBox } from "@/domain/system-setting/components/setting-box";
import { StorageSettingCard } from "@/domain/system-setting/components/storage-setting-card";
import {
  STORAGE_SETTING_PAGE_SIZE,
  STORAGE_SETTING_SKELETON_KEYS,
} from "@/domain/system-setting/constants/system-setting.constant";
import { useGetStorageSettings } from "@/domain/system-setting/hooks/use-get-storage-settings";
import type { StorageSettingIdType } from "@/domain/system-setting/schemas/storage-setting.schema";
import { EmptyState } from "@/shared/components/empty-state/empty-state";
import { DataErrorState } from "@/shared/components/feedback/data-error-state";
import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";
import { SYSTEM_SETTING_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";

/**
 * 스토리지 목록 설정 컴포넌트
 * 자체적으로 API 호출 및 상태 관리를 담당
 */
export function StorageListSetting() {
  const [page, setPage] = useState(1);
  const publish = usePublish();

  const { data, isLoading, isError, refetch } = useGetStorageSettings({
    page,
    size: STORAGE_SETTING_PAGE_SIZE,
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleAdd = () => {
    publish(SYSTEM_SETTING_EVENTS.openStorageCreateModal);
  };

  const handleCardClick = (id: StorageSettingIdType) => {
    publish(SYSTEM_SETTING_EVENTS.openStorageDetailModal, {
      id,
    });
  };

  const handleDelete = (id: StorageSettingIdType) => {
    publish<DeleteStorageModalPayload>(
      SYSTEM_SETTING_EVENTS.openStorageDeleteModal,
      {
        id,
      },
    );
  };

  const items = data?.content ?? [];

  const renderContent = (): ReactNode => {
    if (isLoading) {
      return (
        <CardGrid>
          {STORAGE_SETTING_SKELETON_KEYS.map((key) => (
            <StorageSettingCard key={key} loading />
          ))}
        </CardGrid>
      );
    }

    if (isError) {
      return <FullSizeErrorState onRetry={refetch} />;
    }

    if (items.length === 0) {
      return (
        <EmptyState
          title="스토리지 목록이 비어 있습니다."
          content="추가 버튼을 눌러 새로운 스토리지를 등록해 주세요."
        />
      );
    }

    return (
      <CardGrid>
        {items.map((storage) => (
          <StorageSettingCard
            key={storage.id}
            {...storage}
            onClick={handleCardClick}
            onDelete={handleDelete}
          />
        ))}
      </CardGrid>
    );
  };

  return (
    <SettingBox
      title="스토리지 목록"
      height={542}
      extra={
        <Button variant="outlined" size="small" onClick={handleAdd}>
          추가
        </Button>
      }
    >
      <Container>
        {renderContent()}
        {!isLoading && !isError && items.length > 0 && (
          <ListPageFooter
            total={data?.totalSize || 0}
            page={page}
            pageSize={STORAGE_SETTING_PAGE_SIZE}
            onChange={handlePageChange}
            isLoading={isLoading}
          />
        )}
      </Container>
    </SettingBox>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  flex: 1;
  width: 100%;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px;
  flex: 0;
`;

const FullSizeErrorState = styled(DataErrorState)`
  height: 100%;
`;
