"use client";

import { useAtomValue } from "jotai";
import styled from "styled-components";

import { volumeFileCheckedNodesInfoAtom } from "@/domain/volume/state/volume.atom";
import { VOLUME_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import { myDropdownButtonStyle } from "@/styles/mixins/button";

interface CompressVolumeFileButtonProps {
  volumeId: number;
}

export function CompressVolumeFileButton({
  volumeId,
}: CompressVolumeFileButtonProps) {
  const publish = usePublish();
  const checkedNodesInfo = useAtomValue(volumeFileCheckedNodesInfoAtom);

  const handleClick = () => {
    const filePaths = checkedNodesInfo.map((node) => node.path);
    publish(VOLUME_EVENTS.sendCompressVolumeFile, { volumeId, filePaths });
  };

  return (
    <StyledButton type="button" onClick={handleClick}>
      압축
    </StyledButton>
  );
}

const StyledButton = styled.button`
  ${myDropdownButtonStyle}
`;
