"use client";

import { useSetAtom } from "jotai";
import { useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { Form, FormItem, Icon, Modal } from "xiilab-ui";

import type { DownloadRequestCompressType } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { volumeFileCheckedNodesAtom } from "@/domain/volume/state/volume.atom";
import type { VolumeMode } from "@/domain/volume/types/volume.type";
import { AxiosService } from "@/shared/api/axios";
import { VOLUME_EVENTS } from "@/shared/constants/pubsub.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";
import { filterToRootPaths } from "@/shared/state/filetree.atom";

interface DownloadVolumeFilePayload {
  volumeId: number;
  filePaths: string[];
}

interface DownloadVolumeFileModalProps {
  mode: VolumeMode;
}

export function DownloadVolumeFileModal({
  mode,
}: DownloadVolumeFileModalProps) {
  const [open, setOpen] = useState(false);
  const setCheckedNodes = useSetAtom(volumeFileCheckedNodesAtom);

  const [volumeId, setVolumeId] = useState<number | null>(null);
  const [filePaths, setFilePaths] = useState<string[]>([]);
  const [selectedType, setSelectedType] =
    useState<DownloadRequestCompressType>("ZIP");
  const [isPending, setIsPending] = useState(false);

  const handleCancel = () => {
    if (isPending) return;
    setOpen(false);
  };

  const handleDownload = async () => {
    if (isPending) return;

    if (volumeId === null || filePaths.length === 0) return;

    const filteredPaths = filterToRootPaths(filePaths);
    if (filteredPaths.length === 0) {
      toast.info("다운로드할 파일이 없습니다.");
      return;
    }

    setIsPending(true);

    try {
      const axiosInstance = AxiosService.getInstance().getAxios();
      const endpoint =
        mode === "user"
          ? `/api/v1/volumes/${volumeId}/files/download`
          : `/api/v1/admin/volumes/${volumeId}/files/download`;
      const response = await axiosInstance.post<Blob>(
        endpoint,
        { paths: filteredPaths, compressType: selectedType },
        { responseType: "blob" },
      );

      const blob = new Blob([response.data], {
        type: selectedType === "ZIP" ? "application/zip" : "application/x-tar",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      try {
        link.href = url;
        link.download = `download.${selectedType.toLowerCase()}`;
        document.body.appendChild(link);
        link.click();
      } finally {
        // DOM 및 Blob URL 정리 (에러 발생 시에도 실행)
        if (link.parentNode) {
          document.body.removeChild(link);
        }
        window.URL.revokeObjectURL(url);
      }

      toast.success("파일 다운로드가 완료되었습니다.");
      setCheckedNodes(new Set());
      setOpen(false);
    } catch {
      toast.error("파일 다운로드에 실패했습니다.");
    } finally {
      setIsPending(false);
    }
  };

  useSubscribe<DownloadVolumeFilePayload>(
    VOLUME_EVENTS.openDownloadFileModal,
    (eventData) => {
      setVolumeId(eventData.volumeId);
      setFilePaths(eventData.filePaths);
      setSelectedType("ZIP");
      setOpen(true);
    },
  );

  return (
    <Modal
      modalWidth={370}
      type="primary"
      icon={<Icon name="Download" color="#fff" size={18} />}
      open={open}
      closable={!isPending}
      maskClosable={!isPending}
      keyboard={!isPending}
      title="파일 다운로드"
      onCancel={handleCancel}
      showCancelButton
      cancelText="취소"
      okText="다운로드"
      onOk={handleDownload}
      centered
      showHeaderBorder
      okButtonProps={{ loading: isPending }}
      cancelButtonProps={{ disabled: isPending }}
    >
      <Form>
        <FormItem label="다운로드 압축 형식">
          <SelectFileCompression>
            <FileCompressionButton
              type="button"
              $isSelected={selectedType === "ZIP"}
              onClick={() => setSelectedType("ZIP")}
              disabled={isPending}
            >
              ZIP
            </FileCompressionButton>
            <FileCompressionButton
              type="button"
              $isSelected={selectedType === "TAR"}
              onClick={() => setSelectedType("TAR")}
              disabled={isPending}
            >
              TAR
            </FileCompressionButton>
          </SelectFileCompression>
        </FormItem>
      </Form>
      <Description>
        선택한 {filePaths.length}개의 파일을 {selectedType} 형식으로
        다운로드합니다.
      </Description>
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

const Description = styled.p`
  margin-top: 16px;
  font-size: 13px;
  color: #666;
  text-align: center;
`;
