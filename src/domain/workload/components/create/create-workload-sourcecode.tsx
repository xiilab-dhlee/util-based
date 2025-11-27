"use client";

import classNames from "classnames";
import { isNull } from "es-toolkit";
import { isEmpty } from "es-toolkit/compat";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { Button, Dropdown, Icon, Input, Typography } from "xiilab-ui";

import { SourcecodeSelect } from "@/domain/sourcecode/components/sourcecode-select";
import { WorkloadSourcecodeCard } from "@/domain/sourcecode/components/workload-sourcecode-card";
import type {
  SourcecodeIdType,
  SourcecodeListType,
} from "@/domain/sourcecode/schemas/sourcecode.schema";
import { openCreateSourcecodeModalAtom } from "@/domain/sourcecode/state/sourcecode.atom";
import { CreateModelButton } from "@/shared/components/button/create-model-button";
import { GuideTooltip } from "@/shared/components/tooltip/guide-tooltip";
import { SourcecodeCommandTooltipTitle } from "@/shared/components/tooltip-title/sourcecode-command-tooltip-title";
import { SourcecodeMountPathTooltipTitle } from "@/shared/components/tooltip-title/sourcecode-mount-path-tooltip-title";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { CreateWorkloadSectionTitle } from "@/styles/layers/create-workload-layers.styled";
import type { WorkloadSourcecodeType } from "../../schemas/workload.schema";
import { workloadSourcecodesAtom } from "../../state/create-workload.atom";

export function CreateWorkloadSourcecode() {
  const [sourcecodes, setSourcecodes] = useAtom(workloadSourcecodesAtom);

  const [collapsed, setCollapsed] = useState(false);

  const [sourcecode, setSourcecode] = useState<SourcecodeListType | null>(null);

  const [branch, setBranch] = useState<string | null>(null);
  const [mountPath, setMountPath] = useState<string | null>(null);
  const [cmd, setCmd] = useState<string | null>(null);

  const { onOpen } = useGlobalModal(openCreateSourcecodeModalAtom);
  const handleSourceCodeCreate = () => {
    onOpen();
  };

  const handleAddSourcecode = () => {
    if (sourcecode) {
      if (isNull(branch)) {
        toast.error("Branch를 선택해 주세요.");
        return;
      }

      if (isEmpty(mountPath)) {
        toast.error("마운트 경로를 입력해 주세요.");
        return;
      }

      const next: WorkloadSourcecodeType = {
        ...sourcecode,
        branch: branch || "",
        path: mountPath || "",
        cmd: cmd || "",
      };

      setSourcecodes([...sourcecodes, next]);
      setSourcecode(null);
      setBranch(null);
      setMountPath(null);
      setCmd(null);
    } else {
      toast.error("소스코드를 선택해 주세요.");
    }
  };

  const handleDeleteSourcecode = (id: SourcecodeIdType) => {
    setSourcecodes(sourcecodes.filter((sourcecode) => sourcecode.id !== id));
  };
  // 소스코드 선택 시 마운트경로 및 명령어 정보 가져오기
  useEffect(() => {
    if (sourcecode) {
      setMountPath(sourcecode.path || "");
      setCmd(sourcecode.cmd || "");
    }
  }, [sourcecode]);

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
            <SourcecodeSelect value={sourcecode} setValue={setSourcecode} />
          </Pane>
          <Pane>
            <Typography.Text variant="body-2-4" color="#000000">
              Branch
            </Typography.Text>
            <Dropdown
              placeholder="Branch를 선택해 주세요."
              options={[
                { label: "main", value: "main" },
                { label: "develop", value: "develop" },
              ]}
              value={branch}
              onChange={(value) => setBranch(value)}
              width="100%"
            />
          </Pane>
        </Row>

        {/* 마운트 경로와 실행 명령어 */}
        <Row>
          <Pane>
            <Label>
              <LabelTitle>
                마운트 경로
                <GuideTooltip title={<SourcecodeMountPathTooltipTitle />} />
              </LabelTitle>
            </Label>
            <Input
              placeholder="Mount path를 입력해 주세요."
              value={mountPath || ""}
              onChange={(e) => setMountPath(e.target.value)}
            />
          </Pane>

          <Pane>
            <Label>
              <LabelTitle>
                실행 명령어
                <GuideTooltip title={<SourcecodeCommandTooltipTitle />} />
              </LabelTitle>
            </Label>
            <Input
              placeholder="실행 명령어를 입력해 주세요."
              value={cmd || ""}
              onChange={(e) => setCmd(e.target.value)}
            />
          </Pane>
        </Row>

        {/* 소스코드 추가 버튼 */}
        <VolumeAddButtonWrapper>
          <StyledAddButton
            variant="outlined"
            color="primary"
            onClick={handleAddSourcecode}
            icon="Plus"
            width="100%"
            height="30px"
            iconSize={20}
          >
            소스코드 추가
          </StyledAddButton>
        </VolumeAddButtonWrapper>
      </Body>

      {/* 소스코드 목록 박스 */}
      <Footer>
        <FooterHeader>
          <Typography.Text variant="body-2-2" color="#484848">
            소스코드 목록
          </Typography.Text>
          <IconWrapper
            className={classNames({ rotate: collapsed })}
            onClick={() => setCollapsed(!collapsed)}
          >
            <Icon name="Dropdown" size={16} color="#222223" />
          </IconWrapper>
        </FooterHeader>

        {!collapsed && (
          <SourceCodeCardsContainer>
            {sourcecodes.map((sourcecode) => (
              <WorkloadSourcecodeCard
                key={sourcecode.id}
                {...sourcecode}
                onDelete={() => handleDeleteSourcecode(sourcecode.id)}
              />
            ))}
            {sourcecodes.length === 0 && (
              <EmptyVolumeMessage>
                <Typography.Text variant="body-2-4" color="#707070">
                  추가된 소스코드가 없습니다.
                </Typography.Text>
              </EmptyVolumeMessage>
            )}
          </SourceCodeCardsContainer>
        )}
      </Footer>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
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
  position: relative;
`;

const LabelTitle = styled(Typography.Text).attrs({
  variant: "body-2-4",
  color: "#000000",
})`
  position: relative;
`;

const Body = styled.div`
  background-color: #fafafa;
  border: 1px solid #d1d5dc;
  border-radius: 4px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 12px;
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

const FooterHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SourceCodeCardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
`;

const EmptyVolumeMessage = styled.div`
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
`;

const StyledAddButton = styled(Button)`
  font-size: 12px !important;
`;

const IconWrapper = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;

  &.collapsed {
    transform: rotate(180deg);
  }
`;
