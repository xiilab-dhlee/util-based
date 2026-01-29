"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import styled from "styled-components";
import type { StepItem } from "xiilab-ui";
import { Button, Drawer, Step, Typography } from "xiilab-ui";

import type { WorkloadDetailResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { CreateSourcecodeModal } from "@/domain/sourcecode/components/create-sourcecode-modal";
import { CreateAstragoVolumeModal } from "@/domain/volume/components/create-astrago-volume-modal";
import { CreateOnPremVolumeModal } from "@/domain/volume/components/create-onprem-volume-modal";
import { SelectVolumeTypeModal } from "@/domain/volume/components/select-volume-type-modal";
import { CreateWorkloadFirstStep } from "@/domain/workload/components/create/create-workload-first-step";
import { CreateWorkloadFourthStep } from "@/domain/workload/components/create/create-workload-fourth-step";
import { CreateWorkloadSecondStep } from "@/domain/workload/components/create/create-workload-second-step";
import { CreateWorkloadThirdStep } from "@/domain/workload/components/create/create-workload-third-step";
import {
  WORKLOAD_IMAGE_TYPES,
  WORKLOAD_JOB_TYPES,
  WORKLOAD_NODE_MODES,
} from "@/domain/workload/constants/workload.constant";
import { useCreateWorkloadAction } from "@/domain/workload/hooks/workload-actions";
import {
  type CreateWorkloadFormValues,
  createWorkloadFormSchema,
  createWorkloadStepFields,
} from "@/domain/workload/schemas/create-workload.schema";
import {
  distributedTypeAtom,
  envsAtom,
  executionCmdAtom,
  executionDirectoryAtom,
  harborImageNameAtom,
  imageTagNameAtom,
  imageTypeAtom,
  isDistributedLearningAtom,
  jobTypeAtom,
  labelsAtom,
  nodeModeAtom,
  nodeNameAtom,
  outputDirectoryAtom,
  parameterAtom,
  portsAtom,
  resourcePresetIdAtom,
  stepAtom,
  type WorkloadSourcecodeInfoUiType,
  type WorkloadVolumeInfoUiType,
  workerCountAtom,
  workloadDescriptionAtom,
  workloadNameAtom,
  workloadSourcecodeInfoMapUiAtom,
  workloadSourcecodesAtom,
  workloadVolumeInfoMapUiAtom,
  workloadVolumesAtom,
} from "@/domain/workload/state/create-workload.atom";
import type {
  CreateWorkloadPayload,
  WorkloadJobType,
} from "@/domain/workload/types/workload.type";
import { SelectWorkloadModal } from "@/shared/components/modal/select-workload-modal";
import { WORKLOAD_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";
import { selectedWorkspaceAtom } from "@/shared/state/core.atom";
import { openCreateWorkloadDrawerAtom } from "@/shared/state/modal.atom";
import { hideScrollbar } from "@/styles/mixins/scrollbar";

const STEP_ITEMS: StepItem[] = [
  {
    number: "01",
    description: "Job Type & Meta Data",
  },
  {
    number: "02",
    description: "Resource",
  },
  {
    number: "03",
    description: "Task",
  },
  {
    number: "04",
    description: "Command",
  },
];

const normalizeImageType = (
  value: string | null,
): CreateWorkloadFormValues["imageType"] => {
  if (!value) {
    return null;
  }

  if (
    value === WORKLOAD_IMAGE_TYPES.HUB ||
    value === WORKLOAD_IMAGE_TYPES.BUILT_IN ||
    value === WORKLOAD_IMAGE_TYPES.PRIVATE ||
    value === WORKLOAD_IMAGE_TYPES.PUBLIC
  ) {
    return value;
  }

  return null;
};

export function CreateWorkloadDrawer() {
  const selectedWorkspace = useAtomValue(selectedWorkspaceAtom);

  const { open, onOpen, onClose } = useGlobalModal(
    openCreateWorkloadDrawerAtom,
  );

  const [step, setStep] = useAtom(stepAtom);

  // Step 0: Job Type & Meta Data
  const [jobType, setJobType] = useAtom(jobTypeAtom);
  const [workloadName, setWorkloadName] = useAtom(workloadNameAtom);
  const [workloadDescription, setWorkloadDescription] = useAtom(
    workloadDescriptionAtom,
  );
  const [labels, setLabels] = useAtom(labelsAtom);
  const isDistributedLearning = useAtomValue(isDistributedLearningAtom);

  // Step 1: Resource
  const [nodeMode, setNodeMode] = useAtom(nodeModeAtom);
  const [nodeName, setNodeName] = useAtom(nodeNameAtom);
  const [resourcePresetId, setResourcePresetId] = useAtom(resourcePresetIdAtom);
  const [workerCount, setWorkerCount] = useAtom(workerCountAtom);
  const setDistributedType = useSetAtom(distributedTypeAtom);

  // Step 2: Image
  const [imageType, setImageType] = useAtom(imageTypeAtom);
  const [harborImageName, setHarborImageName] = useAtom(harborImageNameAtom);
  const [imageTagName, setImageTagName] = useAtom(imageTagNameAtom);

  // step 3: Task
  const [workloadSourcecodes, setWorkloadSourcecodes] = useAtom(
    workloadSourcecodesAtom,
  );
  const [, setWorkloadSourcecodeInfoMapUi] = useAtom(
    workloadSourcecodeInfoMapUiAtom,
  );
  const [workloadVolumes, setWorkloadVolumes] = useAtom(workloadVolumesAtom);
  const [, setWorkloadVolumeInfoMapUi] = useAtom(workloadVolumeInfoMapUiAtom);

  // step 4: Command
  const [outputDirectory, setOutputDirectory] = useAtom(outputDirectoryAtom);
  const [executionDirectory, setExecutionDirectory] = useAtom(
    executionDirectoryAtom,
  );
  const [executionCmd, setExecutionCmd] = useAtom(executionCmdAtom);
  const [parameter, setParameter] = useAtom(parameterAtom);
  const [envs, setEnvs] = useAtom(envsAtom);
  const [ports, setPorts] = useAtom(portsAtom);

  const isLastStep = step === STEP_ITEMS.length - 1;

  const getFormValuesFromAtoms = (): CreateWorkloadFormValues => ({
    workloadName,
    description: workloadDescription,
    label: labels,
    workloadJobType: jobType,
    nodeType: nodeMode,
    resourcePresetId,
    workerCount: workerCount ?? undefined,
    imageType: normalizeImageType(imageType),
    harborImageName,
    imageTagName,
    outputDirectory: outputDirectory ?? undefined,
    executionDirectory: executionDirectory ?? undefined,
    executionCmd: executionCmd ?? undefined,
    env: envs,
    port: ports,
    sourceCode: workloadSourcecodes[0] ?? undefined,
    volume: workloadVolumes,
    parameter,
  });

  const formMethods = useForm<CreateWorkloadFormValues>({
    resolver: zodResolver(createWorkloadFormSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: getFormValuesFromAtoms(),
  });

  const {
    handleSubmit: handleFormSubmit,
    reset,
    setValue,
    trigger,
  } = formMethods;

  useEffect(() => {
    setValue("workloadName", workloadName);
    setValue("description", workloadDescription);
    setValue("label", labels);
    setValue("workloadJobType", jobType);
    setValue("nodeType", nodeMode);
    setValue("resourcePresetId", resourcePresetId);
    setValue("workerCount", workerCount ?? undefined);
    setValue("imageType", normalizeImageType(imageType));
    setValue("harborImageName", harborImageName);
    setValue("imageTagName", imageTagName);
    setValue("outputDirectory", outputDirectory ?? undefined);
    setValue("executionDirectory", executionDirectory ?? undefined);
    setValue("executionCmd", executionCmd ?? undefined);
    setValue("parameter", parameter);
    setValue("env", envs);
    setValue("port", ports);
    setValue("sourceCode", workloadSourcecodes[0] ?? undefined);
    setValue("volume", workloadVolumes);
  }, [
    envs,
    executionCmd,
    executionDirectory,
    harborImageName,
    imageTagName,
    imageType,
    jobType,
    labels,
    nodeMode,
    outputDirectory,
    parameter,
    ports,
    resourcePresetId,
    setValue,
    workerCount,
    workloadDescription,
    workloadName,
    workloadSourcecodes,
    workloadVolumes,
  ]);

  const handleNext = async () => {
    const isStepValid = await trigger(createWorkloadStepFields[step], {
      shouldFocus: true,
    });

    if (!isStepValid) {
      return;
    }

    setStep((prev) => Math.min(prev + 1, STEP_ITEMS.length - 1));
  };

  const handlePrev = () => {
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const resetCreateWorkloadState = () => {
    setStep(0);
    setJobType(WORKLOAD_JOB_TYPES.BATCH);
    setWorkloadName("");
    setWorkloadDescription("");
    setLabels([]);
    setNodeMode(WORKLOAD_NODE_MODES.SINGLE);
    setNodeName(null);
    setResourcePresetId(null);
    setWorkerCount(null);
    setDistributedType(null);
    setHarborImageName("");
    setImageTagName("");
    setImageType(null);
    setWorkloadSourcecodes([]);
    setWorkloadSourcecodeInfoMapUi({});
    setWorkloadVolumes([]);
    setWorkloadVolumeInfoMapUi({});
    setOutputDirectory(null);
    setExecutionDirectory(null);
    setExecutionCmd(null);
    setParameter([]);
    setEnvs([]);
    setPorts([]);
    reset(getFormValuesFromAtoms());
  };

  const handleClose = () => {
    resetCreateWorkloadState();
    onClose();
  };

  const createWorkload = useCreateWorkloadAction({
    mutation: {
      onSuccess: () => {
        handleClose();
      },
    },
  });

  const handleCreateWorkload = (values: CreateWorkloadFormValues) => {
    const payload = createPayload(values);

    if (!payload || !selectedWorkspace?.workspaceId) {
      return;
    }

    createWorkload.mutate({
      workspaceId: selectedWorkspace.workspaceId,
      data: payload,
    });
  };

  const handleSubmit = handleFormSubmit(handleCreateWorkload);

  const createPayload = (
    values: CreateWorkloadFormValues,
  ): CreateWorkloadPayload | null => {
    if (!values.resourcePresetId) {
      return null;
    }

    const normalizedPorts = (values.port ?? []).flatMap((port) => {
      if (!port.portName.trim() || port.portNumber === undefined) {
        return [];
      }

      return [
        {
          portName: port.portName.trim(),
          portNumber: port.portNumber,
          servicePortNum: port.servicePortNum,
        },
      ];
    });

    return {
      workloadName: values.workloadName,
      description: values.description || undefined,
      label: values.label && values.label.length > 0 ? values.label : undefined,
      workloadJobType: isDistributedLearning
        ? WORKLOAD_JOB_TYPES.DISTRIBUTED
        : values.workloadJobType,
      nodeType: values.nodeType,
      nodeName: nodeName || undefined,
      resourcePresetId: values.resourcePresetId,
      harborImageName: values.harborImageName ?? "",
      imageTagName: values.imageTagName ?? "",
      outputDirectory: values.outputDirectory || undefined,
      executionDirectory: values.executionDirectory || undefined,
      executionCmd: values.executionCmd || undefined,
      env: values.env && values.env.length > 0 ? values.env : undefined,
      port: normalizedPorts.length > 0 ? normalizedPorts : undefined,
      sourceCode: values.sourceCode || undefined,
      volume:
        values.volume && values.volume.length > 0 ? values.volume : undefined,
      parameter:
        values.parameter && values.parameter.length > 0
          ? values.parameter
          : undefined,
      workerCount: values.workerCount || undefined,
    };
  };

  // 현재 단계에 맞는 컴포넌트 렌더링
  const renderCurrentStepContent = () => {
    switch (step) {
      case 0:
        return <CreateWorkloadFirstStep />;
      case 1:
        return <CreateWorkloadSecondStep />;
      case 2:
        return <CreateWorkloadThirdStep />;
      case 3:
        return <CreateWorkloadFourthStep />;
    }
  };

  useSubscribe(
    WORKLOAD_EVENTS.sendCreateWorkload,
    (eventData: WorkloadDetailResponse) => {
      // eventData가 없는 경우 워크로드 생성
      // eventData가 있는 경우 워크로드 복제

      // Step 0: Job Type & Meta Data
      if (eventData?.workloadJobType) {
        // 분산 잡 타입인 경우 배치 잡 타입으로 설정
        if (eventData.workloadJobType === WORKLOAD_JOB_TYPES.DISTRIBUTED) {
          setJobType(WORKLOAD_JOB_TYPES.BATCH);
        } else {
          setJobType(eventData.workloadJobType as WorkloadJobType);
        }
      } else {
        setJobType(WORKLOAD_JOB_TYPES.BATCH);
      }
      setWorkloadName(eventData?.workloadName || "");
      setWorkloadDescription(eventData?.description || "");
      setLabels([]);

      // Step 1: Resource
      setNodeMode(eventData?.nodeType || WORKLOAD_NODE_MODES.SINGLE);
      setNodeName(eventData?.workloadResourceName || null);
      setResourcePresetId(eventData?.resourcePreset?.resourcePresetId || null);
      setWorkerCount(eventData?.workerCount || null);

      // Step 2: Image
      setHarborImageName(eventData?.image?.harborImageName || "");
      setImageTagName(eventData?.image?.imageTagName || "");

      // step 3: Task
      setWorkloadSourcecodes(
        eventData?.sourceCode
          ? [
              {
                sourceCodeId: eventData.sourceCode.sourceCodeId,
                sourceCodeBranch: eventData.sourceCode.branch,
                mountPath: eventData.sourceCode.mountPath,
              },
            ]
          : [],
      );
      setWorkloadSourcecodeInfoMapUi(
        eventData?.sourceCode
          ? ({
              [eventData.sourceCode.sourceCodeId]: {
                sourceCodeId: eventData.sourceCode.sourceCodeId,
                sourceCodeName: eventData.sourceCode.sourceCodeName,
                gitUrl: eventData.sourceCode.gitUrl,
                mountPath: eventData.sourceCode.mountPath,
                sourceCodeType: eventData.sourceCode.sourceCodeType,
              },
            } satisfies Record<number, WorkloadSourcecodeInfoUiType>)
          : {},
      );
      setWorkloadVolumes(eventData?.volume || []);
      setWorkloadVolumeInfoMapUi(
        (eventData?.volume || []).reduce<
          Record<number, WorkloadVolumeInfoUiType>
        >((acc, volume) => {
          acc[volume.volumeId] = {
            volumeId: volume.volumeId,
            volumeName: volume.volumeName,
            volumeType: volume.volumeType,
            mountPath: volume.mountPath,
            fileSizeByte: volume.volumeSize,
          };
          return acc;
        }, {}),
      );

      // step 4: Command
      setOutputDirectory(eventData?.outputDirectory || null);
      setExecutionDirectory(eventData?.executionDirectory || null);
      setExecutionCmd(eventData?.executionCommand || null);
      setParameter(eventData?.parameter || []);
      setEnvs(eventData?.env || []);
      setPorts(eventData?.port || []);

      setStep(0);
      onOpen();
    },
  );

  return (
    <FormProvider {...formMethods}>
      <Drawer
        open={open}
        onClose={handleClose}
        placement="right"
        width={620}
        title={
          <Header>
            <PurpleBar />
            <Typography.Text variant="title-2">워크로드 생성</Typography.Text>
          </Header>
        }
        footer={
          <Footer>
            {step === 0 && (
              <CancelButton>
                <Button
                  variant="outlined"
                  size="medium"
                  onClick={handleClose}
                  width="100%"
                >
                  <Typography.Text variant="button-1">취소</Typography.Text>
                </Button>
              </CancelButton>
            )}

            {step > 0 && (
              <CancelButton>
                <Button
                  variant="outlined"
                  size="medium"
                  onClick={handlePrev}
                  width="100%"
                >
                  <Typography.Text variant="button-1">
                    이전 단계
                  </Typography.Text>
                </Button>
              </CancelButton>
            )}

            <ActionButton>
              <Button
                color="primary"
                variant="gradient"
                size="medium"
                onClick={isLastStep ? handleSubmit : handleNext}
                iconPosition={isLastStep ? "left" : "right"}
                icon={isLastStep ? "Plus" : "Front"}
                iconSize={24}
                width="100%"
              >
                <Typography.Text
                  variant="body-1-1"
                  color="var(--color-gray-13)"
                >
                  {isLastStep ? "워크로드 생성" : "다음 단계"}
                </Typography.Text>
              </Button>
            </ActionButton>
          </Footer>
        }
        closable={true}
        maskClosable={true} // 배경 클릭으로 닫기 활성화
        styles={{
          header: {
            padding: "27px 24px 21px 24px",
          },
          body: {
            padding: "0px 24px 0px 24px",
          },
        }}
      >
        <Container>
          <StepWrapper>
            <Step steps={STEP_ITEMS} currentStep={step} />
          </StepWrapper>
          <Body>
            {/* 현재 단계에 맞는 폼 컴포넌트 렌더링 */}
            {renderCurrentStepContent()}
          </Body>
        </Container>
      </Drawer>
      {/* 소스코드 생성 모달 */}
      <CreateSourcecodeModal />
      {/* 볼륨 생성 모달 */}
      <SelectVolumeTypeModal />
      <CreateAstragoVolumeModal />
      <CreateOnPremVolumeModal />
      {/* 워크로드 가져오기 모달 */}
      <SelectWorkloadModal />
    </FormProvider>
  );
}

// 전체 컨테이너 래퍼
const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const PurpleBar = styled.div`
  width: 2px;
  height: 16px;
  flex-shrink: 0;
  background: var(--color-purple-02);
`;

const StepWrapper = styled.div`
  position: sticky;
  top: 0;
  z-index: 10;
  width: calc(100% + 12px);
`;

const Body = styled.div`
  flex: 1;
  width: 100%;
  overflow-y: auto;
  padding-top: 20px;

  ${hideScrollbar}
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  width: 100%;
`;

const CancelButton = styled.div`
  width: 20%;
`;

const ActionButton = styled.div`
  width: 80%;
`;
