"use client";

import { useAtomValue } from "jotai";
import styled from "styled-components";

import { volumeFileCheckedNodesInfoAtom } from "@/domain/volume/state/volume.atom";
import { VOLUME_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import { myDropdownButtonStyle } from "@/styles/mixins/button";

interface UnzipVolumeFileButtonProps {
  volumeId: number;
}

export function UnzipVolumeFileButton({
  volumeId,
}: UnzipVolumeFileButtonProps) {
  const publish = usePublish();
  const checkedNodesInfo = useAtomValue(volumeFileCheckedNodesInfoAtom);

  const handleClick = () => {
    const selectedNode = checkedNodesInfo[0];
    if (!selectedNode) return;

    publish(VOLUME_EVENTS.sendDecompressVolumeFile, {
      volumeId,
      filePath: selectedNode.path,
    });
  };

  return (
    <StyledButton type="button" onClick={handleClick}>
      압축 해제
    </StyledButton>
  );
}

const StyledButton = styled.button`
  ${myDropdownButtonStyle}
`;
