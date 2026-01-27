"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSetAtom } from "jotai";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import styled from "styled-components";
import { Form, FormItem, Icon, Input, Modal, Typography } from "xiilab-ui";

import { useWorkloadCompressFiles } from "@/api/generated/workload/workload";
import {
  type CompressWorkloadFileFormType,
  compressWorkloadFileSchema,
} from "@/domain/workload/schemas/workload.schema";
import { workloadFileCheckedNodesAtom } from "@/domain/workload/state/workload.atom";
import { GuideTooltip } from "@/shared/components/tooltip/guide-tooltip";
import { WORKLOAD_EVENTS } from "@/shared/constants/pubsub.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";
import { filterToRootPaths } from "@/shared/state/filetree.atom";
import { FormItemLabel, LastFormItem } from "@/styles/layers/form-layer.styled";

interface CompressWorkloadFilePayload {
  workspaceId: number;
  workloadResourceName: string;
  filePaths: string[];
  podName?: string | null;
}

export function CompressWorkloadFileModal() {
  const [open, setOpen] = useState(false);
  const setCheckedNodes = useSetAtom(workloadFileCheckedNodesAtom);

  const [workspaceId, setWorkspaceId] = useState<number | null>(null);
  const [workloadResourceName, setWorkloadResourceName] = useState("");
  const [filePaths, setFilePaths] = useState<string[]>([]);
  const [podName, setPodName] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CompressWorkloadFileFormType>({
    resolver: zodResolver(compressWorkloadFileSchema),
    defaultValues: {
      destinationPath: "",
      compressFileType: "ZIP",
    },
  });

  const { mutate, isPending } = useWorkloadCompressFiles();
  const selectedCompressType = watch("compressFileType");

  const handleCancel = () => {
    if (isPending) return;
    setOpen(false);
  };

  const onSubmit = (data: CompressWorkloadFileFormType) => {
    if (isPending) return;
    if (workspaceId == null || !workloadResourceName || filePaths.length === 0)
      return;

    const filteredPaths = filterToRootPaths(filePaths);
    if (filteredPaths.length === 0) {
      toast.info("압축할 파일이 없습니다.");
      return;
    }

    mutate(
      {
        workspaceId,
        workloadResourceName,
        data: {
          path: filteredPaths,
          destinationPath: data.destinationPath,
          compressFileType: data.compressFileType,
        },
        params: { podName: podName || undefined },
      },
      {
        onSuccess: () => {
          setCheckedNodes(new Set());
          setOpen(false);
        },
      },
    );
  };

  useSubscribe<CompressWorkloadFilePayload>(
    WORKLOAD_EVENTS.openCompressFileModal,
    (payload) => {
      setWorkspaceId(payload.workspaceId);
      setWorkloadResourceName(payload.workloadResourceName);
      setFilePaths(payload.filePaths);
      setPodName(payload.podName ?? null);
      reset();
      setOpen(true);
    },
  );

  return (
    <Modal
      modalWidth={370}
      type="primary"
      icon={<Icon name="Compress" color="#fff" size={18} />}
      open={open}
      closable={!isPending}
      maskClosable={!isPending}
      keyboard={!isPending}
      title="파일 압축"
      onCancel={handleCancel}
      showCancelButton
      cancelText="취소"
      okText="압축"
      onOk={handleSubmit(onSubmit)}
      centered
      showHeaderBorder
      okButtonProps={{ loading: isPending }}
      cancelButtonProps={{ disabled: isPending }}
    >
      <Form>
        <Controller
          name="destinationPath"
          control={control}
          render={({ field }) => (
            <FormItem
              label={
                <FormItemLabel>
                  압축 파일 저장 경로
                  <GuideTooltip
                    title={
                      <Typography.Text variant="body-3-3" color="#000">
                        확장자를 제외한 압축 파일명까지 입력해야 합니다.
                        <br />
                        예: /workspace/output/result 입력 시 output 폴더에
                        result.zip 생성
                      </Typography.Text>
                    }
                    iconSize={18}
                    maxWidth={350}
                    placement="right"
                  />
                </FormItemLabel>
              }
              htmlFor="compressDestinationPath"
              required
              validateStatus={errors.destinationPath ? "error" : undefined}
              help={errors.destinationPath?.message}
            >
              <Input
                {...field}
                type="text"
                id="compressDestinationPath"
                placeholder="/workspace/output/result"
                width="100%"
                disabled={isPending}
                maxLength={1000}
                autoComplete="off"
              />
            </FormItem>
          )}
        />

        <LastFormItem label="압축 유형">
          <SelectFileCompression>
            <FileCompressionButton
              type="button"
              aria-pressed={selectedCompressType === "ZIP"}
              $isSelected={selectedCompressType === "ZIP"}
              onClick={() => setValue("compressFileType", "ZIP")}
              disabled={isPending}
            >
              ZIP
            </FileCompressionButton>
            <FileCompressionButton
              type="button"
              aria-pressed={selectedCompressType === "TAR"}
              $isSelected={selectedCompressType === "TAR"}
              onClick={() => setValue("compressFileType", "TAR")}
              disabled={isPending}
            >
              TAR
            </FileCompressionButton>
          </SelectFileCompression>
        </LastFormItem>
      </Form>
    </Modal>
  );
}

const SelectFileCompression = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
`;

const FileCompressionButton = styled.button<{ $isSelected: boolean }>`
  flex: 1;
  height: 40px;
  border-radius: 2px;
  border: 1px solid ${({ $isSelected }) => ($isSelected ? "#1f5bff" : "#e0e5f0")};
  background-color: ${({ $isSelected }) =>
    $isSelected ? "rgba(31, 91, 255, 0.05)" : "transparent"};
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  color: ${({ $isSelected }) => ($isSelected ? "#1f5bff" : "#000")};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    border-color: #1f5bff;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;
