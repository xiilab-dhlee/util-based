"use client";

import { useAtomValue } from "jotai";
import styled from "styled-components";

import { volumeFileCheckedNodesInfoAtom } from "@/domain/volume/state/volume.atom";
import { VOLUME_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import { myDropdownButtonStyle } from "@/styles/mixins/button";

interface DeleteVolumeFileButtonProps {
  volumeId: number;
}

export function DeleteVolumeFileButton({
  volumeId,
}: DeleteVolumeFileButtonProps) {
  const publish = usePublish();
  const checkedNodesInfo = useAtomValue(volumeFileCheckedNodesInfoAtom);

  const handleClick = () => {
    const filePaths = checkedNodesInfo.map((node) => node.path);
    publish(VOLUME_EVENTS.sendDeleteVolumeFile, { volumeId, filePaths });
  };

  return (
    <StyledButton
      type="button"
      onClick={handleClick}
      disabled={checkedNodesInfo.length === 0}
    >
      삭제
    </StyledButton>
  );
}

const StyledButton = styled.button`
  ${myDropdownButtonStyle}
`;
