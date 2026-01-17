"use client";

import { useAtomValue } from "jotai";
import styled from "styled-components";

import { volumeFileSelectedNodeInfoAtom } from "@/domain/volume/state/volume.atom";
import { VOLUME_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import { myDropdownButtonStyle } from "@/styles/mixins/button";

interface CreateVolumeFolderButtonProps {
  volumeId: number;
}

/**
 * 볼륨 폴더 추가 버튼 컴포넌트
 *
 * 선택된 디렉토리에 새 폴더를 추가하는 기능을 제공합니다.
 * 드롭다운 메뉴 아이템으로 사용되며, 디렉토리가 선택되지 않은 경우 비활성화됩니다.
 *
 * @returns 폴더 추가 버튼 JSX 요소
 */
export function CreateVolumeFolderButton({
  volumeId,
}: CreateVolumeFolderButtonProps) {
  // Pub/Sub 시스템을 통한 이벤트 발행 훅
  const publish = usePublish();
  // 선택된 파일 노드 정보를 가져오는 atom
  const selectedFile = useAtomValue(volumeFileSelectedNodeInfoAtom);

  // 디렉토리가 선택된 경우에만 활성화
  const isEnabled = selectedFile !== null && selectedFile.type === "directory";

  /**
   * 폴더 생성 이벤트 핸들러
   * 선택된 디렉토리의 경로와 볼륨 ID를 추출하여 폴더 생성 이벤트를 발행합니다.
   */
  const handleClick = () => {
    if (!isEnabled) {
      return;
    }
    // 폴더 생성 이벤트를 Pub/Sub 시스템을 통해 발행
    publish(VOLUME_EVENTS.sendCreateVolumeFolder, {
      volumeId,
      filePath: selectedFile.path,
    });
  };

  return (
    <StyledButton type="button" onClick={handleClick} disabled={!isEnabled}>
      폴더 추가
    </StyledButton>
  );
}

// 드롭다운 메뉴 아이템용 스타일된 버튼 컴포넌트
const StyledButton = styled.button`
  ${myDropdownButtonStyle}
`;
