"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom, useAtomValue } from "jotai";
import { useAtomCallback } from "jotai/utils";
import { useCallback, useEffect, useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import styled from "styled-components";
import type { StepItem } from "xiilab-ui";
import { Button, Drawer, Step, Typography } from "xiilab-ui";

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
  workerCountAtom,
  workloadDescriptionAtom,
  workloadNameAtom,
  workloadSourcecodesAtom,
  workloadVolumesAtom,
} from "@/domain/workload/state/create-workload.atom";
import type { CreateWorkloadPayload } from "@/domain/workload/types/workload.type";
import { resetAllWorkloadAtoms } from "@/domain/workload/utils/reset-workload-atoms";
import { SelectWorkloadModal } from "@/shared/components/modal/select-workload-modal";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
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

  const { open, onClose } = useGlobalModal(openCreateWorkloadDrawerAtom);

  const [step, setStep] = useAtom(stepAtom);

  // Step 0: Job Type & Meta Data
  const jobType = useAtomValue(jobTypeAtom);
  const workloadName = useAtomValue(workloadNameAtom);
  const workloadDescription = useAtomValue(workloadDescriptionAtom);
  const labels = useAtomValue(labelsAtom);
  const isDistributedLearning = useAtomValue(isDistributedLearningAtom);

  // Step 1: Resource
  const nodeMode = useAtomValue(nodeModeAtom);
  const nodeName = useAtomValue(nodeNameAtom);
  const resourcePresetId = useAtomValue(resourcePresetIdAtom);
  const workerCount = useAtomValue(workerCountAtom);

  // Step 2: Image
  const imageType = useAtomValue(imageTypeAtom);
  const harborImageName = useAtomValue(harborImageNameAtom);
  const imageTagName = useAtomValue(imageTagNameAtom);

  // step 3: Task
  const workloadSourcecodes = useAtomValue(workloadSourcecodesAtom);
  const workloadVolumes = useAtomValue(workloadVolumesAtom);

  // step 4: Command
  const outputDirectory = useAtomValue(outputDirectoryAtom);
  const executionDirectory = useAtomValue(executionDirectoryAtom);
  const executionCmd = useAtomValue(executionCmdAtom);
  const parameter = useAtomValue(parameterAtom);
  const envs = useAtomValue(envsAtom);
  const ports = useAtomValue(portsAtom);

  const isLastStep = step === STEP_ITEMS.length - 1;

  // resetCreateWorkloadState ref for cleanup
  const resetStateRef = useRef<(() => void) | null>(null);

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

  const resetCreateWorkloadState = useAtomCallback(
    useCallback(
      (_get, set) => {
        resetAllWorkloadAtoms(set);
        // React Hook Form을 초기값으로 리셋
        reset({
          workloadName: "",
          description: "",
          label: [],
          workloadJobType: WORKLOAD_JOB_TYPES.BATCH,
          nodeType: WORKLOAD_NODE_MODES.SINGLE,
          resourcePresetId: null,
          workerCount: undefined,
          imageType: null,
          harborImageName: "",
          imageTagName: "",
          outputDirectory: undefined,
          executionDirectory: undefined,
          executionCmd: undefined,
          env: [],
          port: [],
          sourceCode: undefined,
          volume: [],
          parameter: [],
        });
      },
      [reset],
    ),
  );

  // cleanup에서 사용할 최신 reset 함수 저장
  resetStateRef.current = resetCreateWorkloadState;

  const handleClose = () => {
    resetCreateWorkloadState();
    onClose();
  };

  // 컴포넌트 언마운트시 atom 초기화 (브라우저 뒤로 가기 대응)
  useEffect(() => {
    return () => {
      // 컴포넌트가 사라질 때 atom 상태 초기화
      resetStateRef.current?.();
      onClose();
    };
  }, [onClose]);

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
