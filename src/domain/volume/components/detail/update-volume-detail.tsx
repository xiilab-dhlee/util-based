"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import styled from "styled-components";
import { Button, Dropdown, Form, FormItem, Input } from "xiilab-ui";

import {
  getGetVolumeDetailQueryKey,
  getGetVolumeListQueryKey,
  useGetVolumeDetail,
  useUpdateVolume,
} from "@/api/generated/volume/volume";
import {
  type UpdateVolumeFormType,
  updateVolumeSchema,
} from "@/domain/volume/schemas/volume.schema";
import { VISIBILITY_STATUS_OPTIONS } from "@/shared/constants/core.constant";
import {
  AsideDetailArticleBody,
  AsideDetailArticleHeader,
  AsideDetailArticleItem,
  AsideDetailArticleTitle,
  AsideDetailFooter,
} from "@/styles/layers/aside-detail-layers.styled";

interface UpdateVolumeDetailProps {
  volumeId: number;
  onCancel: () => void;
  onSuccess: () => void;
}

/**
 * 볼륨 상세 정보 수정 폼 컴포넌트
 *
 * 볼륨 이름, 공개 설정, Mount Path를 수정할 수 있습니다.
 */
export function UpdateVolumeDetail({
  volumeId,
  onCancel,
  onSuccess,
}: UpdateVolumeDetailProps) {
  const queryClient = useQueryClient();

  const { data } = useGetVolumeDetail(volumeId, {
    query: { enabled: !Number.isNaN(volumeId) },
  });

  const updateVolume = useUpdateVolume();

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
      isPublic: false,
    },
  });

  const handleFormSubmit = (formData: UpdateVolumeFormType) => {
    updateVolume.mutate(
      {
        volumeId,
        data: formData,
      },
      {
        onSuccess: () => {
          toast.success("볼륨 수정 성공");
          queryClient.invalidateQueries({
            queryKey: getGetVolumeDetailQueryKey(volumeId),
          });
          queryClient.invalidateQueries({
            queryKey: getGetVolumeListQueryKey(),
          });
          onSuccess();
        },
      },
    );
  };

  const handleCancelClick = () => {
    if (data) {
      reset({
        volumeName: data.volumeName || "",
        mountPath: data.mountPath || "",
        isPublic: data.isPublic ?? false,
      });
    }
    onCancel();
  };

  useEffect(() => {
    if (data) {
      reset({
        volumeName: data.volumeName || "",
        mountPath: data.mountPath || "",
        isPublic: data.isPublic ?? false,
      });
    }
  }, [data, reset]);

  return (
    <StyledForm onFinish={handleSubmit(handleFormSubmit)}>
      <StyledFormBody>
        <AsideDetailArticleItem>
          <AsideDetailArticleHeader>
            <AsideDetailArticleTitle>기본 정보 수정</AsideDetailArticleTitle>
          </AsideDetailArticleHeader>

          <Controller
            name="volumeName"
            control={control}
            render={({ field }) => (
              <FormItem
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
                />
              </FormItem>
            )}
          />

          <Controller
            name="isPublic"
            control={control}
            render={({ field }) => (
              <FormItem
                label="공개 설정"
                required
                validateStatus={errors.isPublic ? "error" : undefined}
                help={errors.isPublic?.message}
              >
                <Dropdown
                  options={VISIBILITY_STATUS_OPTIONS}
                  onChange={(value) => field.onChange(value === "PUBLIC")}
                  value={field.value ? "PUBLIC" : "PRIVATE"}
                  width="100%"
                  placeholder="공개 설정을 선택해 주세요."
                  disabled={updateVolume.isPending}
                />
              </FormItem>
            )}
          />

          <Controller
            name="mountPath"
            control={control}
            render={({ field }) => (
              <FormItem
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
                />
              </FormItem>
            )}
          />
        </AsideDetailArticleItem>
      </StyledFormBody>

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
          상세 정보 저장
        </Button>
      </Footer>
    </StyledForm>
  );
}

const StyledForm = styled(Form)`
  gap: 16px;
  height: 100%;

  & form {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
`;

const StyledFormBody = styled(AsideDetailArticleBody)`
  flex: 1;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background-color: #fcfcfc;
`;

const Footer = styled(AsideDetailFooter)`
  align-items: flex-end;
  flex: 1;
`;
