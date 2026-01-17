"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import styled from "styled-components";
import { Form, FormItem, Icon, Input, Modal } from "xiilab-ui";

import { useCompress } from "@/api/generated/volume/volume";
import {
  type CompressVolumeFileFormType,
  compressVolumeFileSchema,
} from "@/domain/volume/schemas/volume.schema";
import { openCompressVolumeFileModalAtom } from "@/domain/volume/state/volume.atom";
import { VOLUME_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

// ============================================================================
// Types
// ============================================================================

interface CompressVolumeFileEventData {
  volumeId: number;
  filePaths: string[];
}

// ============================================================================
// Component
// ============================================================================

export function CompressVolumeFileModal() {
  // ---------------------------------------------------------------------------
  // State & Hooks
  // ---------------------------------------------------------------------------

  const { open, onOpen, onClose } = useGlobalModal(
    openCompressVolumeFileModalAtom,
  );

  const [volumeId, setVolumeId] = useState<number | null>(null);
  const [filePaths, setFilePaths] = useState<string[]>([]);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CompressVolumeFileFormType>({
    resolver: zodResolver(compressVolumeFileSchema),
    defaultValues: {
      destinationPath: "",
      compressFileType: "ZIP",
    },
  });

  const { mutate, isPending } = useCompress();

  const selectedCompressType = watch("compressFileType");

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  /**
   * 모달 닫기 처리
   * 압축 진행 중(isPending)일 때는 닫기를 방지합니다.
   */
  const handleCancel = () => {
    if (isPending) return;
    onClose();
  };

  /**
   * 폼 제출 핸들러
   * 유효성 검증 통과 후 압축 API를 호출합니다.
   */
  const onSubmit = (data: CompressVolumeFileFormType) => {
    if (!volumeId) return;

    mutate(
      {
        volumeId,
        data: {
          paths: filePaths,
          destinationPath: data.destinationPath,
          compressFileType: data.compressFileType,
        },
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  // ---------------------------------------------------------------------------
  // Subscriptions
  // ---------------------------------------------------------------------------

  useSubscribe<CompressVolumeFileEventData>(
    VOLUME_EVENTS.sendCompressVolumeFile,
    (eventData) => {
      setVolumeId(eventData.volumeId);
      setFilePaths(eventData.filePaths);

      setValue("destinationPath", "");
      setValue("compressFileType", "ZIP");

      onOpen();
    },
  );

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <Modal
      modalWidth={370}
      type="primary"
      icon={<Icon name="Compress" color="#fff" size={18} />}
      open={open}
      closable
      title="파일 압축"
      onCancel={handleCancel}
      showCancelButton
      cancelText="취소"
      okText="압축"
      onOk={handleSubmit(onSubmit)}
      centered
      showHeaderBorder
      okButtonProps={{ loading: isPending }}
    >
      <Form>
        <Controller
          name="destinationPath"
          control={control}
          render={({ field }) => (
            <FormItem
              label="압축 파일 저장 경로"
              htmlFor="destinationPath"
              validateStatus={errors.destinationPath ? "error" : undefined}
              help={errors.destinationPath?.message}
            >
              <Input
                {...field}
                type="text"
                id="destinationPath"
                placeholder="압축 파일이 저장될 경로를 입력해주세요."
                width="100%"
                disabled={isPending}
                maxLength={1000}
                autoComplete="off"
              />
            </FormItem>
          )}
        />

        <FormItem label="압축 유형">
          <SelectFileCompression>
            <FileCompressionButton
              type="button"
              $isSelected={selectedCompressType === "ZIP"}
              onClick={() => setValue("compressFileType", "ZIP")}
              disabled={isPending}
            >
              ZIP
            </FileCompressionButton>
            <FileCompressionButton
              type="button"
              $isSelected={selectedCompressType === "TAR"}
              onClick={() => setValue("compressFileType", "TAR")}
              disabled={isPending}
            >
              TAR
            </FileCompressionButton>
          </SelectFileCompression>
        </FormItem>
      </Form>
    </Modal>
  );
}

// ============================================================================
// Styled Components
// ============================================================================

const SelectFileCompression = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
`;

const FileCompressionButton = styled.button<{ $isSelected: boolean }>`
  flex: 1;
  height: 40px;
  border-radius: 2px;
  border: 1px solid ${({ $isSelected }) => ($isSelected ? "#1f5bff" : "#e0e5f0")};
  background-color: ${({ $isSelected }) =>
    $isSelected ? "rgba(31, 91, 255, 0.05)" : "transparent"};
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  color: ${({ $isSelected }) => ($isSelected ? "#1f5bff" : "#000")};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    border-color: #1f5bff;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;
