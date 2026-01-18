"use client";

import { useSetAtom } from "jotai";
import { useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { Form, FormItem, Icon, Modal } from "xiilab-ui";

import {
  openDownloadVolumeFileModalAtom,
  volumeFileCheckedNodesAtom,
} from "@/domain/volume/state/volume.atom";
import { VOLUME_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";
import { filterToRootPaths } from "@/shared/state/filetree.atom";

// ============================================================================
// Types
// ============================================================================

/** 다운로드 압축 파일 타입 */
type DownloadFileType = "ZIP" | "TAR";

/** 다운로드 모달 이벤트 데이터 */
interface DownloadVolumeFileEventData {
  volumeId: number;
  filePaths: string[];
}

// ============================================================================
// Component
// ============================================================================

/**
 * 볼륨 파일 다운로드 모달 컴포넌트
 *
 * 선택한 파일들을 압축하여 다운로드할 수 있는 모달입니다.
 * ZIP 또는 TAR 형식을 선택할 수 있습니다.
 */
export function DownloadVolumeFileModal() {
  // ---------------------------------------------------------------------------
  // State & Hooks
  // ---------------------------------------------------------------------------

  const { open, onOpen, onClose } = useGlobalModal(
    openDownloadVolumeFileModalAtom,
  );

  const setCheckedNodes = useSetAtom(volumeFileCheckedNodesAtom);

  const [volumeId, setVolumeId] = useState<number | null>(null);
  const [filePaths, setFilePaths] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<DownloadFileType>("ZIP");
  const [isPending, setIsPending] = useState(false);

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  /**
   * 모달 닫기 처리
   * 다운로드 진행 중(isPending)일 때는 닫기를 방지합니다.
   */
  const handleCancel = () => {
    if (isPending) return;
    onClose();
  };

  /**
   * 다운로드 버튼 클릭 핸들러
   * 선택한 파일들을 압축하여 다운로드합니다.
   */
  const handleDownload = async () => {
    if (!volumeId || filePaths.length === 0) return;

    // 상위 폴더 경로만 추출
    const filteredPaths = filterToRootPaths(filePaths);

    setIsPending(true);

    try {
      // TODO: API 연동 후 실제 다운로드 로직 구현
      // const response = await downloadVolumeFiles(volumeId, {
      //   paths: filteredPaths,
      //   compressFileType: selectedType,
      // });
      //
      // // Blob으로 변환하여 다운로드
      // const blob = new Blob([response], {
      //   type: selectedType === "ZIP" ? "application/zip" : "application/x-tar",
      // });
      // const url = window.URL.createObjectURL(blob);
      // const link = document.createElement("a");
      // link.href = url;
      // link.download = `download.${selectedType.toLowerCase()}`;
      // document.body.appendChild(link);
      // link.click();
      // document.body.removeChild(link);
      // window.URL.revokeObjectURL(url);

      console.log("다운로드 요청:", { volumeId, filteredPaths, selectedType });
      toast.info("다운로드 API가 준비 중입니다.");

      setCheckedNodes(new Set());
      onClose();
    } catch (error) {
      console.error("다운로드 실패:", error);
      toast.error("파일 다운로드에 실패했습니다.");
    } finally {
      setIsPending(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Subscriptions
  // ---------------------------------------------------------------------------

  useSubscribe<DownloadVolumeFileEventData>(
    VOLUME_EVENTS.sendDownloadVolumeFile,
    (eventData) => {
      setVolumeId(eventData.volumeId);
      setFilePaths(eventData.filePaths);
      setSelectedType("ZIP");
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
      icon={<Icon name="Download" color="#fff" size={18} />}
      open={open}
      closable
      title="파일 다운로드"
      onCancel={handleCancel}
      showCancelButton
      cancelText="취소"
      okText="다운로드"
      onOk={handleDownload}
      centered
      showHeaderBorder
      okButtonProps={{ loading: isPending }}
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

const Description = styled.p`
  margin-top: 16px;
  font-size: 13px;
  color: #666;
  text-align: center;
`;
