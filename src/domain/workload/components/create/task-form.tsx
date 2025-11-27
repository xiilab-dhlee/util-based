// @exclude-on-build

"use client";

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";
import {
  Button,
  Dropdown,
  Icon,
  Input,
  TabsSeparated,
  Tooltip,
  Typography,
} from "xiilab-ui";

import { openSelectVolumeModalAtom } from "@/atoms/volume/volume-list.atom";
import { selectedImageTypeAtom } from "@/atoms/workload/create-workload-modal.atom";
import {
  addModelDataAtom,
  addSourceCodeAtom,
  addVolumeAtom,
  removeModelDataAtom,
  removeSourceCodeAtom,
  removeVolumeAtom,
  type SourceCodeItem,
  setActiveTabAtom,
  setExecuteCommandAtom,
  setModelListExpandedAtom,
  setModelMountPathAtom,
  setMountPathAtom,
  setOutputPathAtom,
  setSelectedBranchAtom,
  setSelectedModelDataAtom,
  setSelectedSourceCodeAtom,
  setSelectedVolumeAtom,
  setSourceCodeCreateModalOpenAtom,
  setSourceCodeListExpandedAtom,
  setSourceCodeMountPathAtom,
  setVolumeListExpandedAtom,
  taskFormStateAtom,
  updateModelDataMountPathAtom,
  updateSourceCodeAtom,
  updateVolumeMountPathAtom,
  type VolumeWithMountPath,
} from "@/atoms/workload/task-form.atom";
import SourceCodeCreateModal from "@/components/sourcecode/sourcecode-create-modal";
import SourceCodeCardForWorkload from "@/components/workload/create-workload/sourcecode-card-for-workload";
import VolumeCardForWorkload from "@/components/workload/create-workload/volume-card-for-workload";
import type { CreateSourcecodePayload } from "@/types/sourcecode/sourcecode.type";
import { SectionTitle as CommonSectionTitle } from "../common/section-title";

interface TaskFormProps {
  className?: string;
}

function TaskForm({ className }: TaskFormProps) {
  // 모달 상태 관리
  const setOpenSelectVolumeModal = useSetAtom(openSelectVolumeModalAtom);

  // 이미지 타입 확인
  const selectedImageType = useAtomValue(selectedImageTypeAtom);

  // TaskForm 상태 관리
  const [taskFormState] = useAtom(taskFormStateAtom);

  // 액션 atoms
  const [, setActiveTab] = useAtom(setActiveTabAtom);
  const [, setSelectedSourceCode] = useAtom(setSelectedSourceCodeAtom);
  const [, setSelectedBranch] = useAtom(setSelectedBranchAtom);
  const [, setSourceCodeMountPath] = useAtom(setSourceCodeMountPathAtom);
  const [, setExecuteCommand] = useAtom(setExecuteCommandAtom);
  const [, addSourceCode] = useAtom(addSourceCodeAtom);
  const [, removeSourceCode] = useAtom(removeSourceCodeAtom);
  const [, updateSourceCode] = useAtom(updateSourceCodeAtom);
  const [, setSourceCodeListExpanded] = useAtom(setSourceCodeListExpandedAtom);
  const [, setSourceCodeCreateModalOpen] = useAtom(
    setSourceCodeCreateModalOpenAtom,
  );
  const [, setSelectedVolume] = useAtom(setSelectedVolumeAtom);
  const [, setMountPath] = useAtom(setMountPathAtom);
  const [, addVolume] = useAtom(addVolumeAtom);
  const [, removeVolume] = useAtom(removeVolumeAtom);
  const [, updateVolumeMountPath] = useAtom(updateVolumeMountPathAtom);
  const [, setVolumeListExpanded] = useAtom(setVolumeListExpandedAtom);
  const [, setSelectedModelData] = useAtom(setSelectedModelDataAtom);
  const [, setModelMountPath] = useAtom(setModelMountPathAtom);
  const [, addModelData] = useAtom(addModelDataAtom);
  const [, removeModelData] = useAtom(removeModelDataAtom);
  const [, updateModelDataMountPath] = useAtom(updateModelDataMountPathAtom);
  const [, setModelListExpanded] = useAtom(setModelListExpandedAtom);
  const [, setOutputPath] = useAtom(setOutputPathAtom);

  // 상태 값들 추출
  const {
    activeTab,
    selectedSourceCode,
    selectedBranch,
    sourceCodeMountPath,
    executeCommand,
    addedSourceCodes,
    isSourceCodeListExpanded,
    isSourceCodeCreateModalOpen,
    selectedVolume,
    mountPath,
    addedVolumes,
    selectedModelData,
    modelMountPath,
    addedModelData,
    isVolumeListExpanded,
    isModelListExpanded,
    outputPath,
  } = taskFormState;

  // 소스코드 목록 옵션 (예시)
  const sourceCodeOptions = [
    { label: "pytorch-training", value: "pytorch-training" },
    { label: "tensorflow-model", value: "tensorflow-model" },
    { label: "data-preprocessing", value: "data-preprocessing" },
  ];

  // Branch 목록 옵션 (예시)
  const branchOptions = [
    { label: "main", value: "main" },
    { label: "develop", value: "develop" },
    { label: "feature/model-update", value: "feature/model-update" },
  ];

  // 볼륨 목록 옵션 (예시)
  const volumeOptions = [
    { label: "Mobel data_1218", value: "mobel-data-1218" },
    { label: "Training Dataset", value: "training-dataset" },
    { label: "Model Weights", value: "model-weights" },
  ];

  // Model data 목록 옵션 (예시)
  const modelDataOptions = [
    { label: "Model A_v1.0", value: "model-a-v1" },
    { label: "Model B_v2.0", value: "model-b-v2" },
    { label: "Model C_v1.5", value: "model-c-v1.5" },
  ];

  const handleSourceCodeCreate = () => {
    setSourceCodeCreateModalOpen(true);
  };

  const handleSourceCodeCreateModalClose = () => {
    setSourceCodeCreateModalOpen(false);
  };

  const handleSourceCodeCreateSubmit = (data: CreateSourcecodePayload) => {
    const newSourceCode: SourceCodeItem = {
      uid: uuidv4(),
      name: data.gitUrl, // Using gitUrl as name for now
      url: data.gitUrl,
      branch: "main", // 기본 브랜치
      mountPath: data.mountPath,
      executeCommand: data.executeCommand,
      sourceType: data.gitType as "Github" | "Gitlab",
    };
    addSourceCode(newSourceCode);
  };

  const handleSourceCodeAdd = () => {
    if (
      selectedSourceCode &&
      selectedBranch &&
      sourceCodeMountPath &&
      executeCommand
    ) {
      const newSourceCode: SourceCodeItem = {
        uid: uuidv4(),
        name:
          sourceCodeOptions.find((s) => s.value === selectedSourceCode)
            ?.label || selectedSourceCode,
        url:
          sourceCodeOptions.find((s) => s.value === selectedSourceCode)
            ?.label || selectedSourceCode,
        branch: selectedBranch,
        mountPath: sourceCodeMountPath,
        executeCommand: executeCommand,
        sourceType: "Github", // 기본값
      };
      addSourceCode(newSourceCode);
      // 초기화
      setSelectedSourceCode(undefined);
      setSelectedBranch(undefined);
      setSourceCodeMountPath("");
      setExecuteCommand("");
      setSourceCodeListExpanded(true); // 소스코드 추가 후 목록 자동 펼치기
    }
  };

  const handleSourceCodeDelete = (uid: string) => {
    removeSourceCode(uid);
  };

  const handleSourceCodeEdit = (
    uid: string,
    data: { branch: string; mountPath: string; executeCommand: string },
  ) => {
    updateSourceCode(uid, data);
  };

  const handleVolumeCreate = () => {
    setOpenSelectVolumeModal(true);
  };

  const handleVolumeAdd = () => {
    if (selectedVolume && mountPath) {
      const newVolume: VolumeWithMountPath = {
        uid: uuidv4(),
        name:
          volumeOptions.find((v) => v.value === selectedVolume)?.label ||
          selectedVolume,
        creatorName: "사용자",
        creatorDate: new Date().toISOString(),
        storageType: "ASTRAGO" as const,
        mountPath: mountPath,
        labels: [],
        // 추가 필드
        resourceName: selectedVolume,
        description: "워크로드에서 추가된 볼륨",
        creatorId: "user-123",
        workspaceName: "astrago-workspace-test",
        requestVolume: "1210 Bytes",
        used: true as const,
      };
      addVolume(newVolume);
      setSelectedVolume(undefined);
      setMountPath("");
      setVolumeListExpanded(true); // 볼륨 추가 후 목록 자동 펼치기
    }
  };

  const handleVolumeDelete = (volumeUid: string) => {
    removeVolume(volumeUid);
  };

  const handleMountPathUpdate = (volumeUid: string, newMountPath: string) => {
    updateVolumeMountPath(volumeUid, newMountPath);
  };

  const handleModelDataCreate = () => {
    setOpenSelectVolumeModal(true);
  };

  const handleModelDataAdd = () => {
    if (selectedModelData && modelMountPath) {
      const newModelData: VolumeWithMountPath = {
        uid: uuidv4(),
        name:
          modelDataOptions.find((v) => v.value === selectedModelData)?.label ||
          selectedModelData,
        creatorName: "사용자",
        creatorDate: new Date().toISOString(),
        storageType: "ASTRAGO" as const,
        mountPath: modelMountPath,
        labels: [],
        // 추가 필드
        resourceName: selectedModelData,
        description: "워크로드에서 추가된 모델 데이터",
        creatorId: "user-123",
        workspaceName: "astrago-workspace-test",
        requestVolume: "1210 Bytes",
        used: true as const,
      };
      addModelData(newModelData);
      setSelectedModelData(undefined);
      setModelMountPath("");
      setModelListExpanded(true); // 모델 데이터 추가 후 목록 자동 펼치기
    }
  };

  const handleModelDataDelete = (modelUid: string) => {
    removeModelData(modelUid);
  };

  const handleModelMountPathUpdate = (
    modelUid: string,
    newMountPath: string,
  ) => {
    updateModelDataMountPath(modelUid, newMountPath);
  };

  return (
    <Container className={className}>
      {/* Input 섹션 */}
      <SectionContainer>
        <FieldContainer>
          <FieldHeader>
            <Typography.Text variant="subtitle-2-1">Input</Typography.Text>
            <OptionalText>
              <Typography.Text variant="body-4-1" color="#707070">
                (선택사항)
              </Typography.Text>
            </OptionalText>
          </FieldHeader>

          {/* 소스코드 섹션: 빌트인 이미지일 때와 아닐 때 다르게 표시 */}
          {selectedImageType === "builtin" ? (
            <>
              {/* 빌트인 이미지: 소스코드 추가 UI */}
              <SourceCodeContainer>
                <SourceCodeAddHeader>
                  <CommonSectionTitle>소스코드 추가</CommonSectionTitle>
                  <VolumeCreateButton onClick={handleSourceCodeCreate}>
                    <Icon name="PlusCircle" size={16} color="#666666" />
                    <Typography.Text variant="body-2-4" color="#666666">
                      소스코드 생성
                    </Typography.Text>
                  </VolumeCreateButton>
                </SourceCodeAddHeader>

                {/* 소스코드 추가 영역 */}
                <VolumeAddSection>
                  {/* 소스코드 목록과 Branch */}
                  <VolumeFormRow>
                    <VolumeSelectContainer>
                      <Typography.Text variant="body-2-4" color="#000000">
                        소스코드 목록
                      </Typography.Text>
                      <Dropdown
                        placeholder="소스코드를 선택해 주세요."
                        options={sourceCodeOptions}
                        value={selectedSourceCode}
                        onChange={(value) => setSelectedSourceCode(value)}
                        width="100%"
                      />
                    </VolumeSelectContainer>

                    <VolumeSelectContainer>
                      <Typography.Text variant="body-2-4" color="#000000">
                        Branch
                      </Typography.Text>
                      <Dropdown
                        placeholder="Branch를 선택해 주세요."
                        options={branchOptions}
                        value={selectedBranch}
                        onChange={(value) => setSelectedBranch(value)}
                        width="100%"
                      />
                    </VolumeSelectContainer>
                  </VolumeFormRow>

                  {/* 마운트 경로와 실행 명령어 */}
                  <VolumeFormRow>
                    <MountPathContainer>
                      <LabelWithTooltip>
                        <Typography.Text variant="body-2-4" color="#000000">
                          마운트 경로
                        </Typography.Text>
                        <Tooltip
                          title={
                            <TooltipContent>
                              컨테이너 안에서 선택한{" "}
                              <TooltipHighlight>
                                소스코드의 디렉토리
                              </TooltipHighlight>
                              가 마운트되는 경로입니다.
                            </TooltipContent>
                          }
                        >
                          <TooltipIconWrapper>
                            <Icon name="Tooltip" size={16} color="#5F6368" />
                          </TooltipIconWrapper>
                        </Tooltip>
                      </LabelWithTooltip>
                      <Input
                        placeholder="Mount path를 입력해 주세요."
                        value={sourceCodeMountPath}
                        onChange={(e) => setSourceCodeMountPath(e.target.value)}
                      />
                    </MountPathContainer>

                    <MountPathContainer>
                      <LabelWithTooltip>
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
                      </LabelWithTooltip>
                      <Input
                        placeholder="실행 명령어를 입력해 주세요."
                        value={executeCommand}
                        onChange={(e) => setExecuteCommand(e.target.value)}
                      />
                    </MountPathContainer>
                  </VolumeFormRow>

                  {/* 소스코드 추가 버튼 */}
                  <VolumeAddButtonWrapper>
                    <StyledAddButton
                      variant="outlined"
                      color="primary"
                      onClick={handleSourceCodeAdd}
                      icon="Add"
                      width="100%"
                      height="30px"
                    >
                      소스코드 추가
                    </StyledAddButton>
                  </VolumeAddButtonWrapper>
                </VolumeAddSection>

                {/* 소스코드 목록 박스 */}
                <VolumeListSection>
                  <VolumeListHeader
                    onClick={() =>
                      setSourceCodeListExpanded(!isSourceCodeListExpanded)
                    }
                  >
                    <Typography.Text variant="body-2-2" color="#484848">
                      소스코드 목록
                    </Typography.Text>
                    <VolumeListIcons>
                      <Icon name="Dropdown" size={16} color="#5F6368" />
                      <Icon
                        name={
                          isSourceCodeListExpanded ? "ChevronUp" : "ChevronDown"
                        }
                        size={20}
                        color="#5F6368"
                      />
                    </VolumeListIcons>
                  </VolumeListHeader>

                  {isSourceCodeListExpanded && (
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
                            onDelete={() =>
                              handleSourceCodeDelete(sourceCode.uid)
                            }
                            onEdit={(data) =>
                              handleSourceCodeEdit(sourceCode.uid, data)
                            }
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
                  )}
                </VolumeListSection>
              </SourceCodeContainer>

              {/* 구분선 */}
              <Divider />
            </>
          ) : (
            <>
              {/* 다른 이미지: 소스코드 정보 박스 */}
              <SourceCodeContainer>
                <Typography.Text variant="subtitle-2-1">
                  소스코드
                </Typography.Text>
                <SourceCodeInfo>
                  <InfoText>
                    <Typography.Text variant="body-2-4" color="#000000">
                      허브 이미지 선택 시, 해당 이미지 내에 소스코드가 사전
                      패키징되어 포함되어 있습니다.
                    </Typography.Text>
                  </InfoText>
                </SourceCodeInfo>
              </SourceCodeContainer>

              {/* 구분선 */}
              <Divider />
            </>
          )}

          {/* Volume Mount 영역 */}
          <VolumeContainer>
            {/* Volume Mount + Tabs 그룹 */}
            <VolumeMountGroup>
              <Typography.Text variant="subtitle-2-1">
                Volume Mount
              </Typography.Text>

              {/* 탭 컴포넌트 */}
              <TabsContainer>
                <TabsSeparated
                  items={[
                    { key: "volume", label: "Volume" },
                    { key: "model", label: "Model data" },
                  ]}
                  activeKey={activeTab}
                  onChange={setActiveTab}
                />
              </TabsContainer>
            </VolumeMountGroup>

            {/* 볼륨/모델 데이터 추가 + 박스 그룹 */}
            <VolumeAddGroup>
              {/* Volume 탭 내용 */}
              {activeTab === "volume" && (
                <>
                  {/* 볼륨 추가 제목과 생성 버튼 */}
                  <VolumeAddHeader>
                    <CommonSectionTitle>볼륨 추가</CommonSectionTitle>
                    <VolumeCreateButton onClick={handleVolumeCreate}>
                      <Icon name="PlusCircle" size={16} color="#666666" />
                      <Typography.Text variant="body-2-4" color="#666666">
                        볼륨 생성
                      </Typography.Text>
                    </VolumeCreateButton>
                  </VolumeAddHeader>

                  {/* 볼륨 추가 영역 (border로 감싸기) */}
                  <VolumeAddSection>
                    {/* 볼륨 목록과 마운트 경로 */}
                    <VolumeFormRow>
                      <VolumeSelectContainer>
                        <Typography.Text variant="body-2-4" color="#000000">
                          볼륨 목록
                        </Typography.Text>
                        <Dropdown
                          placeholder="볼륨을 선택해 주세요."
                          options={volumeOptions}
                          value={selectedVolume}
                          onChange={(value) => setSelectedVolume(value)}
                          width="100%"
                        />
                      </VolumeSelectContainer>

                      <MountPathContainer>
                        <LabelWithTooltip>
                          <Typography.Text variant="body-2-4" color="#000000">
                            마운트 경로
                          </Typography.Text>
                          <Tooltip
                            title={
                              <TooltipContent>
                                컨테이너 안에서 선택한{" "}
                                <TooltipHighlight>
                                  Volume의 디렉토리
                                </TooltipHighlight>
                                가 마운트되는 경로입니다.
                              </TooltipContent>
                            }
                          >
                            <TooltipIconWrapper>
                              <Icon name="Tooltip" size={16} color="#5F6368" />
                            </TooltipIconWrapper>
                          </Tooltip>
                        </LabelWithTooltip>
                        <Input
                          placeholder="Mount path를 입력해 주세요."
                          value={mountPath}
                          onChange={(e) => setMountPath(e.target.value)}
                        />
                      </MountPathContainer>
                    </VolumeFormRow>

                    {/* 볼륨 추가 버튼 */}
                    <VolumeAddButtonWrapper>
                      <StyledAddButton
                        variant="outlined"
                        color="primary"
                        onClick={handleVolumeAdd}
                        icon="Add"
                        width="100%"
                        height="30px"
                      >
                        볼륨 추가
                      </StyledAddButton>
                    </VolumeAddButtonWrapper>
                  </VolumeAddSection>

                  {/* 볼륨 목록 박스 - 별도 컨테이너 */}
                  <VolumeListSection>
                    <VolumeListHeader
                      onClick={() =>
                        setVolumeListExpanded(!isVolumeListExpanded)
                      }
                    >
                      <Typography.Text variant="body-2-2" color="#484848">
                        볼륨 목록
                      </Typography.Text>
                      <VolumeListIcons>
                        <Icon name="Dropdown" size={16} color="#5F6368" />
                        <Icon
                          name={
                            isVolumeListExpanded ? "ChevronUp" : "ChevronDown"
                          }
                          size={20}
                          color="#5F6368"
                        />
                      </VolumeListIcons>
                    </VolumeListHeader>

                    {isVolumeListExpanded && (
                      <VolumeCardsContainer>
                        {addedVolumes.length > 0 ? (
                          addedVolumes.map((volume) => (
                            <VolumeCardForWorkload
                              key={volume.uid}
                              {...volume}
                              mountPath={volume.mountPath}
                              onDelete={() => handleVolumeDelete(volume.uid)}
                              onMountPathUpdate={(newMountPath) =>
                                handleMountPathUpdate(volume.uid, newMountPath)
                              }
                            />
                          ))
                        ) : (
                          <EmptyVolumeMessage>
                            <Typography.Text variant="body-2-4" color="#707070">
                              추가된 볼륨이 없습니다.
                            </Typography.Text>
                          </EmptyVolumeMessage>
                        )}
                      </VolumeCardsContainer>
                    )}
                  </VolumeListSection>
                </>
              )}

              {/* Model data 탭 내용 */}
              {activeTab === "model" && (
                <>
                  {/* Model data 추가 제목과 생성 버튼 */}
                  <VolumeAddHeader>
                    <Typography.Text variant="subtitle-2-1">
                      Model data 추가
                    </Typography.Text>
                    <VolumeCreateButton onClick={handleModelDataCreate}>
                      <Icon name="PlusCircle" size={16} color="#666666" />
                      <Typography.Text variant="body-2-4" color="#666666">
                        Model data 생성
                      </Typography.Text>
                    </VolumeCreateButton>
                  </VolumeAddHeader>

                  {/* Model data 추가 영역 (border로 감싸기) */}
                  <VolumeAddSection>
                    {/* Model data 목록과 마운트 경로 */}
                    <VolumeFormRow>
                      <VolumeSelectContainer>
                        <Typography.Text variant="body-2-4" color="#000000">
                          Model data 목록
                        </Typography.Text>
                        <Dropdown
                          placeholder="Model data를 선택해 주세요."
                          options={modelDataOptions}
                          value={selectedModelData}
                          onChange={(value) => setSelectedModelData(value)}
                          width="100%"
                        />
                      </VolumeSelectContainer>

                      <MountPathContainer>
                        <LabelWithTooltip>
                          <Typography.Text variant="body-2-4" color="#000000">
                            마운트 경로
                          </Typography.Text>
                          <Tooltip
                            title={
                              <TooltipContent>
                                컨테이너 안에서 선택한{" "}
                                <TooltipHighlight>
                                  Model data의 디렉토리
                                </TooltipHighlight>
                                가 마운트되는 경로입니다.
                              </TooltipContent>
                            }
                          >
                            <TooltipIconWrapper>
                              <Icon name="Tooltip" size={16} color="#5F6368" />
                            </TooltipIconWrapper>
                          </Tooltip>
                        </LabelWithTooltip>
                        <Input
                          placeholder="Mount path를 입력해 주세요."
                          value={modelMountPath}
                          onChange={(e) => setModelMountPath(e.target.value)}
                        />
                      </MountPathContainer>
                    </VolumeFormRow>

                    {/* Model data 추가 버튼 */}
                    <VolumeAddButtonWrapper>
                      <StyledAddButton
                        variant="outlined"
                        color="primary"
                        onClick={handleModelDataAdd}
                        icon="Add"
                        width="100%"
                        height="30px"
                      >
                        Model data 추가
                      </StyledAddButton>
                    </VolumeAddButtonWrapper>
                  </VolumeAddSection>

                  {/* Model data 목록 박스 - 별도 컨테이너 */}
                  <VolumeListSection>
                    <VolumeListHeader
                      onClick={() => setModelListExpanded(!isModelListExpanded)}
                    >
                      <Typography.Text variant="body-2-2" color="#484848">
                        Model data 목록
                      </Typography.Text>
                      <VolumeListIcons>
                        <Icon name="Dropdown" size={16} color="#5F6368" />
                        <Icon
                          name={
                            isModelListExpanded ? "ChevronUp" : "ChevronDown"
                          }
                          size={20}
                          color="#5F6368"
                        />
                      </VolumeListIcons>
                    </VolumeListHeader>

                    {isModelListExpanded && (
                      <VolumeCardsContainer>
                        {addedModelData.length > 0 ? (
                          addedModelData.map((model) => (
                            <VolumeCardForWorkload
                              key={model.uid}
                              {...model}
                              mountPath={model.mountPath}
                              onDelete={() => handleModelDataDelete(model.uid)}
                              onMountPathUpdate={(newMountPath) =>
                                handleModelMountPathUpdate(
                                  model.uid,
                                  newMountPath,
                                )
                              }
                            />
                          ))
                        ) : (
                          <EmptyVolumeMessage>
                            <Typography.Text variant="body-2-4" color="#707070">
                              추가된 Model data가 없습니다.
                            </Typography.Text>
                          </EmptyVolumeMessage>
                        )}
                      </VolumeCardsContainer>
                    )}
                  </VolumeListSection>
                </>
              )}
            </VolumeAddGroup>
          </VolumeContainer>
        </FieldContainer>
      </SectionContainer>

      {/* Output 경로 섹션 */}
      <SectionContainer>
        <FieldContainer>
          <FieldHeader>
            <Typography.Text variant="subtitle-2-1">
              Output 경로
            </Typography.Text>
            <OptionalText>
              <Typography.Text variant="body-4-1" color="#707070">
                (선택사항)
              </Typography.Text>
            </OptionalText>
          </FieldHeader>

          <Input
            placeholder="Output 경로를 입력해주세요."
            value={outputPath}
            onChange={(e) => setOutputPath(e.target.value)}
          />
        </FieldContainer>
      </SectionContainer>

      {/* 소스코드 생성 모달 */}
      <SourceCodeCreateModal
        isOpen={isSourceCodeCreateModalOpen}
        onClose={handleSourceCodeCreateModalClose}
        onCreate={handleSourceCodeCreateSubmit}
      />
    </Container>
  );
}

export default TaskForm;

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-bottom: 24px;
`;

// step2와 동일한 SectionContainer 스타일
const SectionContainer = styled.div`
  background-color: #fcfcfc;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 20px;
`;

const FieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FieldHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const OptionalText = styled.div`
  margin-left: 4px;
`;

const SourceCodeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SourceCodeInfo = styled.div`
  padding: 16px;
  background: #fcfcfc;
  border: 1px solid #c1c7ce;
  border-radius: 4px;
`;

const InfoText = styled.div`
  padding: 0 48px 0 0;
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: #e0e0e0;
  margin: 16px 0;
`;

const VolumeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const VolumeMountGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const VolumeAddGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TabsContainer = styled.div`
  width: 100%;
`;

const VolumeAddHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
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

const SourceCodeAddHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const VolumeFormRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: end;
`;

const VolumeSelectContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
`;

const MountPathContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
`;

const LabelWithTooltip = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const VolumeAddSection = styled.div`
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

const VolumeListSection = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #fafafa;
  border: 1px solid #d1d5dc;
  border-radius: 4px;
  padding: 10px;
  gap: 8px;
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

const VolumeCardsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  > * {
    flex: 1;
    min-width: calc(50% - 4px);
    max-width: calc(50% - 4px);
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
