"use client";

import { useState } from "react";
import { Form, FormItem, Icon, Input, Modal, Upload } from "xiilab-ui";

import { useVolumeTusUpload } from "@/domain/volume/hooks/use-volume-tus-upload";
import { openUploadVolumeFileModalAtom } from "@/domain/volume/state/volume.atom";
import { UploadFileList } from "@/shared/components/upload/upload-file-list";
import { VOLUME_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

interface UploadVolumeFileEventData {
  volumeId: number;
}

export function UploadVolumeFileModal() {
  const { open, onOpen, onClose } = useGlobalModal(
    openUploadVolumeFileModalAtom,
  );
  const [volumeId, setVolumeId] = useState<number | null>(null);
  const [uploadPath, setUploadPath] = useState("/");

  const {
    files,
    isUploading,
    addFiles,
    removeFile,
    startSingleUpload,
    cancelUpload,
    clearFiles,
  } = useVolumeTusUpload({
    volumeId: volumeId ?? 0,
    uploadPath,
  });

  const hasFiles = files.length > 0;
  const totalProgress =
    files.length > 0
      ? files.reduce((sum, f) => sum + f.progress, 0) / files.length
      : 0;

  const resetModal = () => {
    clearFiles();
    setUploadPath("/");
    onClose();
  };

  const handleClose = () => {
    if (isUploading) return;
    resetModal();
  };

  const handleUpload = (fileId: string) => {
    if (!volumeId) return;
    startSingleUpload(fileId);
  };

  const handleCancel = (fileId: string) => {
    cancelUpload(fileId);
  };

  const handleRemove = (fileId: string) => {
    removeFile(fileId);
  };

  useSubscribe<UploadVolumeFileEventData>(
    VOLUME_EVENTS.sendUploadVolumeFile,
    (eventData) => {
      setVolumeId(eventData.volumeId);
      setUploadPath("/");
      clearFiles();
      onOpen();
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
      onCancel={handleClose}
      showCancelButton={false}
      okButtonProps={{ style: { display: "none" } }}
      centered
      showHeaderBorder
    >
      <Form>
        <FormItem label="업로드 경로" htmlFor="uploadPath">
          <Input
            type="text"
            id="uploadPath"
            value={uploadPath}
            onChange={(e) => setUploadPath(e.target.value)}
            placeholder="파일을 업로드할 경로를 입력해주세요."
            width="100%"
            disabled={isUploading}
            maxLength={1000}
            autoComplete="off"
          />
        </FormItem>

        <FormItem label="파일 선택">
          <Upload
            onUpload={addFiles}
            disabled={isUploading}
            multiple
            showFileList={false}
            hintText="파일을 드래그하거나 클릭하여 선택하세요"
          />
        </FormItem>

        {hasFiles && (
          <UploadFileList
            files={files}
            totalProgress={totalProgress}
            isUploading={isUploading}
            onUpload={handleUpload}
            onCancel={handleCancel}
            onRemove={handleRemove}
          />
        )}
      </Form>
    </Modal>
  );
}
