"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Form, FormItem, Icon, Input, Modal, Upload } from "xiilab-ui";

import { useWorkloadFileUpload } from "@/domain/workload/hooks/use-workload-file-upload";
import {
  type UploadWorkloadFileFormType,
  uploadWorkloadFileSchema,
} from "@/domain/workload/schemas/workload.schema";
import { UploadFileList } from "@/shared/components/upload/upload-file-list";
import { WORKLOAD_EVENTS } from "@/shared/constants/pubsub.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";
import { LastFormItem } from "@/styles/layers/form-layer.styled";

interface UploadWorkloadFilePayload {
  workspaceId: number;
  workloadResourceName: string;
  podName?: string;
}

export function UploadWorkloadFileModal() {
  const [open, setOpen] = useState(false);
  const [workspaceId, setWorkspaceId] = useState<number>(0);
  const [workloadResourceName, setWorkloadResourceName] = useState("");
  const [podName, setPodName] = useState<string | undefined>(undefined);

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<UploadWorkloadFileFormType>({
    resolver: zodResolver(uploadWorkloadFileSchema),
    defaultValues: { uploadPath: "/" },
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
  } = useWorkloadFileUpload({
    workspaceId,
    workloadResourceName,
    uploadPath,
    podName,
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
    reset();
    setOpen(false);
  };

  const handleCancel = () => {
    if (isUploading) return;
    resetModal();
  };

  const onSubmit = async () => {
    if (!workspaceId || !workloadResourceName || !hasPendingFiles) return;
    await startUpload();
  };

  const handleStopUpload = async () => {
    await cancelAllUploads();
    resetModal();
  };

  const handleRemove = (fileId: string) => {
    removeFile(fileId);
  };

  useSubscribe<UploadWorkloadFilePayload>(
    WORKLOAD_EVENTS.openUploadFileModal,
    (payload) => {
      setWorkspaceId(payload.workspaceId);
      setWorkloadResourceName(payload.workloadResourceName);
      setPodName(payload.podName);
      reset();
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
      keyboard={!isUploading}
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
                placeholder="/"
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
