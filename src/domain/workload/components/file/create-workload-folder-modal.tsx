"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSetAtom } from "jotai";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Form, Icon, Input, Modal } from "xiilab-ui";

import { useWorkloadCreateFolder } from "@/api/generated/workload/workload";
import {
  type CreateWorkloadFolderFormType,
  createWorkloadFolderSchema,
} from "@/domain/workload/schemas/workload.schema";
import { workloadFileTreeDataAtom } from "@/domain/workload/state/workload.atom";
import { WORKLOAD_EVENTS } from "@/shared/constants/pubsub.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";
import { addNodeToTree, createFolderNode } from "@/shared/utils/filetree.util";
import { LastFormItem } from "@/styles/layers/form-layer.styled";

interface CreateWorkloadFolderModalPayload {
  workspaceId: number;
  workloadResourceName: string;
  filePath: string;
}

export function CreateWorkloadFolderModal() {
  const [open, setOpen] = useState(false);
  const [workspaceId, setWorkspaceId] = useState<number | null>(null);
  const [workloadResourceName, setWorkloadResourceName] = useState("");
  const [parentPath, setParentPath] = useState("");
  const setTreeData = useSetAtom(workloadFileTreeDataAtom);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateWorkloadFolderFormType>({
    resolver: zodResolver(createWorkloadFolderSchema),
    defaultValues: { folderName: "" },
  });

  const { mutate, isPending } = useWorkloadCreateFolder();

  const handleCancel = () => {
    if (isPending) return;
    setOpen(false);
  };

  const onSubmit = (data: CreateWorkloadFolderFormType) => {
    if (isPending) return;
    if (workspaceId == null || !workloadResourceName) return;

    const newFolderNode = createFolderNode({
      folderName: data.folderName,
      parentPath,
    });

    mutate(
      {
        workspaceId,
        workloadResourceName,
        data: { path: newFolderNode.path },
      },
      {
        onSuccess: () => {
          setTreeData((prev) => addNodeToTree(prev, parentPath, newFolderNode));
          setOpen(false);
        },
      },
    );
  };

  useSubscribe<CreateWorkloadFolderModalPayload>(
    WORKLOAD_EVENTS.openCreateFolderModal,
    (payload) => {
      setWorkspaceId(payload.workspaceId);
      setWorkloadResourceName(payload.workloadResourceName);
      setParentPath(payload.filePath);
      reset();
      setOpen(true);
    },
  );

  return (
    <Modal
      modalWidth={370}
      type="primary"
      icon={<Icon name="Plus" color="#fff" size={18} />}
      open={open}
      closable={!isPending}
      maskClosable={!isPending}
      keyboard={!isPending}
      title="폴더 추가"
      onCancel={handleCancel}
      showCancelButton
      cancelText="취소"
      okText="추가"
      onOk={handleSubmit(onSubmit)}
      centered
      showHeaderBorder
      okButtonProps={{
        loading: isPending,
        disabled: workspaceId == null || !workloadResourceName,
      }}
      cancelButtonProps={{ disabled: isPending }}
    >
      <Form>
        <Controller
          name="folderName"
          control={control}
          render={({ field }) => (
            <LastFormItem
              label="폴더명"
              htmlFor="workloadFolderName"
              required
              validateStatus={errors.folderName ? "error" : undefined}
              help={errors.folderName?.message}
            >
              <Input
                {...field}
                type="text"
                id="workloadFolderName"
                placeholder="새로 생성할 폴더명을 입력해주세요."
                width="100%"
                disabled={isPending}
                maxLength={255}
                autoComplete="off"
              />
            </LastFormItem>
          )}
        />
      </Form>
    </Modal>
  );
}
