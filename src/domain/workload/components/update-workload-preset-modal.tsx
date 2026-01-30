"use client";

import { isFunction, isString } from "es-toolkit/predicate";
import type { SetStateAction } from "react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { Icon, InputNumber, Modal } from "xiilab-ui";

import type {
  ResourcePresetSummaryResponse,
  WorkloadDetailResponse,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { WorkloadDetailResponseWorkloadJobType } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { useCheckResourceAvailability } from "@/api/generated/cluster-resource/cluster-resource";
import { useGetAvailablePresets } from "@/api/generated/resource-preset/resource-preset";
import { useGetWorkloadDetail } from "@/api/generated/workload/workload";
import { ResourcePresetDetailSummary } from "@/domain/workload/components/create/resource-preset-detail-summary";
import { ResourcePresetSelect } from "@/domain/workload/components/create/resource-preset-select";
import {
  useRestartWorkloadAction,
  useUpdateResourcePresetAction,
} from "@/domain/workload/hooks/workload-actions";
import { WORKLOAD_EVENTS } from "@/shared/constants/pubsub.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";
import {
  ModalDetailCardFull,
  ModalDetailColumn,
  ModalDetailDivider,
  ModalDetailInfoText,
  ModalDetailLabel,
  ModalDetailRow,
  ModalDetailSectionTitle,
  ModalDetailTwoColumnContainer,
  ModalDetailValue,
} from "@/styles/layers/modal-detail-layers.styled";
import { getWorkloadJobTypeInfo } from "../utils/workload.util";

// ===== 타입 및 상수 =====

type ModalMode = "change-resource" | "restart";

interface ModalConfig {
  title: string;
  okText: string;
  description: string;
}

const MODAL_CONFIGS: Record<ModalMode, ModalConfig> = {
  "change-resource": {
    title: "워크로드 리소스 프리셋 변경",
    okText: "변경",
    description: "새로운 리소스 프리셋을 선택하면 워크로드가 재시작됩니다.",
  },
  restart: {
    title: "워크로드 재시작",
    okText: "재시작",
    description: "워크로드를 재시작할 리소스 프리셋을 선택해주세요.",
  },
};

export function UpdateWorkloadPresetModal() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<ModalMode>("change-resource");
  const [workloadData, setWorkloadData] =
    useState<WorkloadDetailResponse | null>(null);
  const [workspaceId, setWorkspaceId] = useState<number | null>(null);
  const [selectedPresetId, setSelectedPresetId] = useState<number | null>(null);
  const [selectedPreset, setSelectedPreset] =
    useState<ResourcePresetSummaryResponse | null>(null);
  const [workerCount, setWorkerCount] = useState<number | null>(null);

  // 상세 정보 조회 (모달 오픈 시 항상)
  const { data: detailData, isLoading: isLoadingDetail } = useGetWorkloadDetail(
    workspaceId ?? 0,
    workloadData?.workloadResourceName ?? "",
    {
      query: {
        enabled:
          open &&
          Boolean(workspaceId) &&
          Boolean(workloadData?.workloadResourceName),
      },
    },
  );

  const { mutateAsync: checkAvailability, isPending: isCheckingAvailability } =
    useCheckResourceAvailability({
      mutation: { meta: { showToastOnSuccess: false } },
    });

  // 리소스 변경 API
  const { mutateAsync: updatePreset, isPending: isUpdating } =
    useUpdateResourcePresetAction();

  // 재시작 API
  const {
    mutateAsync: restartWorkload,
    isPending: isRestarting,
    reset: resetRestart,
  } = useRestartWorkloadAction();

  // 로딩 상태
  const isSubmitting = isUpdating || isRestarting;
  const isPending = isLoadingDetail || isSubmitting || isCheckingAvailability;

  // 리소스 프리셋 목록 조회
  const { data: presets } = useGetAvailablePresets(
    {
      workspaceId: workspaceId ?? 0,
      workloadJobType: workloadData?.workloadJobType,
      nodeType: workloadData?.nodeType,
    },
    {
      query: {
        enabled:
          open &&
          Boolean(workspaceId) &&
          Boolean(workloadData?.workloadJobType) &&
          Boolean(workloadData?.nodeType),
      },
    },
  );

  // selectedPresetId가 변경될 때 selectedPreset 동기화
  useEffect(() => {
    if (selectedPresetId && presets) {
      const foundPreset = presets.find(
        (p) => p.resourcePresetId === selectedPresetId,
      );
      setSelectedPreset(foundPreset ?? null);
    } else if (!selectedPresetId) {
      setSelectedPreset(null);
    }
  }, [selectedPresetId, presets]);

  const handleSelectPreset = (
    presetItem: ResourcePresetSummaryResponse | null,
  ) => {
    setSelectedPreset(presetItem);
  };

  const handlePresetChange = (nextPreset: SetStateAction<number | null>) => {
    const resolvedPreset = isFunction(nextPreset)
      ? nextPreset(selectedPresetId)
      : nextPreset;
    setSelectedPresetId(resolvedPreset);
  };

  const handleWorkerCountChange = (value: string | number | null) => {
    if (value === null || value === "" || value === undefined) {
      setWorkerCount(null);
      return;
    }

    const parsedValue = isString(value) ? Number(value) : value;
    setWorkerCount(Number.isNaN(parsedValue) ? null : parsedValue);
  };

  const handleClose = () => {
    if (isPending) return;
    setOpen(false);
    setMode("change-resource");
    setWorkloadData(null);
    setWorkspaceId(null);
    setSelectedPresetId(null);
    setSelectedPreset(null);
    setWorkerCount(null);
    resetRestart();
  };

  const handleOk = async () => {
    if (isPending) return;
    if (!workloadData || workspaceId === null) return;

    const isDistributed =
      workloadData.workloadJobType ===
      WorkloadDetailResponseWorkloadJobType.DISTRIBUTED;
    const currentPresetId =
      workloadData.resourcePreset?.resourcePresetId ?? null;
    const canUpdateWorkerOnly =
      isDistributed &&
      workerCount !== null &&
      selectedPresetId === null &&
      currentPresetId !== null;
    const canUpdateWithPreset = selectedPresetId !== null && selectedPreset;
    const effectivePresetId =
      selectedPresetId !== null ? selectedPresetId : currentPresetId;

    if (!canUpdateWorkerOnly && !canUpdateWithPreset) return;

    if (canUpdateWithPreset) {
      // 리소스 가용성 확인
      const gpu = selectedPreset.resource?.gpu;

      // NORMAL 또는 MIG인 경우만 가용성 체크
      if (gpu && gpu.gpuType !== "MPS") {
        const availabilityResult = await checkAvailability({
          data: {
            gpu: {
              gpuType: gpu.gpuType, // 타입이 자동으로 "NORMAL" | "MIG"로 좁혀짐
              gpuName: gpu.gpuName,
              requestCount:
                gpu.detail?.normal?.requestCount ?? gpu.detail?.mig?.length,
            },
          },
        });

        // 가용성 확인 실패
        if (!availabilityResult?.isAvailable) {
          toast.error("현재 생성할 수 없는 리소스입니다.");
          return;
        }
      }
    }

    // 모드에 따라 다른 API 호출
    if (effectivePresetId === null) return;

    const requestData = {
      resourcePresetId: effectivePresetId,
      ...(isDistributed && workerCount !== null ? { workerCount } : {}),
    };

    const action = mode === "change-resource" ? updatePreset : restartWorkload;
    await action({
      workspaceId,
      workloadResourceName: workloadData.workloadResourceName,
      data: requestData,
    });

    setOpen(false);
  };

  // 리소스 변경 이벤트 (상세 페이지에서 사용)
  useSubscribe<{ workloadResourceName: string; workspaceId: number }>(
    WORKLOAD_EVENTS.openChangeResourceModal,
    (payload) => {
      const { workloadResourceName, workspaceId } = payload;
      setMode("change-resource");
      setWorkloadData({ workloadResourceName } as WorkloadDetailResponse);
      setWorkspaceId(workspaceId ?? null);
      setSelectedPresetId(null); // 초기 상태는 선택 안 됨
      setWorkerCount(null); // 상세 API 로딩 전 초기화
      setOpen(true);
    },
  );

  // 재시작 이벤트 (상세 페이지 + 목록 페이지)
  useSubscribe<
    | (WorkloadDetailResponse & { workspaceId?: number })
    | { workloadResourceName: string; workspaceId: number }
  >(WORKLOAD_EVENTS.openRestartModal, (payload) => {
    setMode("restart");

    // 상세 페이지에서 호출: 전체 데이터 포함
    if ("resourcePreset" in payload) {
      const { workspaceId: wsId, ...data } =
        payload as WorkloadDetailResponse & { workspaceId?: number };
      setWorkloadData(data);
      setWorkspaceId(wsId ?? null);
      setSelectedPresetId(null);
      setWorkerCount(data.workerCount ?? null);
    }
    // 목록 페이지에서 호출: 최소 데이터만 (API로 상세 정보 가져옴)
    else {
      const { workloadResourceName, workspaceId } = payload;
      setWorkloadData({ workloadResourceName } as WorkloadDetailResponse);
      setWorkspaceId(workspaceId ?? null);
      setSelectedPresetId(null);
      setWorkerCount(null);
    }

    setOpen(true);
  });

  // 상세 API 응답 처리
  useEffect(() => {
    if (detailData && open) {
      setWorkloadData(detailData);
      if (mode === "change-resource") {
        setSelectedPresetId(
          detailData.resourcePreset?.resourcePresetId ?? null,
        );
      } else {
        setSelectedPresetId(null);
      }
      setWorkerCount(detailData.workerCount ?? null);
    }
  }, [detailData, open, mode]);

  const { label, nodeType } = getWorkloadJobTypeInfo(
    workloadData?.workloadJobType,
  );

  const config = MODAL_CONFIGS[mode];

  return (
    <Modal
      type="primary"
      icon={
        <Icon
          name={mode === "change-resource" ? "Resource" : "Refresh"}
          color="#fff"
          size={18}
        />
      }
      modalWidth={936}
      open={open}
      closable={!isSubmitting}
      maskClosable={!isSubmitting}
      keyboard={!isSubmitting}
      title={config.title}
      showCancelButton
      cancelText="취소"
      onCancel={handleClose}
      okText={config.okText}
      onOk={handleOk}
      centered
      showHeaderBorder
      loading={isLoadingDetail}
      okButtonProps={{
        disabled:
          !workloadData ||
          workspaceId === null ||
          isSubmitting ||
          (selectedPresetId !== null && !selectedPreset) ||
          (selectedPresetId === null &&
            !(
              workloadData.workloadJobType ===
                WorkloadDetailResponseWorkloadJobType.DISTRIBUTED &&
              workerCount !== null
            )),
        loading: isSubmitting,
      }}
      cancelButtonProps={{
        disabled: isSubmitting,
      }}
    >
      <Container>
        {/* 왼쪽: 기본 정보 및 기존 리소스 정보 */}
        <ModalDetailColumn>
          <ModalDetailCardFull>
            <ModalDetailSectionTitle>기본 정보</ModalDetailSectionTitle>
            <ModalDetailRow>
              <ModalDetailLabel $minWidth="100px">
                워크로드 이름
              </ModalDetailLabel>
              <ModalDetailValue>
                {workloadData?.workloadName || "-"}
              </ModalDetailValue>
            </ModalDetailRow>
            <ModalDetailRow>
              <ModalDetailLabel $minWidth="100px">Job Type</ModalDetailLabel>
              <ModalDetailValue>{label}</ModalDetailValue>
            </ModalDetailRow>
            <ModalDetailRow>
              <ModalDetailLabel $minWidth="100px">노드</ModalDetailLabel>
              <ModalDetailValue>{nodeType}</ModalDetailValue>
            </ModalDetailRow>
            {workloadData?.workloadJobType ===
              WorkloadDetailResponseWorkloadJobType.DISTRIBUTED && (
              <ModalDetailRow>
                <ModalDetailLabel $minWidth="100px">Worker 수</ModalDetailLabel>
                <ModalDetailValue>
                  {workloadData.workerCount ?? "-"}
                </ModalDetailValue>
              </ModalDetailRow>
            )}
            <ModalDetailRow>
              <ModalDetailLabel $minWidth="100px">생성일시</ModalDetailLabel>
              <ModalDetailValue>-</ModalDetailValue>
            </ModalDetailRow>

            <ModalDetailDivider />

            <ModalDetailSectionTitle>기존 리소스 정보</ModalDetailSectionTitle>
            {workloadData?.resourcePreset && (
              <CurrentPresetDetailSection>
                <ResourcePresetDetailSummary
                  preset={{
                    ...workloadData.resourcePreset,
                    entityId: 0,
                  }}
                />
              </CurrentPresetDetailSection>
            )}
          </ModalDetailCardFull>
        </ModalDetailColumn>

        {/* 오른쪽: 리소스 프리셋 선택 */}
        <ModalDetailColumn>
          <ModalDetailCardFull>
            <ModalDetailSectionTitle>
              {mode === "change-resource"
                ? "새 리소스 프리셋"
                : "리소스 프리셋"}
            </ModalDetailSectionTitle>
            <ModalDetailInfoText>{config.description}</ModalDetailInfoText>
            {workloadData?.nodeType && workloadData?.workloadJobType && (
              <>
                <ResourcePresetSelectWrapper>
                  <ResourcePresetSelect
                    nodeMode={workloadData.nodeType}
                    workloadJobType={workloadData.workloadJobType}
                    preset={selectedPresetId}
                    setPreset={handlePresetChange}
                    onSelectPreset={handleSelectPreset}
                  />
                </ResourcePresetSelectWrapper>

                {/* DISTRIBUTED 타입일 때 워커 개수 입력 */}
                {workloadData.workloadJobType ===
                  WorkloadDetailResponseWorkloadJobType.DISTRIBUTED && (
                  <WorkerCountWrapper>
                    <ModalDetailRow>
                      <ModalDetailLabel $minWidth="100px">
                        Worker 수
                      </ModalDetailLabel>
                      <InputNumber
                        value={workerCount ?? undefined}
                        onChange={handleWorkerCountChange}
                        min={1}
                        placeholder="Worker 수 입력해 주세요."
                        style={{ width: "100%" }}
                        disabled={isSubmitting}
                      />
                    </ModalDetailRow>
                  </WorkerCountWrapper>
                )}

                {selectedPreset && (
                  <PresetDetailSection>
                    <ResourcePresetDetailSummary preset={selectedPreset} />
                  </PresetDetailSection>
                )}
              </>
            )}
          </ModalDetailCardFull>
        </ModalDetailColumn>
      </Container>
    </Modal>
  );
}

const Container = styled(ModalDetailTwoColumnContainer)`
  gap: 12px;
`;

const CurrentPresetDetailSection = styled.div`
  margin-top: 12px;
`;

const ResourcePresetSelectWrapper = styled.div`
  margin-top: 12px;
`;

const WorkerCountWrapper = styled.div`
  margin-top: 12px;
`;

const PresetDetailSection = styled.div`
  margin-top: 12px;
`;
