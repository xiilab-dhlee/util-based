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

export function CreateVolumeFolderButton({
  volumeId,
}: CreateVolumeFolderButtonProps) {
  const publish = usePublish();
  const selectedFile = useAtomValue(volumeFileSelectedNodeInfoAtom);

  const isEnabled = selectedFile !== null && selectedFile.type === "directory";

  const handleClick = () => {
    if (!isEnabled) return;
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

const StyledButton = styled.button`
  ${myDropdownButtonStyle}
`;
