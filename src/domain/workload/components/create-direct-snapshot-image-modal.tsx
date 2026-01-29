"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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

import type {
  EnvItem,
  PortItem,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { useCreatePrivateSnapshotImage } from "@/api/generated/private-registry/private-registry";
import {
  createPrivateSnapshotImageBodyPortItemNameMax,
  createPrivateSnapshotImageBodyPortItemNameRegExp,
  createPrivateSnapshotImageBodyPortItemPortMax,
} from "@/api/generated/private-registry/private-registry.zod";
import {
  type CreateDirectSnapshotImageFormType,
  createDirectSnapshotImageSchema,
} from "@/domain/workload/schemas/create-direct-snapshot-image.schema";
import { WORKLOAD_EVENTS } from "@/shared/constants/pubsub.constant";
import { WORKLOAD_SELECTOR } from "@/shared/constants/selector.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

/**
 * Direct Snapshot Image 생성 모달에 전달되는 데이터 타입
 */
interface DirectSnapshotImagePayload {
  workloadId: number;
  workspaceId: number;
  env: EnvItem[] | null;
  port: PortItem[] | null;
}

/**
 * Direct Snapshot Image 생성 모달 컴포넌트
 *
 * 워크로드의 현재 상태를 기반으로 Docker 이미지를 생성할 수 있는 모달입니다.
 * react-hook-form을 사용하여 폼 상태를 관리하고, 개인 이미지 스냅샷 API를 호출합니다.
 */
export function CreateDirectSnapshotImageModal() {
  // 모달 상태 관리
  const [open, setOpen] = useState(false);

  // subscription으로 전달받는 데이터 상태
  const [workloadId, setWorkloadId] = useState<number | null>(null);
  const [workspaceId, setWorkspaceId] = useState<number | null>(null);

  // 입력 필드 상태
  const [envKeyInput, setEnvKeyInput] = useState("");
  const [envValueInput, setEnvValueInput] = useState("");
  const [portNameInput, setPortNameInput] = useState("");
  const [portNumberInput, setPortNumberInput] = useState("");

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateDirectSnapshotImageFormType>({
    resolver: zodResolver(createDirectSnapshotImageSchema),
    mode: "onChange",
    defaultValues: {
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

  const { mutate, isPending } = useCreatePrivateSnapshotImage();

  // 포트 번호 유효성 검사 (1-65535)
  const isValidPortNumber = useCallback((portStr: string): boolean => {
    if (!portStr) return false;
    const num = Number(portStr);
    return (
      !Number.isNaN(num) &&
      num >= 1 &&
      num <= createPrivateSnapshotImageBodyPortItemPortMax
    );
  }, []);

  // 포트 이름 유효성 검사 (RFC6335: 소문자/숫자/하이픈, 최소 1개 영문자 필수, 최대 15자)
  const isValidPortName = useCallback((name: string): boolean => {
    if (!name || name.length > createPrivateSnapshotImageBodyPortItemNameMax)
      return false;
    return createPrivateSnapshotImageBodyPortItemNameRegExp.test(name);
  }, []);

  const handleClose = () => {
    if (isPending) return;
    setOpen(false);
  };

  const onSubmit = (data: CreateDirectSnapshotImageFormType) => {
    if (isPending) return;
    if (workloadId === null || workspaceId === null) return;

    // API 요청 형태로 변환 (name/value 또는 name/port가 모두 있는 항목만 전송)
    const envData = data.env
      ?.filter(
        (e): e is typeof e & { name: string; value: string } =>
          !!e.name && !!e.value,
      )
      .map((e) => ({ name: e.name, value: e.value }));

    const portData = data.port
      ?.filter(
        (p): p is typeof p & { name: string; port: number } =>
          !!p.name && p.port !== undefined,
      )
      .map((p) => ({ name: p.name, port: p.port }));

    mutate(
      {
        data: {
          workloadId: workloadId ?? undefined,
          workspaceId: workspaceId ?? undefined,
          imageName: data.imageName,
          imageTagName: data.imageTagName,
          description: data.description || undefined,
          env: envData?.length ? envData : undefined,
          port: portData?.length ? portData : undefined,
        },
      },
      {
        onSuccess: () => {
          setOpen(false);
        },
      },
    );
  };

  /**
   * Direct Snapshot Image 생성 모달 데이터 구독
   */
  useSubscribe(
    WORKLOAD_EVENTS.sendCommitImage,
    (eventData: DirectSnapshotImagePayload) => {
      // 전달받은 데이터 설정
      setWorkloadId(eventData.workloadId);
      setWorkspaceId(eventData.workspaceId);

      // 환경변수 데이터 변환
      const envData =
        eventData.env && eventData.env.length > 0
          ? eventData.env.map((e) => ({
              id: uuidv4(),
              name: e.key,
              value: e.value,
            }))
          : [];

      // 포트 데이터 변환
      const portData =
        eventData.port && eventData.port.length > 0
          ? eventData.port.map((p) => ({
              id: uuidv4(),
              name: p.portName,
              port: p.portNumber,
            }))
          : [];

      // 폼 리셋 (env, port 데이터 포함)
      reset({
        imageName: "",
        imageTagName: "",
        description: "",
        env: envData,
        port: portData,
      });

      // 입력 필드 초기화
      setEnvKeyInput("");
      setEnvValueInput("");
      setPortNameInput("");
      setPortNumberInput("");

      setOpen(true);
    },
  );

  return (
    <Modal
      type="primary"
      icon={<Icon name="Plus" color="#fff" size={18} />}
      modalWidth={500}
      open={open}
      title="Snapshot Image 생성"
      showCancelButton
      cancelText="취소"
      onCancel={handleClose}
      okText="생성"
      onOk={handleSubmit(onSubmit)}
      centered
      showHeaderBorder
      closable={!isPending}
      maskClosable={!isPending}
      keyboard={!isPending}
      okButtonProps={{
        disabled: workloadId === null || workspaceId === null,
        loading: isPending,
      }}
      cancelButtonProps={{
        disabled: isPending,
      }}
    >
      <ModalContent>
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
                  data-testid={WORKLOAD_SELECTOR.COMMIT_IMAGE_NAME_INPUT}
                  placeholder="컨테이너 이미지 이름을 입력해 주세요."
                  autoComplete="off"
                  width="100%"
                />
              </FormItem>
            )}
          />
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
                  data-testid={WORKLOAD_SELECTOR.COMMIT_IMAGE_TAG_INPUT}
                  placeholder="태그를 입력해 주세요."
                  autoComplete="off"
                  width="100%"
                />
              </FormItem>
            )}
          />
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <FormItem
                label="설명"
                validateStatus={errors.description ? "error" : undefined}
                htmlFor="snapshotDescription"
                help={errors.description?.message}
              >
                <TextArea
                  {...field}
                  id="snapshotDescription"
                  placeholder="이미지 설명을 입력해 주세요. (최대 500자)"
                  autoComplete="off"
                  rows={3}
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
                    disabled={!envKeyInput || !envValueInput}
                    onClick={() => {
                      if (envKeyInput && envValueInput) {
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
                    disabled={
                      !isValidPortName(portNameInput) ||
                      !isValidPortNumber(portNumberInput)
                    }
                    onClick={() => {
                      if (
                        isValidPortName(portNameInput) &&
                        isValidPortNumber(portNumberInput)
                      ) {
                        appendPort({
                          id: uuidv4(),
                          name: portNameInput,
                          port: Number(portNumberInput),
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
                            e.target.value ? Number(e.target.value) : undefined,
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
      </ModalContent>
    </Modal>
  );
}

// Styled Components
const ModalContent = styled.div`
  max-height: 450px;
  overflow-y: auto;
  padding-right: 8px;
`;

const DynamicFieldSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 16px;
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
