"use client";

import { useAtom } from "jotai";
import styled from "styled-components";
import type { StepItem } from "xiilab-ui";
import { Button, Drawer, Step, Typography } from "xiilab-ui";

import { CreateWorkloadFirstStep } from "@/domain/workload/components/create/create-workload-first-step";
import { CreateWorkloadSecondStep } from "@/domain/workload/components/create/create-workload-second-step";
import { stepAtom } from "@/domain/workload/state/create-workload.atom";
import type { CreateWorkloadPayload } from "@/domain/workload/types/workload.type";
import { WORKLOAD_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";
import { openCreateWorkloadDrawerAtom } from "@/shared/state/modal.atom";

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

export function CreateWorkloadDrawer() {
  const { open, onOpen, onClose } = useGlobalModal(
    openCreateWorkloadDrawerAtom,
  );

  const [step, setStep] = useAtom(stepAtom);

  const isLastStep = step === STEP_ITEMS.length - 1;

  const handleNext = () => {
    setStep((prev) => Math.min(prev + 1, STEP_ITEMS.length - 1));
  };

  const handlePrev = () => {
    setStep((prev) => Math.max(prev - 1, 0));
  };

  // 현재 단계에 맞는 컴포넌트 렌더링
  const renderCurrentStepContent = () => {
    switch (step) {
      case 0:
        return <CreateWorkloadFirstStep />;
      case 1:
        return <CreateWorkloadSecondStep />;
      case 2:
        return;
      case 3:
        return;
    }
  };

  useSubscribe(
    WORKLOAD_EVENTS.sendCloneWorkload,
    (eventData: CreateWorkloadPayload) => {
      console.log(eventData);
      setStep(0);
      onOpen();
    },
  );

  return (
    <Drawer
      open={open}
      onClose={onClose}
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
                onClick={onClose}
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
                <Typography.Text variant="button-1">이전 단계</Typography.Text>
              </Button>
            </CancelButton>
          )}

          <ActionButton>
            <Button
              color="primary"
              variant="gradient"
              size="medium"
              onClick={handleNext}
              iconPosition={isLastStep ? "left" : "right"}
              icon={isLastStep ? "Plus" : "Front"}
              iconSize={24}
              width="100%"
            >
              <Typography.Text variant="body-1-1" color="var(--color-gray-13)">
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

  /* 스크롤바 숨김 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */

  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
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
