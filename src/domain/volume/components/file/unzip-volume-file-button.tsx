"use client";

import { useAtomValue } from "jotai";
import { toast } from "react-toastify";
import styled from "styled-components";

import { volumeFileCheckedNodesInfoAtom } from "@/domain/volume/state/volume.atom";
import { VOLUME_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import { myDropdownButtonStyle } from "@/styles/mixins/button";

// ============================================================================
// Constants
// ============================================================================

/** 압축 파일 확장자 목록 */
const COMPRESSED_FILE_EXTENSIONS = [".zip", ".tar", ".tar.gz", ".tgz"];

// ============================================================================
// Utils
// ============================================================================

/**
 * 파일 경로가 압축 파일인지 확인
 * @param path - 파일 경로
 * @returns 압축 파일 여부
 */
const isCompressedFile = (path: string): boolean => {
  const lowerPath = path.toLowerCase();
  return COMPRESSED_FILE_EXTENSIONS.some((ext) => lowerPath.endsWith(ext));
};

// ============================================================================
// Types
// ============================================================================

interface UnzipVolumeFileButtonProps {
  volumeId: number;
}

// ============================================================================
// Component
// ============================================================================

/**
 * 볼륨 파일 압축 해제 버튼 컴포넌트
 *
 * 선택된 파일을 압축 해제하는 기능을 제공합니다.
 * - 단일 파일만 선택 가능
 * - .zip, .tar, .tar.gz, .tgz 확장자만 압축 해제 가능
 *
 * @param volumeId - 볼륨 ID
 * @returns 압축 해제 버튼 JSX 요소
 */
export function UnzipVolumeFileButton({
  volumeId,
}: UnzipVolumeFileButtonProps) {
  const publish = usePublish();
  const checkedNodesInfo = useAtomValue(volumeFileCheckedNodesInfoAtom);

  /**
   * 압축 해제 버튼 클릭 핸들러
   * 유효성 검사 후 압축 해제 이벤트를 발행합니다.
   */
  const handleClick = () => {
    // 단일 선택 검증
    if (checkedNodesInfo.length !== 1) {
      toast.warning("압축 해제는 파일 하나만 선택할 수 있습니다.");
      return;
    }

    const selectedNode = checkedNodesInfo[0];

    // 압축 파일 확장자 검증
    if (!isCompressedFile(selectedNode.path)) {
      toast.warning(
        "압축 파일(.zip, .tar, .tar.gz, .tgz)만 압축 해제할 수 있습니다.",
      );
      return;
    }

    // 압축 해제 이벤트 발행
    publish(VOLUME_EVENTS.sendDecompressVolumeFile, {
      volumeId,
      filePath: selectedNode.path,
    });
  };

  return (
    <StyledButton
      type="button"
      onClick={handleClick}
      disabled={checkedNodesInfo.length === 0}
    >
      압축 해제
    </StyledButton>
  );
}

// ============================================================================
// Styled Components
// ============================================================================

const StyledButton = styled.button`
  ${myDropdownButtonStyle}
`;
