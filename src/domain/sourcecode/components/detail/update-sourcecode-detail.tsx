"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import styled from "styled-components";
import { Button, Dropdown, Input } from "xiilab-ui";

import type { SourceCodeListResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  getGetSourceCodeListQueryKey,
  useUpdateSourceCode,
} from "@/api/generated/source-code/source-code";
import { CustomScrollbars } from "@/shared/components/custom-scrollbars";
import { VISIBILITY_STATUS_OPTIONS } from "@/shared/constants/core.constant";
import { useSelect } from "@/shared/hooks/use-select";
import {
  AsideDetailArticle,
  AsideDetailArticleBody,
  AsideDetailArticleColumn,
  AsideDetailArticleHeader,
  AsideDetailArticleItem,
  AsideDetailArticleKey,
  AsideDetailArticleTitle,
  AsideDetailArticleValue,
  AsideDetailFooter,
  AsideDetailScrollWrapper,
} from "@/styles/layers/aside-detail-layers.styled";
import { SourcecodeFormFieldControl } from "@/styles/layers/sourcecode-form-layers.styled";

interface UpdateSourcecodeDetailProps {
  sourceCodeId: number;
  data: SourceCodeListResponse;
  onCancel: () => void;
  onSuccess: () => void;
}

export function UpdateSourcecodeDetail({
  sourceCodeId,
  data,
  onCancel,
  onSuccess,
}: UpdateSourcecodeDetailProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const queryClient = useQueryClient();
  const updateSourceCode = useUpdateSourceCode();

  const status = useSelect(
    data?.isPublic ? "PUBLIC" : "PRIVATE",
    VISIBILITY_STATUS_OPTIONS,
  );

  const handleSubmit = () => {
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    const sourceCodeName = formData.get("sourceCodeName") as string;
    const mountPath = formData.get("mountPath") as string;
    const executionCmd = formData.get("executionCmd") as string;

    updateSourceCode.mutate(
      {
        sourceCodeId,
        data: {
          sourceCodeName,
          mountPath,
          executionCmd,
          isPublic: status.value === "PUBLIC",
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getGetSourceCodeListQueryKey(),
          });
          onSuccess();
        },
      },
    );
  };

  return (
    <>
      <AsideDetailScrollWrapper>
        <CustomScrollbars>
          <form ref={formRef}>
            <AsideDetailArticle>
              <AsideDetailArticleBody>
                {/* 소스코드 정보 섹션 */}
                <AsideDetailArticleItem>
                  <AsideDetailArticleHeader>
                    <AsideDetailArticleTitle>
                      소스코드 정보
                    </AsideDetailArticleTitle>
                  </AsideDetailArticleHeader>

                  {/* 소스코드 이름 */}
                  <AsideDetailArticleColumn>
                    <AsideDetailArticleKey>소스코드 이름</AsideDetailArticleKey>
                  </AsideDetailArticleColumn>
                  <InputWrapper>
                    <Input
                      placeholder="소스코드 이름을 입력해주세요."
                      width="100%"
                      name="sourceCodeName"
                      autoComplete="off"
                      defaultValue={data?.sourceCodeName || ""}
                    />
                  </InputWrapper>

                  {/* 공개 설정 */}
                  <AsideDetailArticleColumn>
                    <AsideDetailArticleKey>공개 설정</AsideDetailArticleKey>
                  </AsideDetailArticleColumn>
                  <SourcecodeFormFieldControl
                    style={{ marginTop: 8, marginBottom: 16 }}
                  >
                    <Dropdown
                      options={status.options}
                      onChange={status.setValue}
                      value={status.value}
                      width="100%"
                      placeholder="공개 설정을 선택해 주세요."
                    />
                  </SourcecodeFormFieldControl>

                  {/* 소스코드 타입 (읽기 전용) */}
                  <AsideDetailArticleColumn>
                    <AsideDetailArticleKey>타입</AsideDetailArticleKey>
                    <AsideDetailArticleValue>
                      {data?.sourceCodeType || "-"}
                    </AsideDetailArticleValue>
                  </AsideDetailArticleColumn>

                  {/* Git URL (읽기 전용) */}
                  <AsideDetailArticleColumn>
                    <AsideDetailArticleKey>Git URL</AsideDetailArticleKey>
                    <AsideDetailArticleValue className="truncate">
                      {data?.gitUrl || "-"}
                    </AsideDetailArticleValue>
                  </AsideDetailArticleColumn>

                  {/* 마운트 경로 */}
                  <AsideDetailArticleColumn>
                    <AsideDetailArticleKey>마운트 경로</AsideDetailArticleKey>
                  </AsideDetailArticleColumn>
                  <InputWrapper>
                    <Input
                      placeholder="마운트 경로를 입력해주세요."
                      width="100%"
                      name="mountPath"
                      autoComplete="off"
                      defaultValue={data?.mountPath || ""}
                    />
                  </InputWrapper>
                </AsideDetailArticleItem>

                {/* 설정 내용 섹션 */}
                <SecondaryArticleItem>
                  <AsideDetailArticleHeader>
                    <AsideDetailArticleTitle>설정 내용</AsideDetailArticleTitle>
                  </AsideDetailArticleHeader>

                  {/* 실행 명령어 */}
                  <AsideDetailArticleColumn>
                    <AsideDetailArticleKey>실행 명령어</AsideDetailArticleKey>
                  </AsideDetailArticleColumn>
                  <InputWrapper>
                    <Input
                      placeholder="실행 명령어를 입력해주세요."
                      width="100%"
                      name="executionCmd"
                      autoComplete="off"
                      defaultValue={data?.executionCmd || ""}
                    />
                  </InputWrapper>
                </SecondaryArticleItem>
              </AsideDetailArticleBody>
            </AsideDetailArticle>
          </form>
        </CustomScrollbars>
      </AsideDetailScrollWrapper>

      {/* 하단 버튼 영역 */}
      <AsideDetailFooter>
        <Button width={112} variant="outlined" onClick={onCancel}>
          취소
        </Button>
        <Button
          color="primary"
          icon="Check"
          iconPosition="left"
          iconSize={20}
          size="medium"
          variant="gradient"
          width="100%"
          onClick={handleSubmit}
          loading={updateSourceCode.isPending}
        >
          저장
        </Button>
      </AsideDetailFooter>
    </>
  );
}

const SecondaryArticleItem = styled(AsideDetailArticleItem)`
  margin-top: 10px;
`;

const InputWrapper = styled.div`
  margin-top: 8px;
  margin-bottom: 16px;
`;
