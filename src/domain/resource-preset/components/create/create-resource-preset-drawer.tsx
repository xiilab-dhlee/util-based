"use client";

import { useAtom } from "jotai";
import { toast } from "react-toastify";
import styled from "styled-components";
import { Button, Drawer, Typography } from "xiilab-ui";

import { useCreateResourcePreset } from "@/domain/resource-preset/hooks/use-create-resource-preset";
import { useResourcePresetForm } from "@/domain/resource-preset/hooks/use-resource-preset-form";
import { openCreateResourcePresetDrawerAtom } from "@/domain/resource-preset/state/resource-preset-form.atom";
import { hideScrollbar } from "@/styles/mixins/scrollbar";
import { CreateResourcePresetBasicInfo } from "./create-resource-preset-basic-info";
import { CreateResourcePresetGpuInfo } from "./create-resource-preset-gpu-info";
import { CreateResourcePresetJobType } from "./create-resource-preset-job-type";
import { CreateResourcePresetResourceInfo } from "./create-resource-preset-resource-info";

export function CreateResourcePresetDrawer() {
  const [open, setOpen] = useAtom(openCreateResourcePresetDrawerAtom);
  const { validate, reset } = useResourcePresetForm();

  const createResourcePreset = useCreateResourcePreset();

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const handleSubmit = () => {
    const payload = validate();

    if (!payload) {
      return;
    }

    createResourcePreset.mutate(payload, {
      onSuccess: () => {
        toast.success("리소스 프리셋이 생성되었습니다.");
        handleClose();
      },
    });
  };

  return (
    <Drawer
      open={open}
      onClose={handleClose}
      placement="right"
      width={620}
      title="리소스 프리셋 생성"
      footer={
        <Footer>
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
          <ActionButton>
            <Button
              color="primary"
              variant="gradient"
              size="medium"
              onClick={handleSubmit}
              iconPosition="left"
              icon="Plus"
              iconSize={24}
              width="100%"
              loading={createResourcePreset.isPending}
            >
              리소스 프리셋 생성
            </Button>
          </ActionButton>
        </Footer>
      }
      closable={true}
      maskClosable={true}
    >
      <Container>
        <Body>
          {/* 기본 정보 */}
          <CreateResourcePresetBasicInfo />
          {/* Job Type */}
          <CreateResourcePresetJobType />
          {/* GPU 정보 */}
          <CreateResourcePresetGpuInfo />
          {/* 리소스 정보 */}
          <CreateResourcePresetResourceInfo />
        </Body>
      </Container>
    </Drawer>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
  width: 100%;
  overflow-y: auto;
  padding-top: 20px;
  padding-bottom: 20px;

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
