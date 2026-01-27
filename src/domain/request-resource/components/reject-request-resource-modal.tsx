"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Form, Icon, Modal, TextArea } from "xiilab-ui";

import { useGetResourceRequestDetail } from "@/api/generated/admin-workspace/admin-workspace";
import {
  useGetClusterTotalResources,
  useGetMigProfiles,
} from "@/api/generated/cluster-resource/cluster-resource";
import { REJECT_REASON_MAX_LENGTH } from "@/domain/request-resource/constants/reject-request-resource-form-error-message";
import { useRejectResourceRequestAction } from "@/domain/request-resource/hooks/request-resource-actions";
import { openRejectResourceModalAtom } from "@/domain/request-resource/state/request-resource.atom";
import {
  type RejectResourceFormType,
  rejectResourceRequestBodyExtended,
} from "@/domain/request-resource/utils/reject-request-resource-form.override.zod";
import { transformToRequestResourceModalData } from "@/domain/request-resource/utils/resource-detail.util";
import { DataErrorState } from "@/shared/components/feedback/data-error-state";
import {
  createSliderMarks,
  Slider,
  SliderLegend,
} from "@/shared/components/slider";
import { WORKSPACE_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";
import { convertBytes } from "@/shared/utils/resource.util";
import { LastFormItem } from "@/styles/layers/form-layer.styled";
import {
  UpdateResourceModalContainer,
  UpdateResourceModalErrorMessage,
  UpdateResourceModalIconDescription,
  UpdateResourceModalIconWrapper,
  UpdateResourceModalLegendWrapper,
  UpdateResourceModalResource,
  UpdateResourceModalResourceHeader,
  UpdateResourceModalResourceTitle,
  UpdateResourceModalResourceWrapper,
  UpdateResourceModalWorkspace,
  UpdateResourceModalWorkspaceLeft,
  UpdateResourceModalWorkspaceName,
  UpdateResourceModalWorkspaceRight,
} from "@/styles/layers/update-resource-modal-layers.styled";

interface RejectResourceEvent {
  resourceRequestId: number;
  workspaceName: string;
}

export function RejectResourceModal() {
  const { open, onOpen, onClose } = useGlobalModal(openRejectResourceModalAtom);

  // resourceRequestId 상태로 관리
  const [resourceRequestId, setResourceRequestId] = useState<number | null>(
    null,
  );

  // react-hook-form 설정
  const {
    control,
    handleSubmit,
    reset: resetForm,
    formState: { errors },
  } = useForm<RejectResourceFormType>({
    resolver: zodResolver(rejectResourceRequestBodyExtended),
    defaultValues: {
      rejectReason: "",
    },
  });

  // 상세 조회 API 호출 (orval hook 사용)
  const { data: detailResponse, isFetching: isDetailLoading } =
    useGetResourceRequestDetail(resourceRequestId ?? 0, {
      query: {
        enabled: resourceRequestId !== null,
      },
    });

  // 클러스터 자원 조회 API 호출
  const { data: clusterResources } = useGetClusterTotalResources();
  const { data: migProfiles } = useGetMigProfiles();

  const { mutate: rejectRequest, isPending } = useRejectResourceRequestAction({
    mutation: {
      onSuccess: () => {
        setResourceRequestId(null);
        resetForm();
        onClose();
      },
    },
  });

  // 클러스터 최대값 준비
  const clusterMaxValues = useMemo(() => {
    if (!clusterResources || !migProfiles) return null;

    const migProfileMaxMap = new Map(
      migProfiles.migProfiles.map((p) => [p.profile, p.maxCount]),
    );

    return {
      gpuMax: clusterResources.gpu.clusterCapacityCount,
      cpuMax: clusterResources.cpu.clusterCapacityCores,
      memMax: convertBytes(
        Number(clusterResources.memory.clusterCapacityBytes),
        "GB",
        0,
      ).value,
      migProfileMaxMap,
    };
  }, [clusterResources, migProfiles]);

  // 변환된 데이터 준비
  const modalData =
    detailResponse && clusterMaxValues
      ? transformToRequestResourceModalData(detailResponse, clusterMaxValues)
      : null;

  // 반려 처리 핸들러 (react-hook-form의 handleSubmit 사용)
  const onSubmit = (data: RejectResourceFormType) => {
    if (!resourceRequestId) return;

    rejectRequest({
      resourceRequestId,
      data,
    });
  };

  // 모달 닫기 핸들러
  const handleClose = () => {
    if (isPending) return;
    setResourceRequestId(null);
    resetForm();
    onClose();
  };

  // 이벤트 구독
  useSubscribe<RejectResourceEvent>(
    WORKSPACE_EVENTS.sendRejectResource,
    (eventData) => {
      setResourceRequestId(eventData.resourceRequestId);
      onOpen();
    },
  );

  return (
    <Modal
      variant="delete"
      icon={<Icon name="Close" color="#fff" size={18} />}
      modalWidth={370}
      open={open}
      closable={!isPending}
      title="리소스 반려"
      showCancelButton
      cancelText="취소"
      onCancel={handleClose}
      okText="리소스 요청 반려"
      onOk={handleSubmit(onSubmit)}
      centered
      showHeaderBorder
      maskClosable={!isPending}
      keyboard={!isPending}
      cancelButtonProps={{ disabled: isPending }}
      okButtonProps={{
        loading: isPending,
        disabled: isPending || isDetailLoading,
      }}
      loading={isDetailLoading || !clusterResources || !migProfiles}
    >
      <UpdateResourceModalContainer>
        {!modalData && !isDetailLoading && <DataErrorState />}
        {modalData && (
          <>
            <UpdateResourceModalWorkspace>
              <UpdateResourceModalWorkspaceLeft>
                <UpdateResourceModalIconWrapper>
                  <Icon name="Workspace01" color="var(--icon-fill)" size={16} />
                </UpdateResourceModalIconWrapper>
                <UpdateResourceModalIconDescription>
                  워크스페이스
                </UpdateResourceModalIconDescription>
              </UpdateResourceModalWorkspaceLeft>
              <UpdateResourceModalWorkspaceRight>
                <UpdateResourceModalWorkspaceName>
                  {detailResponse?.workspaceName}
                </UpdateResourceModalWorkspaceName>
              </UpdateResourceModalWorkspaceRight>
            </UpdateResourceModalWorkspace>

            <UpdateResourceModalResourceWrapper>
              <UpdateResourceModalLegendWrapper>
                <SliderLegend />
              </UpdateResourceModalLegendWrapper>
              {modalData.resources.map((resource) => (
                <UpdateResourceModalResource
                  key={
                    resource.type === "MIG"
                      ? `${resource.type}-${resource.profile}`
                      : resource.type
                  }
                >
                  <UpdateResourceModalResourceHeader>
                    <UpdateResourceModalResourceTitle>
                      {resource.displayTitle}
                    </UpdateResourceModalResourceTitle>
                  </UpdateResourceModalResourceHeader>
                  <Slider
                    width="100%"
                    min={0}
                    max={resource.max}
                    value={resource.req}
                    type={resource.type}
                    marks={createSliderMarks(resource.current, resource.req)}
                    showInput
                    readOnly={true}
                    readMode={true}
                    error={resource.hasError}
                  />
                </UpdateResourceModalResource>
              ))}
              {(modalData?.errorSummary.hasCapacityError ||
                modalData?.errorSummary.hasMigNotFoundError) && (
                <UpdateResourceModalErrorMessage>
                  {modalData.errorSummary.hasCapacityError &&
                    "요청량이 클러스터 용량을 초과한 리소스가 있습니다."}
                  {modalData.errorSummary.hasCapacityError &&
                    modalData.errorSummary.hasMigNotFoundError && <br />}
                  {modalData.errorSummary.hasMigNotFoundError &&
                    "클러스터에 존재하지 않는 MIG 프로파일이 포함되어 있습니다."}
                </UpdateResourceModalErrorMessage>
              )}

              <Form layout="vertical">
                <LastFormItem
                  label="반려 사유"
                  required
                  validateStatus={errors.rejectReason ? "error" : ""}
                  help={errors.rejectReason?.message}
                >
                  <Controller
                    name="rejectReason"
                    control={control}
                    render={({ field }) => (
                      <TextArea
                        {...field}
                        placeholder="리소스 요청 반려 사유를 입력해 주세요."
                        maxLength={REJECT_REASON_MAX_LENGTH}
                        status={errors.rejectReason ? "error" : undefined}
                        height="50px"
                      />
                    )}
                  />
                </LastFormItem>
              </Form>
            </UpdateResourceModalResourceWrapper>
          </>
        )}
      </UpdateResourceModalContainer>
    </Modal>
  );
}
