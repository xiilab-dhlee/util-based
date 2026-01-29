"use client";

import styled from "styled-components";
import { Button, Card, Icon } from "xiilab-ui";

import type {
  SourceCodeDetailResponseSourceCodeType,
  SourceCodeListResponseSourceCodeType,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { getSourcecodeTypeInfo } from "@/domain/sourcecode/utils/sourcecode.util";
import { WORKLOAD_SELECTOR } from "@/shared/constants/selector.constant";
import { getVisibilityInfo } from "@/shared/utils/visibility.util";

type SourceCodeType =
  | SourceCodeListResponseSourceCodeType
  | SourceCodeDetailResponseSourceCodeType;

interface WorkloadSourcecodeCardProps {
  sourceCodeId: number;
  sourceCodeName: string;
  gitUrl: string;
  mountPath: string;
  sourceCodeType?: SourceCodeType;
  isPublic?: boolean;
  onDelete?: (sourceCodeId: number) => void;
}

/**
 * 소스 코드 카드 컴포넌트
 */
/**
 * 워크로드 소스코드 카드 컴포넌트
 *
 * 워크로드에 연결된 소스코드 정보를 표시합니다.
 */
export function WorkloadSourcecodeCard({
  sourceCodeName,
  mountPath,
  gitUrl,
  sourceCodeType,
  isPublic,
  sourceCodeId,
  onDelete,
}: WorkloadSourcecodeCardProps) {
  const { text } = getSourcecodeTypeInfo(sourceCodeType);
  const { iconName } = getVisibilityInfo(isPublic);
  const handleDeleteClick = () => {
    onDelete?.(sourceCodeId);
  };

  return (
    <CardWrapper data-testid={WORKLOAD_SELECTOR.SOURCECODE_CARD}>
      <Card
        contentVariant="default"
        title={sourceCodeName}
        icon={
          iconName ? <Icon name={iconName} size={24} color="#464B51" /> : null
        }
        actionElement={
          onDelete ? (
            <Button icon="Close" iconSize={14} onClick={handleDeleteClick} />
          ) : undefined
        }
      >
        <CardContainer>
          <CardBody>
            <CardLeft>
              <CardKey>Git URL</CardKey>
              <CardKey>경로</CardKey>
              <CardKey>타입</CardKey>
            </CardLeft>
            <CardRight>
              <CardValue
                className="truncate"
                data-testid={WORKLOAD_SELECTOR.SOURCECODE_URL}
              >
                {gitUrl || "-"}
              </CardValue>
              <CardValue data-testid={WORKLOAD_SELECTOR.SOURCECODE_PATH}>
                <div className="truncate">{mountPath || "-"}</div>
              </CardValue>
              <CardValue
                data-testid={WORKLOAD_SELECTOR.sourcecodeType(
                  sourceCodeType ?? "",
                )}
              >
                {text || "-"}
              </CardValue>
            </CardRight>
          </CardBody>
        </CardContainer>
      </Card>
    </CardWrapper>
  );
}

const CardWrapper = styled.div`
  .card-header {
    padding-right: 30px;
  }
`;

const CardContainer = styled.div`
  width: 100%;
  height: 100%;
  padding: 2px 6px;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const CardBody = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex: 1;
`;

const CardLeft = styled.div`
  width: 65px;
  border-right: 1px solid #e9ebee;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const CardKey = styled.div`
  font-weight: 600;
  font-size: 10px;
  line-height: 12px;
  color: #484848;
  word-spacing: 0.1px;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
`;

const CardRight = styled.div`
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-left: 10px;
`;

const CardValue = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 1;
  color: #000;
  overflow: hidden;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 14px;
  flex: 1;
`;
