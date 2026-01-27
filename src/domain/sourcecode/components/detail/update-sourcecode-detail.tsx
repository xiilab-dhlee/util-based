"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import styled from "styled-components";
import { Button, Form, FormItem, Input, Switch } from "xiilab-ui";

import { getAdminGetSourceCodeListQueryKey } from "@/api/generated/admin-sourcecode/admin-sourcecode";
import type { SourceCodeDetailResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { getGetSourceCodeListQueryKey } from "@/api/generated/source-code/source-code";
import { CredentialSelect } from "@/domain/credential/components/credential-select";
import { SourcecodeParameterFormField } from "@/domain/sourcecode/components/sourcecode-parameter-form-field";
import { useSourcecodeParameters } from "@/domain/sourcecode/hooks/use-sourcecode-parameters";
import { useUpdateSourcecodeByMode } from "@/domain/sourcecode/hooks/use-update-sourcecode-by-mode";
import {
  type UpdateSourcecodeFormType,
  updateSourcecodeSchema,
} from "@/domain/sourcecode/schemas/sourcecode.schema";
import type { SourcecodeMode } from "@/domain/sourcecode/types/sourcecode.type";
import { getSourcecodeTypeInfo } from "@/domain/sourcecode/utils/sourcecode.util";
import { CustomScrollbars } from "@/shared/components/custom-scrollbars";
import { FormLabel } from "@/shared/components/form/form-label";
import { ROUTES } from "@/shared/constants/routes.constant";
import { getVisibilityLabel } from "@/shared/utils/visibility.util";
import {
  AsideDetailArticleBody,
  AsideDetailArticleColumn,
  AsideDetailArticleHeader,
  AsideDetailArticleItem,
  AsideDetailArticleKey,
  AsideDetailArticleTitle,
  AsideDetailArticleValue,
  AsideDetailFooter,
} from "@/styles/layers/aside-detail-layers.styled";
import { LastFormItem } from "@/styles/layers/form-layer.styled";

interface UpdateSourcecodeDetailProps {
  mode: SourcecodeMode;
  sourceCodeId: number;
  data: SourceCodeDetailResponse;
  onCancel: () => void;
  onSuccess: () => void;
}

export function UpdateSourcecodeDetail({
  mode,
  sourceCodeId,
  data,
  onCancel,
  onSuccess,
}: UpdateSourcecodeDetailProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [credentialEnabled, setCredentialEnabled] = useState(false);

  const { mutate, isPending } = useUpdateSourcecodeByMode(mode);

  const {
    parameters,
    addParameter,
    updateParameter,
    removeParameter,
    setParameters,
    fromRecord,
    toRecord,
  } = useSourcecodeParameters();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UpdateSourcecodeFormType>({
    resolver: zodResolver(updateSourcecodeSchema),
  });

  const credentialId = watch("credentialId");
  const { text: typeText } = getSourcecodeTypeInfo(data.sourceCodeType);

  const onSubmit = (formData: UpdateSourcecodeFormType) => {
    if (isPending) return;

    mutate(
      {
        sourceCodeId,
        data: {
          sourceCodeName: formData.sourceCodeName,
          mountPath: formData.mountPath,
          executionCmd: formData.executionCmd,
          shouldBePublic: formData.shouldBePublic,
          credentialId: formData.credentialId ?? undefined,
          parameter: toRecord(),
        },
      },
      {
        onSuccess: ({ sourceCodeId: newSourceCodeId }) => {
          if (mode === "user") {
            queryClient.invalidateQueries({
              queryKey: getGetSourceCodeListQueryKey(),
            });

            router.replace(ROUTES.USER_SOURCECODE_DETAIL(newSourceCodeId));
          } else {
            queryClient.invalidateQueries({
              queryKey: getAdminGetSourceCodeListQueryKey(),
            });

            router.replace(ROUTES.ADMIN_SOURCECODE_DETAIL(newSourceCodeId));
          }
          onSuccess();
        },
      },
    );
  };

  const handleCancelClick = () => {
    reset({
      sourceCodeName: data.sourceCodeName ?? "",
      mountPath: data.mountPath ?? "",
      executionCmd: data.executionCmd ?? "",
      shouldBePublic: data.isPublic ?? false,
      credentialId: data.credentialId ?? null,
    });

    // 파라미터 상태 복원
    setParameters(fromRecord(data.parameter));

    // 크리덴셜 토글 상태 복원
    setCredentialEnabled(!!data.credentialId);

    onCancel();
  };

  const handleCredentialToggle = () => {
    setValue("credentialId", null);
    setCredentialEnabled((prev) => !prev);
  };

  // 데이터 로드 시 폼 초기화
  useEffect(() => {
    reset({
      sourceCodeName: data.sourceCodeName ?? "",
      mountPath: data.mountPath ?? "",
      executionCmd: data.executionCmd ?? "",
      shouldBePublic: data.isPublic ?? false,
      credentialId: data.credentialId ?? null,
    });

    // 파라미터 배열로 변환
    setParameters(fromRecord(data.parameter));

    // 크리덴셜 토글 상태 설정
    setCredentialEnabled(!!data.credentialId);
  }, [data, reset, setParameters, fromRecord]);

  return (
    <StyledForm onFinish={handleSubmit(onSubmit)}>
      <ScrollWrapper>
        <CustomScrollbars autoHide={true}>
          {/* 수정 가능한 기본 정보 섹션 */}
          <StyledArticleBody>
            <AsideDetailArticleItem>
              <AsideDetailArticleHeader>
                <AsideDetailArticleTitle>기본 정보</AsideDetailArticleTitle>
              </AsideDetailArticleHeader>

              <Controller
                name="sourceCodeName"
                control={control}
                render={({ field }) => (
                  <StyledFormItem
                    label="소스코드 이름"
                    required
                    validateStatus={errors.sourceCodeName ? "error" : undefined}
                    help={errors.sourceCodeName?.message}
                  >
                    <Input
                      {...field}
                      placeholder="소스코드 이름을 입력해 주세요."
                      width="100%"
                      autoComplete="off"
                      disabled={isPending}
                      maxLength={50}
                    />
                  </StyledFormItem>
                )}
              />
              <ReadOnlyFormItem>
                <AsideDetailArticleKey>공개 설정</AsideDetailArticleKey>
                <AsideDetailArticleValue>
                  {getVisibilityLabel(data.isPublic)}
                </AsideDetailArticleValue>
              </ReadOnlyFormItem>
              <ReadOnlyFormItem>
                <AsideDetailArticleKey>타입</AsideDetailArticleKey>
                <AsideDetailArticleValue>{typeText}</AsideDetailArticleValue>
              </ReadOnlyFormItem>
              <ReadOnlyFormItem className="last">
                <AsideDetailArticleKey>Git URL</AsideDetailArticleKey>
                <AsideDetailArticleValue className="truncate">
                  {data.gitUrl || "-"}
                </AsideDetailArticleValue>
              </ReadOnlyFormItem>

              <Controller
                name="mountPath"
                control={control}
                render={({ field }) => (
                  <LastFormItem
                    label="Mount Path"
                    required
                    validateStatus={errors.mountPath ? "error" : undefined}
                    help={errors.mountPath?.message}
                  >
                    <Input
                      {...field}
                      placeholder="마운트 경로를 입력해 주세요. (예: /mnt/data)"
                      width="100%"
                      autoComplete="off"
                      disabled={isPending}
                      maxLength={1000}
                    />
                  </LastFormItem>
                )}
              />
            </AsideDetailArticleItem>
          </StyledArticleBody>

          {/* 설정 내용 수정 섹션 */}
          <StyledArticleBody>
            <AsideDetailArticleItem>
              <AsideDetailArticleHeader>
                <AsideDetailArticleTitle>설정 내용</AsideDetailArticleTitle>
              </AsideDetailArticleHeader>

              {/* 크리덴셜 */}
              <CredentialRow>
                <CredentialLabel>
                  <FormLabel>크리덴셜</FormLabel>
                  <Switch
                    checked={credentialEnabled}
                    onChange={handleCredentialToggle}
                    disabled={isPending}
                  />
                </CredentialLabel>
                {credentialEnabled && (
                  <CredentialSelect
                    value={credentialId ?? null}
                    setValue={(value) => setValue("credentialId", value)}
                  />
                )}
              </CredentialRow>

              {/* 실행 명령어 */}
              <Controller
                name="executionCmd"
                control={control}
                render={({ field }) => (
                  <StyledFormItem
                    label="실행 명령어"
                    validateStatus={errors.executionCmd ? "error" : undefined}
                    help={errors.executionCmd?.message}
                    required
                  >
                    <Input
                      {...field}
                      placeholder="실행 명령어를 입력해 주세요."
                      width="100%"
                      autoComplete="off"
                      disabled={isPending}
                      maxLength={1000}
                    />
                  </StyledFormItem>
                )}
              />

              {/* 파라미터 */}
              <ParameterSection>
                <FormLabel>파라미터</FormLabel>
                <SourcecodeParameterFormField
                  value={parameters}
                  onAdd={addParameter}
                  onUpdate={updateParameter}
                  onRemove={removeParameter}
                  disabled={isPending}
                />
              </ParameterSection>
            </AsideDetailArticleItem>
          </StyledArticleBody>
        </CustomScrollbars>
      </ScrollWrapper>

      <Footer>
        <Button
          width={112}
          variant="outlined"
          onClick={handleCancelClick}
          disabled={isPending}
        >
          취소
        </Button>
        <Button
          type="submit"
          color="primary"
          icon="Check"
          iconPosition="left"
          iconSize={20}
          size="medium"
          variant="gradient"
          width="100%"
          loading={isPending}
        >
          저장
        </Button>
      </Footer>
    </StyledForm>
  );
}

const StyledForm = styled(Form)`
  height: 100%;

  & form {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
`;

const ScrollWrapper = styled.div`
  flex: 1;
  position: relative;
`;

const StyledArticleBody = styled(AsideDetailArticleBody)`
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background-color: #fcfcfc;

  & + & {
    margin-top: 10px;
  }
`;

const StyledFormItem = styled(FormItem)`
  margin-bottom: 10px !important;
`;

const ReadOnlyFormItem = styled(AsideDetailArticleColumn)`
  &.last {
    margin-bottom: 10px;
  }

  & + & {
    margin-top: 10px;
  }
`;

const CredentialRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 10px;
`;

const CredentialLabel = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 4px;
`;

const ParameterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Footer = styled(AsideDetailFooter)`
  flex-shrink: 0;
`;
