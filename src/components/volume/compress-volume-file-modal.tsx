"use client";

import { useState } from "react";
import styled from "styled-components";
import { Icon, InfoModal } from "xiilab-ui";

import { openCompressVolumeFileModalAtom } from "@/atoms/volume/volume-list.atom";
import { VOLUME_EVENTS } from "@/constants/common/pubsub.constant";
import { useGlobalModal } from "@/hooks/common/use-global-modal";
import { useSubscribe } from "@/hooks/common/use-pub-sub";
import { useCompressVolumeFile } from "@/hooks/volume/use-compress-volume-file";
import type { CoreFileCompressionType } from "@/types/common/core.interface";
import { FormLabel } from "../common/form/form-label";

export function CompressVolumeFileModal() {
  // 모달 상태 관리
  const { open, onOpen, onClose } = useGlobalModal(
    openCompressVolumeFileModalAtom,
  );
  // 압축할 파일 경로 목록
  const [filePaths, setFilePaths] = useState<string[]>([]);

  const compressVolumeFile = useCompressVolumeFile();

  /**
   * 스토리지 타입 카드 클릭 핸들러
   *
   * @param type - 선택된 스토리지 타입
   */
  const handleClickCompressionType = (
    compressFileType: CoreFileCompressionType,
  ) => {
    compressVolumeFile.mutate({
      filePaths,
      compressFileType,
    });
  };

  useSubscribe(
    VOLUME_EVENTS.sendCompressVolumeFile,
    (eventData: any) => {
      setFilePaths(eventData.filePaths);
      onOpen();
    },
  );

  return (
    <InfoModal
      modalWidth={370}
      type="primary"
      icon={<Icon name="Compress" color="#fff" size={18} />}
      open={open}
      closable
      title="파일 압축"
      onClose={onClose}
      showHeaderBorder
      centered
    >
      <Container>
        <FormLabel>압축할 유형을 선택해주세요.</FormLabel>
        <SelectFileCompression>
          <FileCompressionButton
            onClick={() => handleClickCompressionType("ZIP")}
          >
            ZIP 압축
          </FileCompressionButton>
          <FileCompressionButton
            onClick={() => handleClickCompressionType("TAR")}
          >
            TAR 압축
          </FileCompressionButton>
        </SelectFileCompression>
      </Container>
    </InfoModal>
  );
}

/**
 * 스토리지 타입 카드들을 감싸는 스타일드 컴포넌트
 *
 * 카드들을 가로로 배치하고 적절한 간격을 제공합니다.
 */
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SelectFileCompression = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
`;

const FileCompressionButton = styled.button`
  flex: 1;
  height: 50px;
  border-radius: 2px;
  border: 1px solid #e0e5f0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  color: #000;

  &:hover {
    border-color: #1f5bff;
    outline: 1px solid rgba(54, 107, 255, 0.1) !important;
  }
`;
