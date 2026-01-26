"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import styled from "styled-components";
import { Button, Form, FormItem, Input } from "xiilab-ui";

import {
  getAdminGetVolumeDetailQueryKey,
  getAdminGetVolumeListQueryKey,
} from "@/api/generated/admin-volume/admin-volume";
import {
  getGetVolumeDetailQueryKey,
  getGetVolumeListQueryKey,
} from "@/api/generated/volume/volume";
import { useGetVolumeDetailByMode } from "@/domain/volume/hooks/use-get-volume-detail-by-mode";
import { useUpdateVolumeByMode } from "@/domain/volume/hooks/use-update-volume-by-mode";
import {
  type UpdateVolumeFormType,
  updateVolumeSchema,
} from "@/domain/volume/schemas/volume.schema";
import type { VolumeMode } from "@/domain/volume/types/volume.type";
import {
  getVolumeStatusInfo,
  getVolumeStorageTypeInfo,
} from "@/domain/volume/utils/volume.util";
import { formatDateSafely } from "@/shared/utils/date.util";
import { formatFileSize } from "@/shared/utils/file.util";
import {
  AsideDetailArticleBody,
  AsideDetailArticleColumn,
  AsideDetailArticleHeader,
  AsideDetailArticleItem,
  AsideDetailArticleKey,
  AsideDetailArticleRow,
  AsideDetailArticleRowItem,
  AsideDetailArticleTitle,
  AsideDetailArticleValue,
  AsideDetailFooter,
} from "@/styles/layers/aside-detail-layers.styled";

interface UpdateVolumeDetailProps {
  mode: VolumeMode;
  volumeId: number;
  onCancel: () => void;
  onSuccess: () => void;
}

export function UpdateVolumeDetail({
  mode,
  volumeId,
  onCancel,
  onSuccess,
}: UpdateVolumeDetailProps) {
  const queryClient = useQueryClient();

  const { data } = useGetVolumeDetailByMode(mode, volumeId, {
    query: { enabled: !Number.isNaN(volumeId) },
  });

  const updateVolume = useUpdateVolumeByMode(mode);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateVolumeFormType>({
    resolver: zodResolver(updateVolumeSchema),
    defaultValues: {
      volumeName: "",
      mountPath: "",
      shouldBePublic: false,
    },
  });

  const onSubmit = (formData: UpdateVolumeFormType) => {
    if (updateVolume.isPending) return;

    updateVolume.mutate(
      {
        volumeId,
        data: {
          volumeName: formData.volumeName,
          mountPath: formData.mountPath,
          shouldBePublic: formData.shouldBePublic,
        },
      },
      {
        onSuccess: () => {
          if (mode === "user") {
            queryClient.invalidateQueries({
              queryKey: getGetVolumeDetailQueryKey(volumeId),
            });
            queryClient.invalidateQueries({
              queryKey: getGetVolumeListQueryKey(),
            });
          } else {
            queryClient.invalidateQueries({
              queryKey: getAdminGetVolumeDetailQueryKey(volumeId),
            });
            queryClient.invalidateQueries({
              queryKey: getAdminGetVolumeListQueryKey(),
            });
          }
          onSuccess();
        },
      },
    );
  };

  const handleCancelClick = () => {
    if (data) {
      reset({
        volumeName: data.volumeName ?? "",
        mountPath: data.mountPath ?? "",
        shouldBePublic: data.isPublic ?? false,
      });
    }
    onCancel();
  };

  useEffect(() => {
    if (data) {
      reset({
        volumeName: data.volumeName ?? "",
        mountPath: data.mountPath ?? "",
        shouldBePublic: data.isPublic ?? false,
      });
    }
  }, [data, reset]);

  const { text: storageTypeText } = getVolumeStorageTypeInfo(data?.volumeType);
  const { text: statusText } = getVolumeStatusInfo(data?.isPublic);

  return (
    <StyledForm onFinish={handleSubmit(onSubmit)}>
      {/* 수정 가능한 기본 정보 섹션 */}
      <StyledArticleBody>
        <AsideDetailArticleItem>
          <AsideDetailArticleHeader>
            <AsideDetailArticleTitle>기본 정보</AsideDetailArticleTitle>
          </AsideDetailArticleHeader>

          <Controller
            name="volumeName"
            control={control}
            render={({ field }) => (
              <StyledFormItem
                label="볼륨 이름"
                required
                validateStatus={errors.volumeName ? "error" : undefined}
                help={errors.volumeName?.message}
              >
                <Input
                  {...field}
                  placeholder="볼륨 이름을 입력해 주세요."
                  width="100%"
                  autoComplete="off"
                  disabled={updateVolume.isPending}
                  maxLength={50}
                />
              </StyledFormItem>
            )}
          />

          <ReadOnlyFormItem>
            <AsideDetailArticleKey>스토리지 타입</AsideDetailArticleKey>
            <AsideDetailArticleValue>
              {storageTypeText || "-"}
            </AsideDetailArticleValue>
          </ReadOnlyFormItem>

          <ReadOnlyFormItem>
            <AsideDetailArticleKey>공개 설정</AsideDetailArticleKey>
            <AsideDetailArticleValue>
              {statusText || "-"}
            </AsideDetailArticleValue>
          </ReadOnlyFormItem>

          <Controller
            name="mountPath"
            control={control}
            render={({ field }) => (
              <StyledFormItem
                label="Mount Path"
                required
                validateStatus={errors.mountPath ? "error" : undefined}
                help={errors.mountPath?.message}
              >
                <Input
                  {...field}
                  placeholder="마운트 경로를 입력해 주세요. (예: /mnt/data)"
                  width="100%"
                  autoComplete="off"
                  disabled={updateVolume.isPending}
                  maxLength={1000}
                />
              </StyledFormItem>
            )}
          />
        </AsideDetailArticleItem>
        <AsideDetailArticleItem>
          <AsideDetailArticleRow>
            <AsideDetailArticleRowItem>
              <AsideDetailArticleHeader>
                <AsideDetailArticleTitle>설정 내용</AsideDetailArticleTitle>
              </AsideDetailArticleHeader>

              {data?.volumeType === "ASTRAGO" && (
                <>
                  <ReadOnlyFormItem>
                    <AsideDetailArticleKey>스토리지</AsideDetailArticleKey>
                    <AsideDetailArticleValue>
                      {data?.storageName || "-"}
                    </AsideDetailArticleValue>
                  </ReadOnlyFormItem>
                  <ReadOnlyFormItem>
                    <AsideDetailArticleKey>파일 용량</AsideDetailArticleKey>
                    <AsideDetailArticleValue>
                      {data?.fileSizeByte
                        ? formatFileSize(data?.fileSizeByte).formatted
                        : "-"}
                    </AsideDetailArticleValue>
                  </ReadOnlyFormItem>
                </>
              )}

              {data?.volumeType === "ON_PREMISE" && (
                <>
                  <ReadOnlyFormItem>
                    <AsideDetailArticleKey>Server IP</AsideDetailArticleKey>
                    <AsideDetailArticleValue>
                      {data?.serverIp || "-"}
                    </AsideDetailArticleValue>
                  </ReadOnlyFormItem>
                  <ReadOnlyFormItem>
                    <AsideDetailArticleKey>Server Path</AsideDetailArticleKey>
                    <AsideDetailArticleValue>
                      {data?.volumePath || "-"}
                    </AsideDetailArticleValue>
                  </ReadOnlyFormItem>
                </>
              )}
            </AsideDetailArticleRowItem>

            <AsideDetailArticleRowItem>
              <AsideDetailArticleHeader>
                <AsideDetailArticleTitle>생성 정보</AsideDetailArticleTitle>
              </AsideDetailArticleHeader>

              <ReadOnlyFormItem>
                <AsideDetailArticleKey>생성자</AsideDetailArticleKey>
                <AsideDetailArticleValue>
                  {data?.creatorName || "-"}
                </AsideDetailArticleValue>
              </ReadOnlyFormItem>

              <ReadOnlyFormItem>
                <AsideDetailArticleKey>생성일</AsideDetailArticleKey>
                <AsideDetailArticleValue>
                  {formatDateSafely(data?.createdAt)}
                </AsideDetailArticleValue>
              </ReadOnlyFormItem>
            </AsideDetailArticleRowItem>
          </AsideDetailArticleRow>
        </AsideDetailArticleItem>
      </StyledArticleBody>

      <Footer>
        <Button
          width={112}
          variant="outlined"
          onClick={handleCancelClick}
          disabled={updateVolume.isPending}
        >
          취소
        </Button>
        <Button
          type="submit"
          color="primary"
          icon="Check"
          iconPosition="left"
          iconSize={20}
          size="medium"
          variant="gradient"
          width="100%"
          loading={updateVolume.isPending}
        >
          저장
        </Button>
      </Footer>
    </StyledForm>
  );
}

const StyledForm = styled(Form)`
  height: 100%;

  & form {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
`;

const StyledArticleBody = styled(AsideDetailArticleBody)`
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background-color: #fcfcfc;

  & + & {
    margin-top: 10px;
  }
`;

const StyledFormItem = styled(FormItem)`
  margin-bottom: 10px !important;
`;

const ReadOnlyFormItem = styled(AsideDetailArticleColumn)`
  &.last {
    margin-bottom: 10px;
  }

  & + & {
    margin-top: 10px;
  }
`;

const Footer = styled(AsideDetailFooter)`
  flex: 1;
  flex-shrink: 0;
  align-items: flex-end;
`;
