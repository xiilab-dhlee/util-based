"use client";

import { useQueryClient } from "@tanstack/react-query";
import { groupBy } from "es-toolkit";
import { useAtom, useSetAtom } from "jotai";
import { useState } from "react";
import styled, { css } from "styled-components";
import { Icon, Modal, Radio } from "xiilab-ui";

import {
  getGetClusterNodesQueryKey,
  getMigConfiguration,
  useApplyMigConfiguration,
} from "@/api/generated/admin-cluster/admin-cluster";
import type {
  MigConfigInfo,
  MigConfigurationRequest,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { MigConfigSelect } from "@/domain/node/components/mig/mig-config-select";
import { MigCountSelect } from "@/domain/node/components/mig/mig-count-select";
import { MigGpuItem } from "@/domain/node/components/mig/mig-gpu-item";
import { SelectDisplayConfig } from "@/domain/node/components/mig/select-display-config";
import type { NodeListType } from "@/domain/node/schemas/node.schema";
import {
  migGpuProductAtom,
  migGpusAtom,
  selectedMigConfigIdAtom,
  selectedMigCountAtom,
  selectedMigGpuIndexAtom,
} from "@/domain/node/state/node.atom";
import type { MigGpu } from "@/domain/node/types/node.type";
import { MigUtil } from "@/domain/node/utils/mig.util";
import { GuideTooltip } from "@/shared/components/tooltip/guide-tooltip";
import { ApplyOnceTooltipTitle } from "@/shared/components/tooltip-title/apply-once-tooltip-title";
import { UpdateMigTooltipTitle } from "@/shared/components/tooltip-title/update-mig-tooltip-title";
import { NODE_EVENTS } from "@/shared/constants/pubsub.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

type ErrorState = {
  type: "not_found" | "error" | null;
  message?: string;
};

const APPLY_ONCE_OPTIONS = { YES: "Y", NO: "N" } as const;
type ApplyOnceOption =
  (typeof APPLY_ONCE_OPTIONS)[keyof typeof APPLY_ONCE_OPTIONS];
const SUPPORTED_MODELS = "A30, A100, H100, H200, B200";
const NVIDIA_MIG_DOC_URL =
  "https://docs.nvidia.com/datacenter/tesla/mig-user-guide";

function convertMigInfoToGpuList(migInfo: MigConfigInfo[]): MigGpu[] {
  return migInfo
    .flatMap((info) =>
      info.gpuIndex.map((gpuIndex) => ({
        gpuIndex,
        migEnable: info.configId > 0,
        configId: info.configId || -1,
      })),
    )
    .sort((a, b) => a.gpuIndex - b.gpuIndex);
}

function buildMigPayload(
  migGpus: MigGpu[],
  selectedGpuIndex: number,
  applyToAll: boolean,
): MigConfigurationRequest {
  const processedGpus = applyToAll
    ? migGpus.map((gpu) => ({
        ...gpu,
        migEnable: migGpus[selectedGpuIndex].migEnable,
        configId: migGpus[selectedGpuIndex].configId,
      }))
    : migGpus;

  const enabledGpus = processedGpus.filter((gpu) => gpu.configId > 0);
  const disabledGpus = processedGpus.filter((gpu) => gpu.configId <= 0);

  // 활성화된 GPU: configId별로 그룹화
  const grouped = groupBy(enabledGpus, (gpu) => gpu.configId);
  const enabledConfigs = Object.values(grouped).map((group) => ({
    gpuIndex: group.map((gpu) => gpu.gpuIndex),
    configId: group[0].configId,
  }));

  // 비활성화된 GPU: configId 없이 gpuIndex만 전달
  const disabledConfigs =
    disabledGpus.length > 0
      ? [{ gpuIndex: disabledGpus.map((gpu) => gpu.gpuIndex) }]
      : [];

  return {
    migConfigs: [...enabledConfigs, ...disabledConfigs],
  } as MigConfigurationRequest;
}

export function UpdateMigModal() {
  const [open, setOpen] = useState(false);
  const [nodeName, setNodeName] = useState("");
  const [applyOnce, setApplyOnce] = useState<ApplyOnceOption>(
    APPLY_ONCE_OPTIONS.YES,
  );
  const [isUnsupportedModel, setIsUnsupportedModel] = useState(false);
  const [originalGpuProduct, setOriginalGpuProduct] = useState("");
  const [errorState, setErrorState] = useState<ErrorState>({ type: null });

  const [migGpus, setMigGpus] = useAtom(migGpusAtom);
  const setMigGpuProduct = useSetAtom(migGpuProductAtom);
  const [selectedMigGpuIndex, setSelectedMigGpuIndex] = useAtom(
    selectedMigGpuIndexAtom,
  );
  const setSelectedMigCount = useSetAtom(selectedMigCountAtom);
  const setSelectedMigConfigId = useSetAtom(selectedMigConfigIdAtom);

  const queryClient = useQueryClient();
  const { mutate, isPending } = useApplyMigConfiguration();

  const isSubmitDisabled = isUnsupportedModel || errorState.type !== null;
  const isApplyToAll = applyOnce === APPLY_ONCE_OPTIONS.YES;

  const handleClose = () => {
    if (isPending) return;
    setOpen(false);
  };

  const handleSubmit = () => {
    if (isPending) return;

    const payload = buildMigPayload(migGpus, selectedMigGpuIndex, isApplyToAll);

    mutate(
      { nodeName, data: payload },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getGetClusterNodesQueryKey(),
          });
          handleClose();
        },
      },
    );
  };

  const resetState = () => {
    setApplyOnce(APPLY_ONCE_OPTIONS.YES);
    setSelectedMigCount("DISABLED");
    setSelectedMigConfigId(-1);
    setErrorState({ type: null });
    setIsUnsupportedModel(false);
  };

  const loadMigConfigAndOpenModal = async (targetNodeName: string) => {
    setNodeName(targetNodeName);
    resetState();

    try {
      const migData = await getMigConfiguration(targetNodeName);

      if (!migData) {
        setErrorState({ type: "not_found" });
        setOpen(true);
        return;
      }

      const { gpuProduct, migInfo } = migData;
      const gpuList = convertMigInfoToGpuList(migInfo ?? []);
      const supportedModel = gpuProduct
        ? MigUtil.findSupportedModel(gpuProduct)
        : null;

      setIsUnsupportedModel(!supportedModel);
      setOriginalGpuProduct(gpuProduct ?? "");
      setMigGpus(gpuList);
      setMigGpuProduct(supportedModel ?? gpuProduct ?? "");

      if (gpuList.length > 0) {
        const firstGpu = gpuList[0];
        setSelectedMigGpuIndex(firstGpu.gpuIndex);

        if (firstGpu.migEnable && supportedModel) {
          const util = new MigUtil(supportedModel);
          const count = util.getInstanceCount(firstGpu.configId);
          setSelectedMigCount(count === 0 ? "DISABLED" : count.toString());
          setSelectedMigConfigId(firstGpu.configId);
        }
      }

      setOpen(true);
    } catch (error) {
      console.error(error);
      setErrorState({
        type: "error",
        message:
          error instanceof Error ? error.message : "알 수 없는 오류입니다.",
      });
      setOpen(true);
    }
  };

  useSubscribe(NODE_EVENTS.openUpdateMigModal, ({ nodeName }: NodeListType) =>
    loadMigConfigAndOpenModal(nodeName),
  );

  return (
    <Modal
      type="primary"
      icon={<Icon name="Information" color="#fff" size={14} />}
      modalWidth={580}
      open={open}
      title={nodeName}
      showCancelButton
      cancelText="취소"
      onCancel={handleClose}
      okText="확인"
      onOk={handleSubmit}
      centered
      showHeaderBorder
      closable={!isPending}
      maskClosable={!isPending}
      keyboard={!isPending}
      okButtonProps={{ disabled: isSubmitDisabled, loading: isPending }}
      cancelButtonProps={{ disabled: isPending }}
    >
      <Container>
        {isUnsupportedModel && (
          <Overlay>
            <OverlayContent>
              <Icon name="Warning" color="#faad14" size={24} />
              <OverlayTitle>지원되지 않는 GPU 모델</OverlayTitle>
              <OverlayDescription>
                {originalGpuProduct
                  ? `"${originalGpuProduct}" 모델은 MIG 설정을 지원하지 않습니다.`
                  : "GPU 모델 정보를 확인할 수 없습니다."}
              </OverlayDescription>
              <OverlayHint>지원 모델: {SUPPORTED_MODELS}</OverlayHint>
            </OverlayContent>
          </Overlay>
        )}

        {errorState.type !== null && (
          <Overlay>
            <OverlayContent>
              <Icon name="Warning" color="#ff4d4f" size={24} />
              <OverlayTitle>
                {errorState.type === "not_found"
                  ? "MIG 설정 정보 없음"
                  : "MIG 설정 조회 오류"}
              </OverlayTitle>
              <OverlayDescription>
                {errorState.type === "not_found"
                  ? "해당 노드의 MIG 설정 정보를 찾을 수 없습니다."
                  : "MIG 설정 정보 조회 중 오류가 발생했습니다."}
              </OverlayDescription>
              {errorState.message && (
                <OverlayDetail>{errorState.message}</OverlayDetail>
              )}
            </OverlayContent>
          </Overlay>
        )}

        <LeftPanel>
          <Field>
            <FieldTitle>GPU 목록</FieldTitle>
          </Field>
          <GpuListBody>
            {migGpus.map((gpu) => (
              <MigGpuItem key={gpu.gpuIndex} {...gpu} />
            ))}
          </GpuListBody>
        </LeftPanel>

        <RightPanel>
          <Field>
            <FieldTitle>
              MIG 설정
              <GuideTooltip title={<UpdateMigTooltipTitle />} />
            </FieldTitle>
            <ExternalGuide>
              Nvidia Profile 메뉴얼 원하시면{" "}
              <a
                href={NVIDIA_MIG_DOC_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                여기
              </a>
              를 클릭해 주세요.
            </ExternalGuide>
          </Field>

          <FilterRow>
            <MigCountSelect />
            <MigConfigSelect />
          </FilterRow>

          <ConfigDisplayArea>
            <ConfigDisplayWrapper>
              <SelectDisplayConfig />
            </ConfigDisplayWrapper>
          </ConfigDisplayArea>

          <Field>
            <FieldTitle>
              일괄 적용
              <GuideTooltip title={<ApplyOnceTooltipTitle />} />
            </FieldTitle>
          </Field>
          <ApplyOnceWrapper>
            <RadioItem>
              <Radio
                value={APPLY_ONCE_OPTIONS.YES}
                label="적용"
                checked={isApplyToAll}
                onClick={() => setApplyOnce(APPLY_ONCE_OPTIONS.YES)}
                size="small"
              />
            </RadioItem>
            <RadioItem>
              <Radio
                value={APPLY_ONCE_OPTIONS.NO}
                label="미적용"
                checked={!isApplyToAll}
                onClick={() => setApplyOnce(APPLY_ONCE_OPTIONS.NO)}
                size="small"
              />
            </RadioItem>
          </ApplyOnceWrapper>
        </RightPanel>
      </Container>
    </Modal>
  );
}

const Container = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
`;

const panelStyle = css`
  border: 1px solid var(--border-color);
  border-radius: 4px 4px 2px 2px;
  height: 346px;
  padding-top: 14px;
  padding-bottom: 10px;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  --border-color: #e9e9e9;
`;

const LeftPanel = styled.div`
  flex: 1;
  ${panelStyle}
`;

const RightPanel = styled.div`
  width: 380px;
  ${panelStyle}
`;

const Field = styled.div`
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  padding: 0 10px 4px;
`;

const FieldTitle = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  color: #000;
`;

const ExternalGuide = styled.div`
  font-weight: 400;
  font-size: 10px;
  line-height: 16px;
  color: #5a5d5f !important;

  a,
  a:visited,
  a:hover,
  a:active {
    font-weight: 600;
    color: inherit;
    text-decoration: underline;
  }
`;

const GpuListBody = styled.div`
  display: flex;
  flex-direction: column;
  padding: 4px;
  overflow-y: auto;
`;

const FilterRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  margin-bottom: 10px;
`;

const ConfigDisplayArea = styled.div`
  flex: 1;
`;

const ConfigDisplayWrapper = styled.div`
  border: 1px solid #e1e4e7;
  background-color: #fafafa;
  padding: 10px 12px;
  border-radius: 2px;
  max-height: 190px;
  margin: 0 10px 18px;
  gap: 4px;
  display: flex;
  flex-direction: column;
`;

const ApplyOnceWrapper = styled.div`
  border: 1px solid #e1e4e7;
  background-color: #fafafa;
  border-radius: 2px;
  height: 30px;
  margin: 0 10px;
  gap: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const RadioItem = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-left: 10px;

  & + & {
    border-left: 1px solid #e1e4e7;
  }
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.95);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  border-radius: 4px;
`;

const OverlayContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
  padding: 20px;
`;

const OverlayTitle = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: #262626;
  margin-top: 4px;
`;

const OverlayDescription = styled.div`
  font-size: 12px;
  color: #595959;
  max-width: 300px;
  word-break: keep-all;
`;

const OverlayHint = styled.div`
  font-size: 11px;
  color: #8c8c8c;
  margin-top: 4px;
`;

const OverlayDetail = styled.div`
  font-size: 11px;
  color: #8c8c8c;
  margin-top: 4px;
  max-width: 300px;
  word-break: break-all;
`;
