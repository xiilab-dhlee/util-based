"use client";

import classNames from "classnames";
import { isNull } from "es-toolkit";
import { isEmpty } from "es-toolkit/compat";
import { useAtom } from "jotai";
import type { ChangeEvent, SetStateAction } from "react";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { Button, Dropdown, Icon, Input, Typography } from "xiilab-ui";

import type {
  SourceCodeDetailResponse,
  SourceCodeListResponse,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  useGetBranches,
  useGetSourceCodeDetail,
} from "@/api/generated/source-code/source-code";
import { SourcecodeSelect } from "@/domain/sourcecode/components/sourcecode-select";
import { WorkloadSourcecodeCard } from "@/domain/sourcecode/components/workload-sourcecode-card";
import type { SourcecodeParameterType } from "@/domain/sourcecode/schemas/sourcecode.schema";
import type { WorkloadSourcecodeType } from "@/domain/workload/types/workload.type";
import { GuideTooltip } from "@/shared/components/tooltip/guide-tooltip";
import { SourcecodeCommandTooltipTitle } from "@/shared/components/tooltip-title/sourcecode-command-tooltip-title";
import { SourcecodeMountPathTooltipTitle } from "@/shared/components/tooltip-title/sourcecode-mount-path-tooltip-title";
import { CreateWorkloadSectionTitle } from "@/styles/layers/create-workload-layers.styled";
import { errorTextStyle } from "@/styles/mixins/text";
import {
  executionCmdAtom,
  sourcecodeParametersAtom,
  type WorkloadSourcecodeInfoUiType,
  workloadSourcecodeInfoMapUiAtom,
  workloadSourcecodesAtom,
} from "../../state/create-workload.atom";

const toParameterArray = (
  record: SourceCodeDetailResponse["parameter"],
): SourcecodeParameterType[] => {
  return Object.entries(record || {}).map(([key, value]) => ({
    key,
    value,
  }));
};

const buildSourcecodeParameterText = (
  parameters: SourcecodeParameterType[],
): string => {
  return parameters
    .map((param) => ({
      key: param.key.trim(),
      value: param.value.trim(),
    }))
    .filter((param) => param.key && param.value)
    .map((param) => `--${param.key}-${param.value}`)
    .join(" ");
};

const buildExecutionCommand = (
  baseCommand: string | null,
  parameters: SourcecodeParameterType[],
): string | null => {
  const normalizedCommand = baseCommand?.trim() ?? "";
  const parameterText = buildSourcecodeParameterText(parameters);
  const combined = [normalizedCommand, parameterText].filter(Boolean).join(" ");
  return combined ? combined : null;
};

export function CreateWorkloadSourcecode() {
  const [sourcecodes, setSourcecodes] = useAtom(workloadSourcecodesAtom);
  const [sourcecodeInfoMapUi, setSourcecodeInfoMapUi] = useAtom(
    workloadSourcecodeInfoMapUiAtom,
  );
  const [, setExecutionCmd] = useAtom(executionCmdAtom);
  const [sourcecodeParameters, setSourcecodeParameters] = useAtom(
    sourcecodeParametersAtom,
  );
  const isAddDisabled = sourcecodes.length > 0;

  const [collapsed, setCollapsed] = useState(false);

  const [sourcecode, setSourcecode] = useState<SourceCodeListResponse | null>(
    null,
  );

  const [branch, setBranch] = useState<string | null>(null);
  const [mountPath, setMountPath] = useState<string | null>(null);
  const [cmd, setCmd] = useState<string | null>(null);
  const [addErrors, setAddErrors] = useState({
    sourcecode: "",
    branch: "",
    mountPath: "",
    cmd: "",
  });

  const { data: branches, isLoading: isLoadingBranches } = useGetBranches(
    sourcecode?.sourceCodeId ?? 0,
    {
      query: {
        enabled: Boolean(sourcecode?.sourceCodeId),
      },
    },
  );
  const { data: sourcecodeDetail } = useGetSourceCodeDetail(
    sourcecode?.sourceCodeId ?? 0,
    {
      query: {
        enabled: Boolean(sourcecode?.sourceCodeId),
      },
    },
  );

  // Convert to Dropdown options format
  const branchOptions = (Array.isArray(branches) ? branches : []).map(
    (branchName) => ({
      label: branchName,
      value: branchName,
    }),
  );

  // Auto-populate mount path and command when sourcecode is selected
  useEffect(() => {
    if (sourcecode) {
      setMountPath(sourcecode.mountPath || "");
      setCmd(sourcecode.executionCmd || "");
      setBranch(null); // Reset branch when sourcecode changes
      setSourcecodeParameters([]);
    } else {
      setMountPath(null);
      setCmd(null);
      setBranch(null);
      setSourcecodeParameters([]);
    }
  }, [sourcecode, setSourcecodeParameters]);

  useEffect(() => {
    if (!sourcecode || !sourcecodeDetail) return;
    if (sourcecodeDetail.sourceCodeId !== sourcecode.sourceCodeId) return;
    setSourcecodeParameters(toParameterArray(sourcecodeDetail.parameter));
  }, [sourcecode, sourcecodeDetail, setSourcecodeParameters]);

  const clearAddErrors = () => {
    setAddErrors({
      sourcecode: "",
      branch: "",
      mountPath: "",
      cmd: "",
    });
  };

  const handleAddSourcecode = () => {
    if (isAddDisabled) return;
    const nextErrors = {
      sourcecode: "",
      branch: "",
      mountPath: "",
      cmd: "",
    };

    if (!sourcecode) {
      nextErrors.sourcecode = "소스코드를 선택해 주세요.";
    }
    if (isNull(branch)) {
      nextErrors.branch = "Branch를 선택해 주세요.";
    }
    if (isEmpty(mountPath)) {
      nextErrors.mountPath = "마운트 경로를 입력해 주세요.";
    }
    if (isEmpty(cmd)) {
      nextErrors.cmd = "실행 명령어를 입력해 주세요.";
    }

    const hasErrors = Object.values(nextErrors).some(Boolean);
    if (hasErrors) {
      setAddErrors(nextErrors);
      return;
    }

    if (!sourcecode) {
      return;
    }

    const next = {
      sourceCodeId: sourcecode.sourceCodeId,
      sourceCodeBranch: branch || "",
      mountPath: mountPath || "",
    };
    setSourcecodes([...sourcecodes, next]);
    setSourcecodeInfoMapUi((prev) => ({
      ...prev,
      [sourcecode.sourceCodeId]: {
        sourceCodeId: sourcecode.sourceCodeId,
        sourceCodeName: sourcecode.sourceCodeName,
        gitUrl: sourcecode.gitUrl,
        mountPath: mountPath || "",
        sourceCodeType: sourcecode.sourceCodeType,
        isPublic: sourcecode.isPublic,
      },
    }));
    setExecutionCmd(buildExecutionCommand(cmd, sourcecodeParameters));
    setSourcecode(null);
    setBranch(null);
    setMountPath(null);
    setCmd(null);
    clearAddErrors();
  };

  const handleDeleteSourcecode = (sourceCodeId: number) => {
    setSourcecodes(
      sourcecodes.filter(
        (selectedSourcecode) =>
          selectedSourcecode.sourceCodeId !== sourceCodeId,
      ),
    );
    setSourcecodeInfoMapUi((prev) => {
      const { [sourceCodeId]: _, ...next } = prev;
      return next;
    });
  };

  const handleSourcecodeSelect = (
    nextSourcecode: SetStateAction<SourceCodeListResponse | null>,
  ) => {
    setSourcecode((prev) => {
      const resolved =
        typeof nextSourcecode === "function"
          ? nextSourcecode(prev)
          : nextSourcecode;
      if (resolved) {
        setAddErrors((prevErrors) => ({ ...prevErrors, sourcecode: "" }));
      }
      return resolved;
    });
  };

  const handleBranchChange = (value: string | number | null) => {
    setBranch(typeof value === "string" ? value : null);
    if (value) {
      setAddErrors((prev) => ({ ...prev, branch: "" }));
    }
  };

  const handleMountPathChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMountPath(e.target.value);
    if (e.target.value.trim() !== "") {
      setAddErrors((prev) => ({ ...prev, mountPath: "" }));
    }
  };

  const handleCmdChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCmd(e.target.value);
    if (e.target.value.trim() !== "") {
      setAddErrors((prev) => ({ ...prev, cmd: "" }));
    }
  };

  const handleToggleCollapsed = () => {
    setCollapsed((prev) => !prev);
  };

  // 소스코드 선택 시 마운트경로 및 명령어 정보 가져오기
  // useEffect(() => {
  //   if (sourcecode) {
  //     setMountPath(sourcecode.path || "");
  //     setCmd(sourcecode.cmd || "");
  //   }
  // }, [sourcecode]);
  const sourcecodeCards = sourcecodes.map((item) => (
    <SelectedSourcecodeCard
      key={item.sourceCodeId}
      item={item}
      info={sourcecodeInfoMapUi[item.sourceCodeId]}
      onDelete={handleDeleteSourcecode}
    />
  ));

  return (
    <Container>
      <Header>
        <CreateWorkloadSectionTitle>소스코드</CreateWorkloadSectionTitle>
        {/* <CreateModelButton
          title="소스코드 생성"
          onClick={handleSourceCodeCreate}
        /> */}
      </Header>
      {/* 소스코드 추가 영역 */}
      <Body>
        {/* 소스코드 목록과 Branch */}
        <Row>
          <Pane>
            <Typography.Text variant="body-2-4" color="#000000">
              소스코드 목록
            </Typography.Text>
            <SourcecodeSelect
              value={sourcecode}
              setValue={handleSourcecodeSelect}
            />
            {addErrors.sourcecode && (
              <ErrorMessage>{addErrors.sourcecode}</ErrorMessage>
            )}
          </Pane>
          <Pane>
            <Typography.Text variant="body-2-4" color="#000000">
              Branch
            </Typography.Text>
            <Dropdown
              placeholder="Branch를 선택해 주세요."
              options={branchOptions}
              value={branch}
              onChange={handleBranchChange}
              width="100%"
              disabled={!sourcecode || isLoadingBranches}
              loading={isLoadingBranches}
            />
            {addErrors.branch && (
              <ErrorMessage>{addErrors.branch}</ErrorMessage>
            )}
          </Pane>
        </Row>

        {/* 마운트 경로와 실행 명령어 */}
        <Row>
          <Pane>
            <Label>
              <LabelTitle>Mount Path</LabelTitle>
              <GuideTooltip title={<SourcecodeMountPathTooltipTitle />} />
            </Label>
            <Input
              placeholder="Mount Path를 입력해 주세요."
              value={mountPath || ""}
              onChange={handleMountPathChange}
            />
            {addErrors.mountPath && (
              <ErrorMessage>{addErrors.mountPath}</ErrorMessage>
            )}
          </Pane>

          <Pane>
            <Label>
              <LabelTitle>실행 명령어</LabelTitle>
              <GuideTooltip title={<SourcecodeCommandTooltipTitle />} />
            </Label>
            <Input
              placeholder="실행 명령어를 입력해 주세요."
              value={cmd || ""}
              onChange={handleCmdChange}
            />
            {addErrors.cmd && <ErrorMessage>{addErrors.cmd}</ErrorMessage>}
          </Pane>
        </Row>

        {/* 소스코드 추가 버튼 */}
        <AddButtonWrapper>
          <StyledAddButton
            variant="outlined"
            color="primary"
            onClick={handleAddSourcecode}
            icon="Plus"
            width="100%"
            height="30px"
            iconSize={20}
            disabled={isAddDisabled}
          >
            소스코드 추가
          </StyledAddButton>
        </AddButtonWrapper>
      </Body>

      {/* 소스코드 목록 박스 */}
      <Footer>
        <FooterHeader>
          <Typography.Text variant="body-2-2" color="#484848">
            선택된 소스코드
          </Typography.Text>
          <IconWrapper
            className={classNames({ collapsed })}
            onClick={handleToggleCollapsed}
          >
            <Icon name="Dropdown" size={16} color="#222223" />
          </IconWrapper>
        </FooterHeader>

        {!collapsed && (
          <SourceCodeCardsContainer>
            {sourcecodeCards}
            {sourcecodes.length === 0 && (
              <EmptyVolumeMessage>
                <Typography.Text variant="body-2-4" color="#707070">
                  선택된 소스코드가 없습니다.
                </Typography.Text>
              </EmptyVolumeMessage>
            )}
          </SourceCodeCardsContainer>
        )}
      </Footer>
    </Container>
  );
}

interface SelectedSourcecodeCardProps {
  item: WorkloadSourcecodeType;
  info?: WorkloadSourcecodeInfoUiType;
  onDelete: (sourceCodeId: number) => void;
}

function SelectedSourcecodeCard({
  item,
  info,
  onDelete,
}: SelectedSourcecodeCardProps) {
  const resolvedInfo = {
    sourceCodeId: item.sourceCodeId,
    sourceCodeName: info?.sourceCodeName ?? "-",
    gitUrl: info?.gitUrl ?? "-",
    mountPath: item.mountPath || info?.mountPath || "-",
    sourceCodeType: info?.sourceCodeType,
    isPublic: info?.isPublic,
  };

  return <WorkloadSourcecodeCard {...resolvedInfo} onDelete={onDelete} />;
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
  align-items: flex-start;
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
    display: flex;
    align-items: center;
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

const AddButtonWrapper = styled.div`
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

const ErrorMessage = styled.div`
  ${errorTextStyle}
`;
