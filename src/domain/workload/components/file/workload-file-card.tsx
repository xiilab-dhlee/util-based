"use client";

import { useSetAtom } from "jotai";
import styled from "styled-components";
import { Icon } from "xiilab-ui";

import { WorkloadFileCheckbox } from "@/domain/workload/components/file/workload-file-checkbox";
import { workloadFileSelectedKeyAtom } from "@/domain/workload/state/workload.atom";
import type { FileTreeType } from "@/shared/schemas/filetree.schema";
import { formatFileSize, getFileIconName } from "@/shared/utils/file.util";

interface WorkloadFileCardProps extends FileTreeType {
  /** 체크박스 표시 여부 */
  showCheckbox?: boolean;
}

export function WorkloadFileCard(props: WorkloadFileCardProps) {
  const {
    id,
    type,
    name,
    fileExtension,
    fileSize,
    children,
    showCheckbox = false,
  } = props;
  const setSelectedKey = useSetAtom(workloadFileSelectedKeyAtom);

  // 선택 상태만 변경 (하위 파일 로드는 useWorkloadFileTree에서 반응형으로 처리)
  const handleClickFileName = () => {
    setSelectedKey(id);
  };

  const iconName = getFileIconName(fileExtension, type);

  const node = { ...props, path: id, children: children ?? [] };

  return (
    <Container>
      {showCheckbox && (
        <CheckboxWraper>
          <WorkloadFileCheckbox activeKey={id} type={type} node={node} />
        </CheckboxWraper>
      )}
      <Body>
        <Icon name={iconName} size={34} color="#868994" />
      </Body>
      <Footer>
        <FileName
          type="button"
          className="truncate"
          onClick={handleClickFileName}
          title={name || undefined}
        >
          {name || "-"}
        </FileName>

        <FileSize>
          <FileSize>
            {fileSize != null
              ? formatFileSize(Number(fileSize) || 0).formatted
              : null}
          </FileSize>
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
