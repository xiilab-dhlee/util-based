"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import styled from "styled-components";
import { Form, FormItem, Icon, Input, Modal, Typography } from "xiilab-ui";

import {
  getGetStorageDetailQueryKey,
  getGetStoragesQueryKey,
  useUpdateStorage,
} from "@/api/generated/admin-storage/admin-storage";
import type { StorageResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  type UpdateStorageFormType,
  updateStorageFormSchema,
} from "@/domain/storage/schemas/storage.schema";
import { STORAGE_EVENTS } from "@/shared/constants/pubsub.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

// ===== 타입 =====

export interface UpdateStorageModalPayload {
  data: StorageResponse;
}

// ===== 컴포넌트 =====

/**
 * 스토리지 수정 모달
 *
 * PubSub 패턴을 사용하여 모달을 열고 데이터를 전달받습니다.
 */
export function UpdateStorageModal() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<StorageResponse | null>(null);
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateStorageFormType>({
    resolver: zodResolver(updateStorageFormSchema),
    defaultValues: {
      storageName: "",
    },
  });

  const { mutate, isPending } = useUpdateStorage();

  const handleCancel = () => {
    setOpen(false);
  };

  const onSubmit = (formData: UpdateStorageFormType) => {
    if (isPending) return;
    if (!data) return;

    mutate(
      {
        storageId: data.storageId,
        data: { storageName: formData.storageName },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getGetStorageDetailQueryKey(data.storageId),
          });
          queryClient.invalidateQueries({
            queryKey: getGetStoragesQueryKey(),
          });
          setOpen(false);
        },
      },
    );
  };

  useSubscribe<UpdateStorageModalPayload>(
    STORAGE_EVENTS.openEditModal,
    (payload) => {
      setData(payload.data || null);
      reset({ storageName: payload.data?.storageName || "" });
      setOpen(true);
    },
  );

  return (
    <Modal
      type="primary"
      icon={<Icon name="Edit01" color="#fff" size={18} />}
      modalWidth={370}
      open={open}
      closable
      title="스토리지 수정"
      showCancelButton
      cancelText="취소"
      onCancel={handleCancel}
      okText="수정 완료"
      onOk={handleSubmit(onSubmit)}
      okButtonProps={{ loading: isPending }}
      cancelButtonProps={{ disabled: isPending }}
      centered
      showHeaderBorder
      loading={isPending}
    >
      <ModalContent>
        <SectionGroup>
          {/* 스토리지 기본 정보 섹션 */}
          <SectionHeader>
            <SectionIndicator />
            <SectionTitle>스토리지 기본 정보</SectionTitle>
          </SectionHeader>

          <ContentBox>
            <InfoRow>
              <Label>타입</Label>
              <Value>{data?.storageChannel || "-"}</Value>
            </InfoRow>
            <InfoRow>
              <Label>IP 주소</Label>
              <Value>{data?.storageIp || "-"}</Value>
            </InfoRow>
            <InfoRow>
              <Label>스토리지 저장 Path</Label>
              <Value>{data?.storageSavePath || "-"}</Value>
            </InfoRow>
          </ContentBox>
        </SectionGroup>

        <SectionGroup>
          {/* 스토리지 수정 정보 섹션 */}
          <SectionHeader>
            <SectionIndicator />
            <SectionTitle>스토리지 수정 정보</SectionTitle>
          </SectionHeader>

          <Form layout="vertical">
            <Controller
              name="storageName"
              control={control}
              render={({ field }) => (
                <FormItem
                  label="이름"
                  required
                  validateStatus={errors.storageName ? "error" : undefined}
                  help={errors.storageName?.message}
                >
                  <Input
                    {...field}
                    placeholder="스토리지 이름을 입력해 주세요."
                    autoComplete="off"
                    disabled={isPending}
                  />
                </FormItem>
              )}
            />
          </Form>
        </SectionGroup>
      </ModalContent>
    </Modal>
  );
}

// ===== Styled Components =====

const ModalContent = styled.div`
  margin-top: 6px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const SectionGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 8px;
`;

const SectionIndicator = styled.div`
  width: 2px;
  height: 12px;
  background-color: rgba(31, 91, 255, 0.8);
`;

const SectionTitle = styled(Typography.Text).attrs({
  variant: "body-2-1",
})`
  color: #000;
  font-weight: 700;
`;

const ContentBox = styled.div`
  background-color: #fff;
  border: 1px solid #e9e9e9;
  border-radius: 2px;
  padding: 16px;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 14px;

  & + & {
    margin-top: 12px;
  }
`;

const Label = styled(Typography.Text).attrs({
  variant: "body-2-2",
})`
  min-width: 100px;
  color: #484848;
  font-weight: 600;
`;

const Value = styled(Typography.Text).attrs({
  variant: "subtitle-2-3",
})`
  color: #000;
  flex: 1;
  word-break: break-all;
  white-space: normal;
`;
