"use client";

import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { Form, FormItem, Icon, InputNumber, Modal } from "xiilab-ui";

import { useUpdateWorkspaceResourceSetting } from "@/domain/system-setting/hooks/use-update-workspace-resource-setting";
import { useWorkspaceResourceSettingForm } from "@/domain/system-setting/hooks/use-workspace-resource-setting-form";
import {
  type MigResourceType,
  type WorkspaceResourceSettingRequestType,
  workspaceResourceSettingFormSchema,
} from "@/domain/system-setting/schemas/workspace-resource-setting.schema";
import { MigFormField } from "@/shared/components/form/mig-form-field";
import { SYSTEM_SETTING_EVENTS } from "@/shared/constants/pubsub.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";
import { getResourceInfo } from "@/shared/utils/resource.util";

// ===== 컴포넌트 =====

/**
 * 워크스페이스 리소스 설정 모달
 *
 * PubSub 패턴을 사용하여 모달을 열고 리소스 설정을 수정합니다.
 */
export function WorkspaceResourceSettingModal() {
  const [open, setOpen] = useState(false);

  const {
    formState,
    errors,
    setField,
    addMigResource,
    updateMigResource,
    removeMigResource,
    validate,
    reset,
  } = useWorkspaceResourceSettingForm();

  // Mutation hook
  const { mutate, isPending } = useUpdateWorkspaceResourceSetting();

  // PubSub 구독 - 모달 열기 이벤트
  useSubscribe(
    SYSTEM_SETTING_EVENTS.openWorkspaceResourceSettingModal,
    useCallback(() => {
      setOpen(true);
    }, []),
  );

  /**
   * 모달 취소
   */
  const handleCancel = () => {
    reset();
    setOpen(false);
  };

  /**
   * MIG 리소스 추가 핸들러
   */
  const handleAddMigResource = (resource: MigResourceType) => {
    addMigResource(resource);
  };

  /**
   * 폼 제출
   */
  const handleSubmit = () => {
    const isValid = validate();
    if (!isValid) return;

    // Zod 스키마로 폼 데이터 검증 및 변환
    const validationResult =
      workspaceResourceSettingFormSchema.safeParse(formState);
    if (!validationResult.success) return;

    // string을 number로 변환하여 API payload 생성 (optional 필드 처리)
    const payload: WorkspaceResourceSettingRequestType = {
      gpu: Number(formState.gpu),
      cpu: Number(formState.cpu),
      memory: Number(formState.memory),
      workspaceCount: Number(formState.workspaceCount),
      // MPS는 값이 있을 때만 추가
      ...(formState.mps && formState.mps !== ""
        ? { mps: Number(formState.mps) }
        : {}),
      // MIG 리소스는 있을 때만 추가
      ...(formState.migResources.length > 0
        ? {
            migResources: formState.migResources.map((mig) => ({
              profile: mig.profile,
              count: Number(mig.count),
            })),
          }
        : {}),
    };

    // Mutation 실행
    mutate(payload, {
      onSuccess: () => {
        toast.success("워크스페이스 리소스 설정이 저장되었습니다.");
        handleCancel();
      },
      onError: (error) => {
        toast.error(`저장 실패: ${error.message}`);
      },
    });
  };

  if (!open) return null;

  const gpuInfo = getResourceInfo("GPU");
  const mpsInfo = getResourceInfo("MPS");
  const cpuInfo = getResourceInfo("CPU");
  const memInfo = getResourceInfo("MEM");
  const migInfo = getResourceInfo("MIG");

  return (
    <Modal
      type="primary"
      icon={<Icon name="Edit01" color="#fff" size={18} />}
      modalWidth={370}
      open={open}
      closable
      title="워크스페이스 및 리소스 설정"
      showCancelButton
      cancelText="취소"
      onCancel={handleCancel}
      okText="저장"
      onOk={handleSubmit}
      confirmLoading={isPending}
      centered
      showHeaderBorder
    >
      <Form layout="vertical">
        {/* GPU */}
        <FormItem label={`${gpuInfo.text} (${gpuInfo.unit})`} required>
          <InputNumber
            placeholder="GPU 개수를 입력해 주세요."
            value={formState.gpu}
            onChange={(value) => setField("gpu", String(value ?? ""))}
            status={errors.gpu ? "error" : undefined}
            width="100%"
            height="30px"
            min={1}
            controls={true}
          />
        </FormItem>

        {/* MIG */}
        <FormItem
          label={`${migInfo.text} (${migInfo.unit})`}
          status={errors.migResources ? "error" : undefined}
        >
          <MigFormField
            value={formState.migResources}
            error={errors.migResources}
            onAdd={handleAddMigResource}
            onUpdate={updateMigResource}
            onRemove={removeMigResource}
          />
        </FormItem>

        {/* MPS */}
        <FormItem label={`${mpsInfo.text} (${mpsInfo.unit})`}>
          <InputNumber
            placeholder="MPS 개수를 입력해 주세요."
            value={formState.mps}
            onChange={(value) => setField("mps", String(value ?? ""))}
            status={errors.mps ? "error" : undefined}
            width="100%"
            height="30px"
            min={1}
            controls={true}
          />
        </FormItem>

        {/* CPU */}
        <FormItem label={`${cpuInfo.text} (${cpuInfo.unit})`} required>
          <InputNumber
            placeholder="CPU Core 수를 입력해 주세요."
            value={formState.cpu}
            onChange={(value) => setField("cpu", String(value ?? ""))}
            status={errors.cpu ? "error" : undefined}
            width="100%"
            height="30px"
            min={1}
            controls={true}
          />
        </FormItem>

        {/* Memory */}
        <FormItem label={`${memInfo.text} (${memInfo.unit})`} required>
          <InputNumber
            placeholder="Memory 용량을 입력해 주세요."
            value={formState.memory}
            onChange={(value) => setField("memory", String(value ?? ""))}
            status={errors.memory ? "error" : undefined}
            width="100%"
            height="30px"
            min={1}
            controls={true}
          />
        </FormItem>

        {/* 워크스페이스 최대 생성 개수 */}
        <FormItem label="워크스페이스 최대 생성 개수 (개수)" required>
          <InputNumber
            placeholder="워크스페이스 최대 생성 개수를 입력해 주세요."
            value={formState.workspaceCount}
            onChange={(value) =>
              setField("workspaceCount", String(value ?? ""))
            }
            status={errors.workspaceCount ? "error" : undefined}
            width="100%"
            height="30px"
            min={1}
            controls={true}
          />
        </FormItem>
      </Form>
    </Modal>
  );
}

