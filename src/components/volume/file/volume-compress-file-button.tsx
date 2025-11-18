"use client";

import { useAtomValue } from "jotai";
import styled from "styled-components";

import { volumeFileCheckedNodesInfoAtom } from "@/atoms/volume.atom";
import { VOLUME_EVENTS } from "@/constants/common/pubsub.constant";
import { usePublish } from "@/hooks/common/use-pub-sub";
import { myDropdownButtonStyle } from "@/styles/mixins/button";

/**
 * 볼륨 파일 압축 버튼 컴포넌트
 *
 * 선택된 파일들을 압축하는 기능을 제공합니다.
 * 드롭다운 메뉴 아이템으로 사용되며, 파일이 선택되지 않은 경우 비활성화됩니다.
 *
 * @returns 압축 버튼 JSX 요소
 */
export function VolumeCompressFileButton() {
  // Pub/Sub 시스템을 통한 이벤트 발행 훅
  const publish = usePublish();
  // 체크된 파일 노드 정보를 가져오는 atom
  const checkedNodesInfo = useAtomValue(volumeFileCheckedNodesInfoAtom);

  /**
   * 파일 압축 이벤트 핸들러
   * 선택된 파일들의 경로를 추출하여 압축 이벤트를 발행합니다.
   */
  const handleClick = () => {
    // 체크된 파일들의 경로를 추출
    const filePaths = checkedNodesInfo.map((node) => node.path);
    // 압축 이벤트를 Pub/Sub 시스템을 통해 발행
    publish(VOLUME_EVENTS.sendCompressVolumeFile, {
      filePaths,
    });
  };

  return (
    <StyledButton
      type="button"
      onClick={handleClick}
      disabled={checkedNodesInfo.length === 0}
    >
      파일 압축
    </StyledButton>
  );
}

// 드롭다운 메뉴 아이템용 스타일된 버튼 컴포넌트
const StyledButton = styled.button`
  ${myDropdownButtonStyle}
`;
