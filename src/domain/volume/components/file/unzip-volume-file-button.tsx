"use client";

import { useAtomValue } from "jotai";
import { toast } from "react-toastify";
import styled from "styled-components";

import { volumeFileCheckedNodesInfoAtom } from "@/domain/volume/state/volume.atom";
import { VOLUME_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import { myDropdownButtonStyle } from "@/styles/mixins/button";

const COMPRESSED_FILE_EXTENSIONS = [".zip", ".tar", ".tar.gz", ".tgz"];

const isCompressedFile = (path: string): boolean => {
  const lowerPath = path.toLowerCase();
  return COMPRESSED_FILE_EXTENSIONS.some((ext) => lowerPath.endsWith(ext));
};

interface UnzipVolumeFileButtonProps {
  volumeId: number;
}

export function UnzipVolumeFileButton({
  volumeId,
}: UnzipVolumeFileButtonProps) {
  const publish = usePublish();
  const checkedNodesInfo = useAtomValue(volumeFileCheckedNodesInfoAtom);

  const handleClick = () => {
    if (checkedNodesInfo.length !== 1) {
      toast.warning("압축 해제는 파일 하나만 선택할 수 있습니다.");
      return;
    }

    const selectedNode = checkedNodesInfo[0];

    if (!isCompressedFile(selectedNode.path)) {
      toast.warning(
        "압축 파일(.zip, .tar, .tar.gz, .tgz)만 압축 해제할 수 있습니다.",
      );
      return;
    }

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

const StyledButton = styled.button`
  ${myDropdownButtonStyle}
`;
