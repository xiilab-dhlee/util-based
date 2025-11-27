"use client";

import styled from "styled-components";
import { Button, Dropdown, Icon, Input, Tooltip, Typography } from "xiilab-ui";

import { CreateModelButton } from "@/shared/components/button/create-model-button";
import { GuideTooltip } from "@/shared/components/tooltip/guide-tooltip";
import { CreateWorkloadSectionTitle } from "@/styles/layers/create-workload-layers.styled";
import { CreateWorkloadSourcecodeSelect } from "./create-workload-sourcecode-select";

export function CreateWorkloadCustomSourcecode() {
  const handleSourceCodeCreate = () => {};

  return (
    <Container>
      <Header>
        <CreateWorkloadSectionTitle>소스코드 추가</CreateWorkloadSectionTitle>
        <CreateModelButton
          title="소스코드 생성"
          onClick={handleSourceCodeCreate}
        />
      </Header>
      {/* 소스코드 추가 영역 */}
      <Body>
        {/* 소스코드 목록과 Branch */}
        <Row>
          <Pane>
            <Typography.Text variant="body-2-4" color="#000000">
              소스코드 목록
            </Typography.Text>
            <CreateWorkloadSourcecodeSelect />
          </Pane>
          <Pane>
            <Typography.Text variant="body-2-4" color="#000000">
              Branch
            </Typography.Text>
            <Dropdown
              placeholder="Branch를 선택해 주세요."
              options={[]}
              value={null}
              width="100%"
            />
          </Pane>
        </Row>

        {/* 마운트 경로와 실행 명령어 */}
        <Row>
          <Pane>
            <Label>
              <Typography.Text variant="body-2-4" color="#000000">
                마운트 경로
              </Typography.Text>
              <GuideTooltip
                title={
                  <TooltipContent>
                    컨테이너 안에서 선택한{" "}
                    <TooltipHighlight>소스코드의 디렉토리</TooltipHighlight>가
                    마운트되는 경로입니다.
                  </TooltipContent>
                }
              />
            </Label>
            <Input
              placeholder="Mount path를 입력해 주세요."
              // value={sourceCodeMountPath}
              // onChange={(e) => setSourceCodeMountPath(e.target.value)}
            />
          </Pane>

          <Pane>
            <Label>
              <Typography.Text variant="body-2-4" color="#000000">
                실행 명령어
              </Typography.Text>
              <Tooltip
                title={
                  <TooltipContent>
                    소스코드 실행을 위한 명령어를 입력합니다.
                  </TooltipContent>
                }
              >
                <TooltipIconWrapper>
                  <Icon name="Tooltip" size={16} color="#5F6368" />
                </TooltipIconWrapper>
              </Tooltip>
            </Label>
            <Input
              placeholder="실행 명령어를 입력해 주세요."
              // value={executeCommand}
              // onChange={(e) => setExecuteCommand(e.target.value)}
            />
          </Pane>
        </Row>

        {/* 소스코드 추가 버튼 */}
        <VolumeAddButtonWrapper>
          <StyledAddButton
            variant="outlined"
            color="primary"
            // onClick={handleSourceCodeAdd}
            icon="Add"
            width="100%"
            height="30px"
          >
            소스코드 추가
          </StyledAddButton>
        </VolumeAddButtonWrapper>
      </Body>

      {/* 소스코드 목록 박스 */}
      <Footer>
        <VolumeListHeader
        // onClick={() => setSourceCodeListExpanded(!isSourceCodeListExpanded)}
        >
          <Typography.Text variant="body-2-2" color="#484848">
            소스코드 목록
          </Typography.Text>
          <VolumeListIcons>
            <Icon name="Dropdown" size={16} color="#5F6368" />
            <Icon
              // name={isSourceCodeListExpanded ? "ChevronUp" : "ChevronDown"}
              size={20}
              color="#5F6368"
            />
          </VolumeListIcons>
        </VolumeListHeader>

        {/* {isSourceCodeListExpanded && (
          <SourceCodeCardsContainer>
            {addedSourceCodes.length > 0 ? (
              addedSourceCodes.map((sourceCode) => (
                <SourceCodeCardForWorkload
                  key={sourceCode.uid}
                  url={sourceCode.url}
                  mountPath={sourceCode.mountPath}
                  branch={sourceCode.branch}
                  executeCommand={sourceCode.executeCommand}
                  sourceType={sourceCode.sourceType}
                  onDelete={() => handleSourceCodeDelete(sourceCode.uid)}
                  onEdit={(data) => handleSourceCodeEdit(sourceCode.uid, data)}
                />
              ))
            ) : (
              <EmptyVolumeMessage>
                <Typography.Text variant="body-2-4" color="#707070">
                  추가된 소스코드가 없습니다.
                </Typography.Text>
              </EmptyVolumeMessage>
            )}
          </SourceCodeCardsContainer>
        )} */}
      </Footer>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const VolumeCreateButton = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  padding: 4px;

  &:hover {
    opacity: 0.8;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const Row = styled.div`
  display: flex;
  gap: 12px;
  align-items: end;
`;

const Pane = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
`;

const Label = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
`;

const Body = styled.div`
  background-color: #fafafa;
  border: 1px solid #d1d5dc;
  border-radius: 4px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const VolumeAddButtonWrapper = styled.div`
  width: 100%;
`;

const Footer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #fafafa;
  border: 1px solid #d1d5dc;
  border-radius: 4px;
  padding: 10px;
  gap: 8px;
  margin-top: 8px;
`;

const VolumeListHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;

  &:hover {
    background-color: #f0f1f2;
  }
`;

const SourceCodeCardsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  > * {
    flex: 1;
    min-width: calc(50% - 4px);
    max-width: calc(50% - 4px);
  }
`;

const EmptyVolumeMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
`;

const StyledAddButton = styled(Button)`
  font-size: 12px !important;
`;

const VolumeListIcons = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const TooltipIconWrapper = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const TooltipContent = styled(Typography.Text).attrs({
  variant: "body-4-2", // 10px, 400 weight
})`
  color: #000000;
  line-height: 16px;
`;

const TooltipHighlight = styled(Typography.Text).attrs({
  variant: "body-4-1", // 10px, 700 weight (closest match)
})`
  color: #0022e0;
  line-height: 16px;
`;
