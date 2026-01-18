"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSetAtom } from "jotai";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Form, FormItem, Icon, Input, Modal } from "xiilab-ui";

import { useCreateFolder } from "@/api/generated/volume/volume";
import {
  type CreateVolumeFolderFormType,
  createVolumeFolderSchema,
} from "@/domain/volume/schemas/volume.schema";
import {
  openCreateVolumeFolderModalAtom,
  volumeFileTreeDataAtom,
} from "@/domain/volume/state/volume.atom";
import {
  addNodeToTree,
  createFolderNode,
} from "@/domain/volume/utils/volume.util";
import { VOLUME_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

interface CreateVolumeFolderEventData {
  volumeId: number;
  filePath: string;
}

export function CreateVolumeFolderModal() {
  const { open, onOpen, onClose } = useGlobalModal(
    openCreateVolumeFolderModalAtom,
  );
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
    defaultValues: { folderName: "" },
  });

  const { mutate, isPending } = useCreateFolder();

  const handleCancel = () => {
    if (isPending) return;
    onClose();
  };

  const onSubmit = (data: CreateVolumeFolderFormType) => {
    if (!volumeId) return;

    const newFolderNode = createFolderNode({
      folderName: data.folderName,
      parentPath,
    });

    mutate(
      { volumeId, data: { path: newFolderNode.path } },
      {
        onSuccess: () => {
          setTreeData((prev) => addNodeToTree(prev, parentPath, newFolderNode));
          toast.success("폴더가 추가되었습니다.");
          onClose();
        },
      },
    );
  };

  useSubscribe<CreateVolumeFolderEventData>(
    VOLUME_EVENTS.sendCreateVolumeFolder,
    (eventData) => {
      setVolumeId(eventData.volumeId);
      setParentPath(eventData.filePath);
      reset({ folderName: "" });
      onOpen();
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
    >
      <Form>
        <Controller
          name="folderName"
          control={control}
          render={({ field }) => (
            <FormItem
              label="폴더를 추가하시겠습니까?"
              htmlFor="folderName"
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
            </FormItem>
          )}
        />
      </Form>
    </Modal>
  );
}
