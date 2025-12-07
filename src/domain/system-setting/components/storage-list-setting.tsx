"use client";

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
import { MyPagination } from "@/shared/components/paginate";
import { SYSTEM_SETTING_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import { useServices } from "@/shared/providers/service-provider";

/**
 * 스토리지 목록 설정 컴포넌트
 * 자체적으로 API 호출 및 상태 관리를 담당
 */
export function StorageListSetting() {
  const [page, setPage] = useState(1);
  const { storageSettingService } = useServices();
  const publish = usePublish();

  const { data, isLoading } = useGetStorageSettings({
    page,
    size: STORAGE_SETTING_PAGE_SIZE,
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleAdd = () => {
    publish(SYSTEM_SETTING_EVENTS.openStorageCreateModal);
  };

  const handleCardClick = async (id: number) => {
    try {
      const response = await storageSettingService.getDetail(id);
      publish(SYSTEM_SETTING_EVENTS.openStorageDetailModal, {
        data: response.data,
      });
    } catch {
      alert("스토리지 상세 조회에 실패했습니다.");
    }
  };

  const handleDelete = (id: number) => {
    publish<DeleteStorageModalPayload>(
      SYSTEM_SETTING_EVENTS.openStorageDeleteModal,
      {
        id,
      },
    );
  };

  const totalPages = Math.ceil(
    (data?.totalSize || 0) / STORAGE_SETTING_PAGE_SIZE,
  );

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
        <CardGrid>
          {isLoading
            ? STORAGE_SETTING_SKELETON_KEYS.map((key) => (
                <StorageSettingCard key={key} loading />
              ))
            : data?.content.map((storage) => (
                <StorageSettingCard
                  key={storage.id}
                  {...storage}
                  onClick={handleCardClick}
                  onDelete={handleDelete}
                />
              ))}
        </CardGrid>
        {!isLoading && totalPages > 0 && (
          <PaginationWrapper>
            <MyPagination
              current={page}
              total={data?.totalSize || 0}
              pageSize={STORAGE_SETTING_PAGE_SIZE}
              onChange={handlePageChange}
            />
          </PaginationWrapper>
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
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px;
  flex: 0;
`;

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 12px;
`;
