"use client";

import { useSetAtom } from "jotai";
import styled from "styled-components";
import { Icon } from "xiilab-ui";

import { workloadFileSelectedKeyAtom } from "@/domain/workload/state/workload.atom";
import type { FileTreeType } from "@/shared/schemas/filetree.schema";
import { WorkloadFileCheckbox } from "./workload-file-checkbox";

interface WorkloadFileCardProps extends FileTreeType {}

export function WorkloadFileCard({
  id,
  type,
  name,
  fileCount,
  fileExtension,
  fileSize,
}: WorkloadFileCardProps) {
  const setSelectedKey = useSetAtom(workloadFileSelectedKeyAtom);

  // 파일 타입에 따른 아이콘 이름을 반환하는 함수
  const getFileIcon = (): string => {
    if (type === "directory") return "FolderFiled";

    const extension = fileExtension?.toLowerCase();
    switch (extension) {
      case "pdf":
        return "FilePdf";
      case "doc":
      case "docx":
        return "FileDoc";
      case "xls":
      case "xlsx":
      case "csv":
        return "FileCsv";
      case "jpg":
      case "jpeg":
        return "FileJpg";
      case "png":
        return "FilePng";
      case "zip":
        return "FileZip";
      default:
        return "FileTxt";
    }
  };

  const handleClickFileName = () => {
    setSelectedKey(id);
  };

  return (
    <Container>
      {type === "file" && (
        <CheckboxWraper>
          <WorkloadFileCheckbox activeKey={id} />
        </CheckboxWraper>
      )}
      <Body>
        <Icon
          name={getFileIcon()}
          size={34}
          color={type === "directory" ? "#9DA6BC" : ""}
        />
      </Body>
      <Footer>
        <FileName className="truncate" onClick={handleClickFileName}>
          {name}
        </FileName>
        <FileSize>
          {type === "directory"
            ? `${fileCount || 0} items`
            : `${fileSize || 0}B`}
        </FileSize>
      </Footer>
    </Container>
  );
}

const Container = styled.div`
  border: 1px solid #c8cfd6;
  background-color: #fff;
  height: 88px;
  border-radius: 2px;
  position: relative;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: var(--file-card-gutter-size);

  --file-card-gutter-size: 9px;
`;

const CheckboxWraper = styled.div`
  position: absolute;
  top: var(--file-card-gutter-size);
  left: var(--file-card-gutter-size);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Body = styled.div`
  width: 34px;
  height: 34px;

  --icon-fill: #9da6bc;
`;

const Footer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
  width: 100%;
`;

const FileName = styled.button`
  color: #000;
  font-size: 11px;
  font-weight: 400;
  line-height: normal;
  text-align: center;

  &:hover {
    text-decoration: underline;
  }
`;

const FileSize = styled.div`
  color: #686c70;
  font-size: 9px;
  font-weight: 400;
  line-height: normal;
  text-align: center;
`;
