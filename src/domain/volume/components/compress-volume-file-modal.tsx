"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSetAtom } from "jotai";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import styled from "styled-components";
import { Form, FormItem, Icon, Input, Modal, Typography } from "xiilab-ui";

import { useCompressFiles } from "@/api/generated/volume-file/volume-file";
import {
  type CompressVolumeFileFormType,
  compressVolumeFileSchema,
} from "@/domain/volume/schemas/volume.schema";
import { volumeFileCheckedNodesAtom } from "@/domain/volume/state/volume.atom";
import { GuideTooltip } from "@/shared/components/tooltip/guide-tooltip";
import { VOLUME_EVENTS } from "@/shared/constants/pubsub.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";
import { filterToRootPaths } from "@/shared/state/filetree.atom";
import { FormItemLabel, LastFormItem } from "@/styles/layers/form-layer.styled";

interface CompressVolumeFilePayload {
  volumeId: number;
  filePaths: string[];
}

const DEFAULT_VALUES: CompressVolumeFileFormType = {
  destinationPath: "",
  compressFileType: "ZIP",
};

export function CompressVolumeFileModal() {
  const [open, setOpen] = useState(false);
  const setCheckedNodes = useSetAtom(volumeFileCheckedNodesAtom);

  const [volumeId, setVolumeId] = useState<number | null>(null);
  const [filePaths, setFilePaths] = useState<string[]>([]);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CompressVolumeFileFormType>({
    resolver: zodResolver(compressVolumeFileSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const { mutate, isPending } = useCompressFiles();
  const selectedCompressType = watch("compressFileType");

  const handleCancel = () => {
    if (isPending) return;
    setOpen(false);
  };

  const onSubmit = (data: CompressVolumeFileFormType) => {
    if (isPending) return;
    if (volumeId == null || filePaths.length === 0) return;

    const filteredPaths = filterToRootPaths(filePaths);
    if (filteredPaths.length === 0) {
      toast.info("압축할 파일이 없습니다.");
      return;
    }

    mutate(
      {
        volumeId,
        data: {
          paths: filteredPaths,
          destinationPath: data.destinationPath,
          compressFileType: data.compressFileType,
        },
      },
      {
        onSuccess: () => {
          setCheckedNodes(new Set());
          setOpen(false);
        },
      },
    );
  };

  useSubscribe<CompressVolumeFilePayload>(
    VOLUME_EVENTS.openCompressFileModal,
    (eventData) => {
      setVolumeId(eventData.volumeId);
      setFilePaths(eventData.filePaths);
      reset(DEFAULT_VALUES);
      setOpen(true);
    },
  );

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
      cancelButtonProps={{ disabled: isPending }}
    >
      <Form>
        <Controller
          name="destinationPath"
          control={control}
          render={({ field }) => (
            <FormItem
              label={
                <FormItemLabel>
                  압축 파일 저장 경로
                  <GuideTooltip
                    title={
                      <Typography.Text variant="body-3-3" color="#000">
                        확장자를 제외한 압축 파일명까지 입력해야 합니다.
                        <br />
                        예: /mnt/volume/output/result 입력 시 output 폴더에
                        result.zip 생성
                      </Typography.Text>
                    }
                    iconSize={18}
                    maxWidth={350}
                    placement="right"
                  />
                </FormItemLabel>
              }
              htmlFor="destinationPath"
              required
              validateStatus={errors.destinationPath ? "error" : undefined}
              help={errors.destinationPath?.message}
            >
              <Input
                {...field}
                type="text"
                id="destinationPath"
                placeholder="/mnt/volume/output/result"
                width="100%"
                disabled={isPending}
                maxLength={1000}
                autoComplete="off"
              />
            </FormItem>
          )}
        />

        <LastFormItem label="압축 유형">
          <SelectFileCompression>
            <FileCompressionButton
              type="button"
              aria-pressed={selectedCompressType === "ZIP"}
              $isSelected={selectedCompressType === "ZIP"}
              onClick={() => setValue("compressFileType", "ZIP")}
              disabled={isPending}
            >
              ZIP
            </FileCompressionButton>
            <FileCompressionButton
              type="button"
              aria-pressed={selectedCompressType === "TAR"}
              $isSelected={selectedCompressType === "TAR"}
              onClick={() => setValue("compressFileType", "TAR")}
              disabled={isPending}
            >
              TAR
            </FileCompressionButton>
          </SelectFileCompression>
        </LastFormItem>
      </Form>
    </Modal>
  );
}

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
