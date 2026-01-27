"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { useCallback, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";
import {
  Button,
  Form,
  FormItem,
  Icon,
  Input,
  Modal,
  TextArea,
  Typography,
} from "xiilab-ui";

import { getGetImageJobsQueryKey } from "@/api/generated/image-job/image-job";
import { useCreateSnapshotRegistryByMode } from "@/domain/registry/hooks/use-create-snapshot-registry-by-mode";
import {
  type CreateSnapshotRegistryFormType,
  createSnapshotRegistrySchema,
} from "@/domain/registry/schemas/create-snapshot-registry.schema";
import type { RegistryMode } from "@/domain/registry/types/registry.type";
import { WorkloadCard } from "@/domain/workload/components/workload-card";
import type { WorkloadListType } from "@/domain/workload/schemas/workload.schema";
import { REGISTRY_EVENTS } from "@/shared/constants/pubsub.constant";
import { useDebouncedSearch } from "@/shared/hooks/use-debounced-search";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";
import { useServices } from "@/shared/providers/service-provider";
import { selectedWorkspaceAtom } from "@/shared/state/core.atom";

interface CreateSnapshotRegistryModalProps {
  mode: RegistryMode;
}

const PAGE_SIZE = 10;

/**
 * 워크로드 목록 조회 훅 (무한 스크롤)
 */
function useWorkloadInfiniteList(keyword: string, enabled: boolean) {
  const { workloadService } = useServices();
  const selectedWorkspace = useAtomValue(selectedWorkspaceAtom);

  return useInfiniteQuery({
    queryKey: [
      "snapshot-workload-list",
      selectedWorkspace?.workspaceId,
      keyword,
    ],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await workloadService.getList({
        page: pageParam,
        size: PAGE_SIZE,
        searchText: keyword || undefined,
      });
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage) return undefined;
      const { currentPageNo = 1, totalPageNum = 1 } = lastPage;
      return currentPageNo < totalPageNum ? currentPageNo + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: enabled && !!selectedWorkspace?.workspaceId,
  });
}

/**
 * 스냅샷 레지스트리 이미지 생성 모달
 *
 * 좌측: 이미지 정보 폼 (이름, 태그, 설명, 환경변수, 포트)
 * 우측: 워크로드 선택 (검색 + 무한스크롤 카드 리스트)
 */
export function CreateSnapshotRegistryModal({
  mode,
}: CreateSnapshotRegistryModalProps) {
  const queryClient = useQueryClient();
  const selectedWorkspace = useAtomValue(selectedWorkspaceAtom);
  const [open, setOpen] = useState(false);
  const [selectedWorkloadId, setSelectedWorkloadId] = useState<number | null>(
    null,
  );

  // 입력 필드 상태
  const [envKeyInput, setEnvKeyInput] = useState("");
  const [envValueInput, setEnvValueInput] = useState("");
  const [portNameInput, setPortNameInput] = useState("");
  const [portNumberInput, setPortNumberInput] = useState("");

  const { keyword, handleSearch, resetKeyword } = useDebouncedSearch();
  const {
    data: workloadData,
    isLoading: isWorkloadLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useWorkloadInfiniteList(keyword, open);

  const workloads =
    workloadData?.pages.flatMap((page) => page.content ?? []) ?? [];

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateSnapshotRegistryFormType>({
    resolver: zodResolver(createSnapshotRegistrySchema),
    mode: "onChange",
    defaultValues: {
      workloadId: undefined,
      imageName: "",
      imageTagName: "",
      description: "",
      env: [],
      port: [],
    },
  });

  const {
    fields: envFields,
    append: appendEnv,
    remove: removeEnv,
  } = useFieldArray({ control, name: "env" });

  const {
    fields: portFields,
    append: appendPort,
    remove: removePort,
  } = useFieldArray({ control, name: "port" });

  const { mutate, isPending } = useCreateSnapshotRegistryByMode(mode);

  const onSubmit = (data: CreateSnapshotRegistryFormType) => {
    if (!selectedWorkspace) return;

    // API 요청 형태로 변환
    const envData = data.env
      ?.filter((e) => e.name && e.value)
      .map((e) => ({ name: e.name!, value: e.value! }));
    const portData = data.port
      ?.filter((p) => p.name && p.port)
      .map((p) => ({ name: p.name!, port: p.port! }));

    mutate(
      {
        data: {
          workloadId: data.workloadId,
          imageName: data.imageName,
          imageTagName: data.imageTagName,
          workspaceId: selectedWorkspace.workspaceId,
          env: envData?.length ? envData : undefined,
          port: portData?.length ? portData : undefined,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getGetImageJobsQueryKey(),
          });
          handleClose();
        },
      },
    );
  };

  const handleClose = () => {
    if (isPending) return;
    setOpen(false);
    setSelectedWorkloadId(null);
    resetKeyword();
  };

  const handleSelectWorkload = useCallback(
    (workload: WorkloadListType) => {
      const numericId =
        typeof workload.id === "string"
          ? parseInt(workload.id, 10)
          : workload.id;
      setSelectedWorkloadId(numericId);
      setValue("workloadId", numericId, { shouldValidate: true });
    },
    [setValue],
  );

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const target = e.target as HTMLDivElement;
      const isNearBottom =
        target.scrollTop + target.clientHeight >= target.scrollHeight - 50;

      if (isNearBottom && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage],
  );

  useSubscribe<void>(REGISTRY_EVENTS.openCreateSnapshotModal, () => {
    reset({
      workloadId: undefined,
      imageName: "",
      imageTagName: "",
      description: "",
      env: [],
      port: [],
    });
    setSelectedWorkloadId(null);
    resetKeyword();
    // 입력 필드 초기화
    setEnvKeyInput("");
    setEnvValueInput("");
    setPortNameInput("");
    setPortNumberInput("");
    setOpen(true);
  });

  return (
    <Modal
      type="primary"
      icon={<Icon name="Plus" color="#fff" size={18} />}
      modalWidth={900}
      open={open}
      title="컨테이너 이미지 생성"
      showCancelButton
      onCancel={handleClose}
      okText="생성"
      onOk={handleSubmit(onSubmit)}
      centered
      showHeaderBorder
      closable={!isPending}
      maskClosable={!isPending}
      keyboard={!isPending}
      okButtonProps={{
        loading: isPending,
      }}
      cancelButtonProps={{
        disabled: isPending,
      }}
    >
      <ModalContent>
        {/* 좌측: 폼 영역 */}
        <FormSection>
          <Form onFinish={handleSubmit(onSubmit)}>
            <Controller
              name="imageName"
              control={control}
              render={({ field }) => (
                <FormItem
                  label="컨테이너 이미지 이름"
                  required
                  validateStatus={errors.imageName ? "error" : undefined}
                  htmlFor="snapshotImageName"
                  help={errors.imageName?.message}
                >
                  <Input
                    {...field}
                    type="text"
                    id="snapshotImageName"
                    placeholder="컨테이너 이미지 이름을 입력해 주세요."
                    autoComplete="off"
                    width="100%"
                  />
                </FormItem>
              )}
            />

            <TagRow>
              <Controller
                name="imageTagName"
                control={control}
                render={({ field }) => (
                  <FormItem
                    label="태그"
                    required
                    validateStatus={errors.imageTagName ? "error" : undefined}
                    htmlFor="snapshotImageTag"
                    help={errors.imageTagName?.message}
                  >
                    <Input
                      {...field}
                      type="text"
                      id="snapshotImageTag"
                      placeholder="문자, 숫자, 하이픈(-), 밑줄(_)만 사용 가능합니다."
                      autoComplete="off"
                      width="100%"
                    />
                  </FormItem>
                )}
              />
            </TagRow>

            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <FormItem
                  label="설명"
                  validateStatus={errors.description ? "error" : undefined}
                  help={errors.description?.message}
                >
                  <TextArea
                    {...field}
                    placeholder="컨테이너 이미지에 대한 설명을 입력해 주세요."
                    width="100%"
                    rows={2}
                  />
                </FormItem>
              )}
            />

            {/* 환경변수 */}
            <DynamicFieldSection>
              <Typography.Text variant="body-2-1" color="#484848">
                환경변수
              </Typography.Text>
              <DynamicFieldList>
                {/* 입력 행: + 버튼 */}
                <DynamicFieldRow>
                  <FieldInput
                    placeholder="환경변수 키 입력"
                    value={envKeyInput}
                    onChange={(e) => setEnvKeyInput(e.target.value)}
                  />
                  <FieldInput
                    placeholder="환경변수 값 입력"
                    value={envValueInput}
                    onChange={(e) => setEnvValueInput(e.target.value)}
                  />
                  <ButtonWrapper>
                    <Button
                      icon="Plus"
                      iconSize={14}
                      onClick={() => {
                        if (envKeyInput || envValueInput) {
                          appendEnv({
                            id: uuidv4(),
                            name: envKeyInput,
                            value: envValueInput,
                          });
                          setEnvKeyInput("");
                          setEnvValueInput("");
                        }
                      }}
                    />
                  </ButtonWrapper>
                </DynamicFieldRow>
                {/* 추가된 데이터 행: 삭제 버튼 */}
                {envFields.map((field, index) => (
                  <DynamicFieldRow key={field.id}>
                    <Controller
                      name={`env.${index}.name`}
                      control={control}
                      render={({ field: inputField }) => (
                        <FieldInput
                          {...inputField}
                          placeholder="환경변수 키 입력"
                        />
                      )}
                    />
                    <Controller
                      name={`env.${index}.value`}
                      control={control}
                      render={({ field: inputField }) => (
                        <FieldInput
                          {...inputField}
                          placeholder="환경변수 값 입력"
                        />
                      )}
                    />
                    <ButtonWrapper>
                      <Button
                        icon="Delete"
                        iconSize={16}
                        onClick={() => removeEnv(index)}
                      />
                    </ButtonWrapper>
                  </DynamicFieldRow>
                ))}
              </DynamicFieldList>
            </DynamicFieldSection>

            {/* 포트 */}
            <DynamicFieldSection>
              <Typography.Text variant="body-2-1" color="#484848">
                포트
              </Typography.Text>
              <DynamicFieldList>
                {/* 입력 행: + 버튼 */}
                <DynamicFieldRow>
                  <FieldInput
                    placeholder="포트 이름 입력"
                    value={portNameInput}
                    onChange={(e) => setPortNameInput(e.target.value)}
                  />
                  <FieldInput
                    type="number"
                    placeholder="포트 번호 입력"
                    value={portNumberInput}
                    onChange={(e) => setPortNumberInput(e.target.value)}
                  />
                  <ButtonWrapper>
                    <Button
                      icon="Plus"
                      iconSize={14}
                      onClick={() => {
                        if (portNameInput || portNumberInput) {
                          appendPort({
                            id: uuidv4(),
                            name: portNameInput,
                            port: portNumberInput
                              ? Number(portNumberInput)
                              : undefined,
                          });
                          setPortNameInput("");
                          setPortNumberInput("");
                        }
                      }}
                    />
                  </ButtonWrapper>
                </DynamicFieldRow>
                {/* 추가된 데이터 행: 삭제 버튼 */}
                {portFields.map((field, index) => (
                  <DynamicFieldRow key={field.id}>
                    <Controller
                      name={`port.${index}.name`}
                      control={control}
                      render={({ field: inputField }) => (
                        <FieldInput
                          {...inputField}
                          placeholder="포트 이름 입력"
                        />
                      )}
                    />
                    <Controller
                      name={`port.${index}.port`}
                      control={control}
                      render={({ field: inputField }) => (
                        <FieldInput
                          {...inputField}
                          type="number"
                          placeholder="포트 번호 입력"
                          onChange={(e) =>
                            inputField.onChange(
                              e.target.value
                                ? Number(e.target.value)
                                : undefined,
                            )
                          }
                          value={inputField.value ?? ""}
                        />
                      )}
                    />
                    <ButtonWrapper>
                      <Button
                        icon="Delete"
                        iconSize={16}
                        onClick={() => removePort(index)}
                      />
                    </ButtonWrapper>
                  </DynamicFieldRow>
                ))}
              </DynamicFieldList>
            </DynamicFieldSection>
          </Form>
        </FormSection>

        {/* 우측: 워크로드 선택 영역 */}
        <WorkloadSection>
          <WorkloadHeader>
            <Typography.Text variant="body-2-1" color="#484848">
              워크로드 선택
            </Typography.Text>
            <RequiredMark>*</RequiredMark>
          </WorkloadHeader>
          <SearchInput
            placeholder="워크로드 이름을 입력해 주세요."
            onChange={(e) => handleSearch(e.target.value)}
            suffix={<Icon name="Search" size={16} color="#999" />}
          />
          <WorkloadListContainer onScroll={handleScroll}>
            {isWorkloadLoading ? (
              <LoadingMessage>워크로드 목록을 불러오는 중...</LoadingMessage>
            ) : workloads.length === 0 ? (
              <EmptyMessage>워크로드가 없습니다.</EmptyMessage>
            ) : (
              <WorkloadGrid>
                {workloads.map((workload) => {
                  const numericId =
                    typeof workload.id === "string"
                      ? parseInt(workload.id, 10)
                      : workload.id;
                  return (
                    <WorkloadCard
                      key={workload.id}
                      {...workload}
                      isChecked={selectedWorkloadId === numericId}
                      onCheck={() => handleSelectWorkload(workload)}
                    />
                  );
                })}
              </WorkloadGrid>
            )}
            {isFetchingNextPage && (
              <LoadingMessage>더 불러오는 중...</LoadingMessage>
            )}
          </WorkloadListContainer>
          {errors.workloadId && (
            <ErrorMessage>{errors.workloadId.message}</ErrorMessage>
          )}
        </WorkloadSection>
      </ModalContent>
    </Modal>
  );
}

// Styled Components
const ModalContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  min-height: 500px;
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding-right: 12px;
`;

const TagRow = styled.div`
  display: flex;
  flex-direction: column;
`;

const DynamicFieldSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
`;

const DynamicFieldList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 120px;
  overflow-y: auto;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 12px;
`;

const DynamicFieldRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 32px;
  gap: 8px;
  align-items: center;
`;

const FieldInput = styled(Input)`
  height: 32px;
`;

const ButtonWrapper = styled.div`
  width: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;

  & > button {
    width: 32px !important;
    height: 32px !important;
  }
`;

const WorkloadSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-left: 1px solid #e9ebee;
  padding-left: 24px;
`;

const WorkloadHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const RequiredMark = styled.span`
  color: #ff4d4f;
`;

const SearchInput = styled(Input)`
  width: 100%;
`;

const WorkloadListContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  border: 1px solid #e9ebee;
  border-radius: 4px;
  padding: 12px;
  min-height: 380px;
`;

const WorkloadGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
`;

const LoadingMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  color: #999;
`;

const EmptyMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
`;

const ErrorMessage = styled.div`
  color: #ff4d4f;
  font-size: 12px;
`;
