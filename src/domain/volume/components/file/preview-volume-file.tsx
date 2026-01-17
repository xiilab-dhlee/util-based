"use client";

import { useAtomValue } from "jotai";
import { useMemo } from "react";
import styled from "styled-components";
import { Icon } from "xiilab-ui";

import { volumeFileSelectedKeyAtom } from "@/domain/volume/state/volume.atom";
import type { FileTreeType } from "@/shared/schemas/filetree.schema";
import { formatFileSize } from "@/shared/utils/file.util";
import { getFileIconName } from "@/shared/utils/file-icon.util";
import {
  AsideDetailArticle,
  AsideDetailArticleRow,
} from "@/styles/layers/aside-detail-layers.styled";

interface PreviewVolumeFileProps {
  /** 파일 트리 데이터 */
  treeData: FileTreeType[];
}

/**
 * PreviewVolumeFile 컴포넌트
 *
 * 선택된 파일/폴더의 미리보기 정보를 표시합니다.
 * treeData에서 선택된 노드를 찾아 상세 정보를 렌더링합니다.
 *
 * @param treeData - 파일 트리 데이터
 */
export function PreviewVolumeFile({ treeData }: PreviewVolumeFileProps) {
  const selectedKey = useAtomValue(volumeFileSelectedKeyAtom);

  /**
   * 트리에서 선택된 노드를 찾는 함수
   */
  const selectedNode = useMemo(() => {
    if (!selectedKey) return null;

    const findNodeByKey = (
      nodes: FileTreeType[],
      targetKey: React.Key,
    ): FileTreeType | null => {
      for (const node of nodes) {
        if (node.path === targetKey) return node;

        if (node.children?.length) {
          const found = findNodeByKey(node.children, targetKey);
          if (found) return found;
        }
      }
      return null;
    };

    return findNodeByKey(treeData, selectedKey);
  }, [treeData, selectedKey]);

  /*
   * 선택된 노드가 없으면 null 반환
   */
  if (!selectedNode) return null;

  // 파일/폴더 타입에 따른 레이블 및 정보 설정
  const isFile = selectedNode.type === "file";
  const nameKey = isFile ? "파일 이름" : "폴더 이름";
  const fileCount = selectedNode.fileCount ?? -1;

  // 확장자에 따른 아이콘 결정
  const iconName = getFileIconName(
    selectedNode.fileExtension,
    selectedNode.type,
  );

  return (
    <Container>
      <AsideDetailArticleRow>
        <Preview>
          <IconWrapper>
            <Icon name={iconName} color="var(--icon-fill)" size={58} />
          </IconWrapper>
          <FileName
            className="truncate"
            title={selectedNode.name}
            style={{ textAlign: "center" }}
          >
            {selectedNode.name}
          </FileName>
        </Preview>
        <FileBody>
          <FileItem>
            <FileKey>{nameKey}</FileKey>
            <FileName>{selectedNode.name}</FileName>
          </FileItem>
          <FileItem>
            <FileKey>파일 용량</FileKey>
            <FileValue>
              {formatFileSize(Number(selectedNode.fileSize)).formatted}
            </FileValue>
          </FileItem>
          {fileCount > -1 && (
            <FileItem>
              <FileKey>파일 개수</FileKey>
              <FileValue>{fileCount}개</FileValue>
            </FileItem>
          )}
        </FileBody>
      </AsideDetailArticleRow>
    </Container>
  );
}

const Container = styled(AsideDetailArticle)`
  margin-top: 10px;
  border-color: #E9EBEE;
`;

const Preview = styled.div`
  border: 1px solid #E9EBEE;
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
  line-height: 1;
  width: 120px;
  
`;

const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 58px;
  height: 58px;

  --icon-fill: #9da6bc;
`;
