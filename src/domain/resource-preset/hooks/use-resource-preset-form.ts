import { useAtom } from "jotai";
import { useCallback } from "react";

import type {
  MultiNodeResource,
  ResourcePresetFormType,
  ResourcePresetGpuType,
  ResourcePresetJobType,
  ResourcePresetNodeType,
  ResourcePresetRequestPayload,
  SingleNodeResource,
} from "@/domain/resource-preset/schemas/resource-preset.schema";
import { resourcePresetRequestSchema } from "@/domain/resource-preset/schemas/resource-preset.schema";
import {
  INITIAL_FORM_STATE,
  resourcePresetFormAtom,
  resourcePresetFormErrorsAtom,
} from "@/domain/resource-preset/state/resource-preset-form.atom";
import { mapZodErrors } from "@/domain/resource-preset/utils/form-validation.util";
import {
  getFixedGpuCount,
  isMultiNodeEnabled,
} from "@/domain/resource-preset/utils/resource-preset.rules";
import type {
  GpuListType,
  GpuNodeListType,
  GpuProfileListType,
} from "@/shared/schemas/gpu.schema";

/**
 * Resource Preset Form 관리 Hook
 *
 * useGlobalModal 패턴을 확장한 복잡한 form 관리 hook
 * 모든 cascade 로직과 비즈니스 룰을 캡슐화
 *
 * @example
 * ```tsx
 * const { form, errors, setGpuType, validate } = useResourcePresetForm();
 *
 * // GPU 타입 변경 (자동으로 첫 번째 GPU 선택, MIG 고정 등 처리)
 * setGpuType("MIG", gpuList);
 * ```
 */
export function useResourcePresetForm() {
  const [form, setForm] = useAtom(resourcePresetFormAtom);
  const [errors, setErrors] = useAtom(resourcePresetFormErrorsAtom);

  /* ========== 기본 필드 업데이트 ========== */

  /**
   * 기본 필드 업데이트 (name, description 등)
   */
  const setField = useCallback(
    <K extends keyof ResourcePresetFormType>(
      field: K,
      value: ResourcePresetFormType[K],
    ) => {
      setForm((prev) => ({ ...prev, [field]: value }));

      // 해당 필드 에러 클리어
      if (field in errors) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    },
    [setForm, setErrors, errors],
  );

  /* ========== Cascade 업데이트 (복잡한 로직) ========== */

  /**
   * JobType 변경 (Cascade)
   * - Interactive → single node 강제
   * - GPU/Node/Resource 모두 초기화
   */
  const setJobType = useCallback(
    (jobType: ResourcePresetJobType) => {
      setForm((prev) => ({
        ...prev,
        jobType,
        // Interactive는 single만 가능
        nodeType: !isMultiNodeEnabled(jobType) ? "single" : prev.nodeType,
        // GPU 관련 초기화
        gpuType: INITIAL_FORM_STATE.gpuType,
        selectedGpu: null,
        selectedNode: null,
        selectedProfile: null,
        // 리소스 초기화
        singleNodeResource: INITIAL_FORM_STATE.singleNodeResource,
        multiNodeResource: INITIAL_FORM_STATE.multiNodeResource,
      }));

      // 모든 에러 클리어
      setErrors({});
    },
    [setForm, setErrors],
  );

  /**
   * GpuType 변경 (Cascade)
   * - 첫 번째 GPU 자동 선택
   * - MIG → GPU=1 고정
   * - Node/Profile 초기화
   */
  const setGpuType = useCallback(
    (gpuType: ResourcePresetGpuType, gpuList: GpuListType[]) => {
      // 첫 번째 GPU 자동 선택
      const gpusByType = gpuList.filter((gpu) => gpu.type === gpuType);
      const firstGpu = gpusByType[0] ?? null;

      // MIG는 GPU 개수 1개 고정
      const fixedGpu = getFixedGpuCount(gpuType);

      setForm((prev) => ({
        ...prev,
        gpuType,
        selectedGpu: firstGpu,
        selectedNode: null,
        selectedProfile: null,
        singleNodeResource: {
          ...prev.singleNodeResource,
          gpu: fixedGpu ?? INITIAL_FORM_STATE.singleNodeResource.gpu,
          cpu: INITIAL_FORM_STATE.singleNodeResource.cpu,
          memory: INITIAL_FORM_STATE.singleNodeResource.memory,
        },
      }));

      // 관련 에러 클리어
      setErrors((prev) => ({
        ...prev,
        gpuType: undefined,
        selectedGpu: undefined,
        selectedNode: undefined,
        selectedProfile: undefined,
      }));
    },
    [setForm, setErrors],
  );

  /**
   * NodeType 변경 (Cascade)
   * - 리소스 초기화
   */
  const setNodeType = useCallback(
    (nodeType: ResourcePresetNodeType) => {
      setForm((prev) => ({
        ...prev,
        nodeType,
        selectedNode: null,
        selectedProfile: null,
        singleNodeResource: INITIAL_FORM_STATE.singleNodeResource,
        multiNodeResource: INITIAL_FORM_STATE.multiNodeResource,
      }));

      setErrors((prev) => ({
        ...prev,
        nodeType: undefined,
        selectedNode: undefined,
        selectedProfile: undefined,
      }));
    },
    [setForm, setErrors],
  );

  /**
   * GPU 선택 (Cascade)
   * - Node/Profile 초기화
   */
  const setSelectedGpu = useCallback(
    (gpu: GpuListType | null) => {
      setForm((prev) => ({
        ...prev,
        selectedGpu: gpu,
        selectedNode: null,
        selectedProfile: null,
      }));

      setErrors((prev) => ({
        ...prev,
        selectedGpu: undefined,
        selectedNode: undefined,
        selectedProfile: undefined,
      }));
    },
    [setForm, setErrors],
  );

  /**
   * Node 선택 (리소스 자동 설정)
   * - 선택한 노드의 최대값으로 리소스 설정
   * - MIG는 GPU=1 유지
   */
  const selectNode = useCallback(
    (node: GpuNodeListType | null) => {
      const fixedGpu = getFixedGpuCount(form.gpuType);
      const gpuValue = fixedGpu ?? node?.gpuTotal ?? 0;

      setForm((prev) => ({
        ...prev,
        selectedNode: node,
        singleNodeResource: {
          gpu: gpuValue,
          cpu: node?.cpuTotal ?? 0,
          memory: node?.memoryTotal ?? 0,
        },
      }));

      setErrors((prev) => ({
        ...prev,
        selectedNode: undefined,
      }));
    },
    [form.gpuType, setForm, setErrors],
  );

  /**
   * MIG Profile 선택
   */
  const selectProfile = useCallback(
    (profile: GpuProfileListType | null) => {
      setForm((prev) => ({
        ...prev,
        selectedProfile: profile,
        singleNodeResource: {
          ...prev.singleNodeResource,
          gpu: getFixedGpuCount(prev.gpuType) ?? prev.singleNodeResource.gpu,
        },
      }));

      setErrors((prev) => ({
        ...prev,
        selectedProfile: undefined,
      }));
    },
    [setForm, setErrors],
  );

  /* ========== 리소스 업데이트 ========== */

  /**
   * Single Node Resource 업데이트
   */
  const updateSingleNodeResource = useCallback(
    (updates: Partial<SingleNodeResource>) => {
      setForm((prev) => ({
        ...prev,
        singleNodeResource: {
          ...prev.singleNodeResource,
          ...updates,
        },
      }));
    },
    [setForm],
  );

  /**
   * Multi Node Resource 업데이트
   */
  const updateMultiNodeResource = useCallback(
    (updates: Partial<MultiNodeResource>) => {
      setForm((prev) => ({
        ...prev,
        multiNodeResource: {
          ...prev.multiNodeResource,
          ...updates,
        },
      }));
    },
    [setForm],
  );

  /* ========== 검증 & 제출 ========== */

  /**
   * 폼 검증 (Zod)
   * - 성공 시 payload 반환
   * - 실패 시 에러 설정 및 null 반환
   */
  const validate = useCallback((): ResourcePresetRequestPayload | null => {
    const dataToValidate = {
      name: form.name,
      description: form.description || null,
      jobType: form.jobType,
      nodeType: form.nodeType,
      gpuType: form.gpuType,
      gpuId: form.selectedGpu?.id ? Number(form.selectedGpu.id) : 0,
      nodeName: form.selectedNode?.name ?? "",
      gpu: form.singleNodeResource.gpu,
      cpu: form.singleNodeResource.cpu,
      memory: form.singleNodeResource.memory,
    };

    const result = resourcePresetRequestSchema.safeParse(dataToValidate);

    if (!result.success) {
      const mappedErrors = mapZodErrors(result.error);
      setErrors(mappedErrors);
      return null;
    }

    setErrors({});
    return result.data;
  }, [form, setErrors]);

  /* ========== 초기화 ========== */

  /**
   * 폼 초기화
   */
  const reset = useCallback(() => {
    setForm(INITIAL_FORM_STATE);
    setErrors({});
  }, [setForm, setErrors]);

  /**
   * Drawer 열기 + 초기 GPU 자동 선택
   */
  const initWithGpuList = useCallback(
    (gpuList: GpuListType[]) => {
      const gpusByType = gpuList.filter((gpu) => gpu.type === form.gpuType);
      const firstGpu = gpusByType[0] ?? null;

      if (firstGpu) {
        setForm((prev) => ({
          ...prev,
          selectedGpu: firstGpu,
        }));
      }
    },
    [form.gpuType, setForm],
  );

  /**
   * 수정 모드 초기화 (API 데이터로부터)
   */
  const initForEdit = useCallback(
    ({
      detail,
      matchedGpu,
      matchedNode,
      matchedProfile,
    }: {
      detail: {
        name: string;
        description?: string | null;
        jobType: ResourcePresetJobType;
        nodeType: ResourcePresetNodeType;
        gpuType: ResourcePresetGpuType;
        gpu: number;
        cpu: number;
        memory: number;
      };
      matchedGpu?: GpuListType | null;
      matchedNode?: GpuNodeListType | null;
      matchedProfile?: GpuProfileListType | null;
    }) => {
      setForm({
        name: detail.name,
        description: detail.description ?? "",
        jobType: detail.jobType,
        nodeType: detail.nodeType,
        gpuType: detail.gpuType,
        selectedGpu: matchedGpu ?? null,
        selectedNode: matchedNode ?? null,
        selectedProfile: matchedProfile ?? null,
        singleNodeResource: {
          gpu: detail.gpu,
          cpu: detail.cpu,
          memory: detail.memory,
        },
        multiNodeResource: INITIAL_FORM_STATE.multiNodeResource,
      });

      setErrors({});
    },
    [setForm, setErrors],
  );

  /* ========== Return API ========== */

  return {
    // 상태
    form,
    errors,

    // 기본 필드 업데이트
    setField,

    // Cascade 업데이트
    setJobType,
    setGpuType,
    setNodeType,
    setSelectedGpu,
    selectNode,
    selectProfile,

    // 리소스 업데이트
    updateSingleNodeResource,
    updateMultiNodeResource,

    // 검증 & 제출
    validate,

    // 초기화
    reset,
    initWithGpuList,
    initForEdit,
  };
}
