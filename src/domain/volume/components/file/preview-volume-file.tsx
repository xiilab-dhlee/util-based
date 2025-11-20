"use client";

import { format } from "date-fns";
import { useAtom } from "jotai";
import styled from "styled-components";
import { Icon } from "xiilab-ui";

import { volumeFileSelectedNodeInfoAtom } from "@/domain/volume/state/volume.atom";
import {
  AsideDetailArticle,
  AsideDetailArticleRow,
} from "@/styles/layers/aside-detail-layers.styled";

export function PreviewVolumeFile() {
  const selectedNode = useAtom(volumeFileSelectedNodeInfoAtom)[0];

  /*
   * 선택된 노드가 없으면 null 반환
   */
  if (!selectedNode) return null;

  let nameKey = "";
  let fileCount = -1;
  if (selectedNode.type === "file") {
    nameKey = "파일 이름";
  } else if (selectedNode.type === "directory") {
    nameKey = "폴더 이름";
    fileCount = selectedNode.fileCount || 0;
  }

  return (
    <AsideDetailArticle>
      <AsideDetailArticleRow>
        <Preview>
          <IconWrapper>
            <Icon name="FolderFiled" color="var(--icon-fill)" size={58} />
          </IconWrapper>
          <FileName>{selectedNode.name}</FileName>
        </Preview>
        <FileBody>
          <FileItem>
            <FileKey>{nameKey}</FileKey>
            <FileName>{selectedNode.name}</FileName>
          </FileItem>
          <FileItem>
            <FileKey>파일 용량</FileKey>
            <FileValue>35.85MB</FileValue>
          </FileItem>
          {fileCount > -1 && (
            <FileItem>
              <FileKey>파일 개수</FileKey>
              <FileValue>{fileCount}개</FileValue>
            </FileItem>
          )}
          <FileItem>
            <FileKey>최근 검사일</FileKey>
            <FileValue>
              {format(new Date(), "yyyy년 MM월 dd일 HH시 mm분")}
            </FileValue>
          </FileItem>
        </FileBody>
      </AsideDetailArticleRow>
    </AsideDetailArticle>
  );
}

const Preview = styled.div`
  border: 1px solid #d1d5dc;
  border-radius: 4px;
  background-color: #fafafa;
  width: 160px;
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const FileBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
  margin-left: 14px;
`;

const FileItem = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const FileKey = styled.span`
  color: #191b26;
  font-size: 12px;
  font-weight: 500;
  width: 85px;
  overflow: hidden;
`;

const FileValue = styled.div`
  flex: 1;
  color: #191b26;
  font-size: 12px;
  font-weight: 400;
`;

const FileName = styled.span`
  font-size: 12px;
  color: #000000;
  font-weight: 600;
`;

const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 58px;
  height: 58px;

  --icon-fill: #9da6bc;
`;
