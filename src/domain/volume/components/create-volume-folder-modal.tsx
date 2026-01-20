"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSetAtom } from "jotai";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Form, Icon, Input, Modal } from "xiilab-ui";

import { useCreateFolder } from "@/api/generated/volume/volume";
import {
  type CreateVolumeFolderFormType,
  createVolumeFolderSchema,
} from "@/domain/volume/schemas/volume.schema";
import { volumeFileTreeDataAtom } from "@/domain/volume/state/volume.atom";
import {
  addNodeToTree,
  createFolderNode,
} from "@/domain/volume/utils/volume.util";
import { VOLUME_EVENTS } from "@/shared/constants/pubsub.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";
import { LastFormItem } from "@/styles/layers/form-layer.styled";

interface CreateVolumeFolderPayload {
  volumeId: number;
  filePath: string;
}

export function CreateVolumeFolderModal() {
  const [open, setOpen] = useState(false);
  const [volumeId, setVolumeId] = useState<number | null>(null);
  const [parentPath, setParentPath] = useState("");
  const setTreeData = useSetAtom(volumeFileTreeDataAtom);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateVolumeFolderFormType>({
    resolver: zodResolver(createVolumeFolderSchema),
  });

  const { mutate, isPending } = useCreateFolder();

  const handleCancel = () => {
    if (isPending) return;
    setOpen(false);
  };

  const onSubmit = (data: CreateVolumeFolderFormType) => {
    if (isPending) return;
    if (volumeId == null) return;

    const newFolderNode = createFolderNode({
      folderName: data.folderName,
      parentPath,
    });

    mutate(
      { volumeId, data: { path: newFolderNode.path } },
      {
        onSuccess: () => {
          setTreeData((prev) => addNodeToTree(prev, parentPath, newFolderNode));
          setOpen(false);
        },
      },
    );
  };

  useSubscribe<CreateVolumeFolderPayload>(
    VOLUME_EVENTS.openCreateFolderModal,
    (payload) => {
      setVolumeId(payload.volumeId);
      setParentPath(payload.filePath);
      reset({ folderName: "" });
      setOpen(true);
    },
  );

  return (
    <Modal
      modalWidth={370}
      type="primary"
      icon={<Icon name="Plus" color="#fff" size={18} />}
      open={open}
      closable
      title="폴더 추가"
      onCancel={handleCancel}
      showCancelButton
      cancelText="취소"
      okText="추가"
      onOk={handleSubmit(onSubmit)}
      centered
      showHeaderBorder
      okButtonProps={{ loading: isPending }}
      cancelButtonProps={{ disabled: isPending }}
    >
      <Form>
        <Controller
          name="folderName"
          control={control}
          render={({ field }) => (
            <LastFormItem
              label="폴더명"
              htmlFor="folderName"
              required
              validateStatus={errors.folderName ? "error" : undefined}
              help={errors.folderName?.message}
            >
              <Input
                {...field}
                type="text"
                id="folderName"
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
