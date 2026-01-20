"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Form, FormItem, Icon, Input, Modal, Upload } from "xiilab-ui";

import { useVolumeTusUpload } from "@/domain/volume/hooks/use-volume-tus-upload";
import {
  type UploadVolumeFileFormType,
  uploadVolumeFileSchema,
} from "@/domain/volume/schemas/volume.schema";
import { UploadFileList } from "@/shared/components/upload/upload-file-list";
import { VOLUME_EVENTS } from "@/shared/constants/pubsub.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";
import { LastFormItem } from "@/styles/layers/form-layer.styled";

interface UploadVolumeFilePayload {
  volumeId: number;
}

const DEFAULT_VALUES: UploadVolumeFileFormType = {
  uploadPath: "",
};

export function UploadVolumeFileModal() {
  const [open, setOpen] = useState(false);
  const [volumeId, setVolumeId] = useState<number | null>(null);

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<UploadVolumeFileFormType>({
    resolver: zodResolver(uploadVolumeFileSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const uploadPath = watch("uploadPath");

  const {
    files,
    isUploading,
    addFiles,
    removeFile,
    startUpload,
    cancelAllUploads,
    clearFiles,
  } = useVolumeTusUpload({
    volumeId: volumeId ?? 0,
    uploadPath,
  });

  const hasFiles = files.length > 0;
  const hasPendingFiles = files.some(
    (f) => f.status === "pending" || f.status === "error",
  );
  const totalProgress =
    files.length > 0
      ? files.reduce((sum, f) => sum + f.progress, 0) / files.length
      : 0;

  const resetModal = () => {
    clearFiles();
    reset(DEFAULT_VALUES);
    setOpen(false);
  };

  const handleCancel = () => {
    if (isUploading) return;
    resetModal();
  };

  const onSubmit = async () => {
    if (!volumeId || !hasPendingFiles) return;
    await startUpload();
  };

  const handleStopUpload = async () => {
    await cancelAllUploads();
    resetModal();
  };

  const handleRemove = (fileId: string) => {
    removeFile(fileId);
  };

  useSubscribe<UploadVolumeFilePayload>(
    VOLUME_EVENTS.openUploadFileModal,
    (eventData) => {
      setVolumeId(eventData.volumeId);
      reset(DEFAULT_VALUES);
      clearFiles();
      setOpen(true);
    },
  );

  return (
    <Modal
      modalWidth={500}
      type="primary"
      icon={<Icon name="Upload" color="#fff" size={18} />}
      open={open}
      closable={!isUploading}
      maskClosable={!isUploading}
      title="파일 업로드"
      onCancel={handleCancel}
      cancelText={isUploading ? "업로드 취소" : "취소"}
      okText="업로드"
      okButtonProps={{
        disabled: !hasFiles || !hasPendingFiles || isUploading,
      }}
      cancelButtonProps={{
        onClick: isUploading ? handleStopUpload : handleCancel,
      }}
      onOk={handleSubmit(onSubmit)}
      centered
      showHeaderBorder
    >
      <Form>
        <Controller
          name="uploadPath"
          control={control}
          render={({ field }) => (
            <FormItem
              label="업로드 경로"
              htmlFor="uploadPath"
              required
              validateStatus={errors.uploadPath ? "error" : undefined}
              help={errors.uploadPath?.message}
            >
              <Input
                {...field}
                type="text"
                id="uploadPath"
                placeholder="/mnt/volume/uploads"
                width="100%"
                disabled={isUploading}
                maxLength={1000}
                autoComplete="off"
              />
            </FormItem>
          )}
        />
        <LastFormItem label="파일 선택">
          <Upload
            onUpload={addFiles}
            disabled={isUploading}
            multiple
            showFileList={false}
            hintText="파일을 드래그하거나 클릭하여 선택하세요"
          />
        </LastFormItem>

        {hasFiles && (
          <UploadFileList
            files={files}
            totalProgress={totalProgress}
            isUploading={isUploading}
            onRemove={handleRemove}
          />
        )}
      </Form>
    </Modal>
  );
}
