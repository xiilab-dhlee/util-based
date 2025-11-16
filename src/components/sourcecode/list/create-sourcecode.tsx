"use client";

import { useSetAtom } from "jotai";
import Image from "next/image";
import type { FormEvent } from "react";
import { useRef } from "react";
import styled from "styled-components";
import { Button, Input } from "xiilab-ui";

import { openCreateCredentialModalAtom } from "@/atoms/common/modal.atom";
import { CreateModelButton } from "@/components/common/button/create-model-button";
import { CreateCredentialModal } from "@/components/common/modal/create-credential-modal";
import { GuidePopover } from "@/components/common/popover/guide-popover";
import { MySelect } from "@/components/common/select";
import { useCreateSourcecode } from "@/hooks/sourcecode/use-create-sourcecode";
import { AsideDetailForm } from "@/styles/layers/aside-detail-layers.styled";
import {
  AsideListArticleDescription,
  AsideListArticleHeader,
  AsideListArticleTitle,
} from "@/styles/layers/aside-list-layers.styled";
import {
  SourcecodeFormField,
  SourcecodeFormFieldControl,
  SourcecodeFormFieldHeader,
  SourcecodeFormFieldLabel,
  SourcecodeFormMultiField,
  SourcecodeFormSingleField,
  SourcecodeFormTooltip,
  SourcecodeFormTooltipDescription,
  SourcecodeFormTooltipTitle,
} from "@/styles/layers/sourcecode-form-layers.styled";
import type { CreateSourcecodePayload } from "@/types/sourcecode/sourcecode.type";
import { ManageCredential } from "../manage-credential";
import { ManageParameter } from "../manage-parameter";

/**
 * 소스코드 생성 컴포넌트
 *
 * Git 리포지토리 정보를 입력받아 새로운 소스코드를 생성하는 폼을 제공합니다.
 * Git URL, 크레덴셜, 기본 마운트 경로, 실행 명령어, 파라미터 등을 설정할 수 있습니다.
 *
 * 주요 기능:
 * - 소스코드 제작 가이드 표시
 * - 소스코드 생성 폼 제공
 * - 크레덴셜 생성 모달 연동
 * - 파라미터 동적 추가/삭제
 * - 폼 데이터 검증 및 제출
 * - 폼 초기화
 *
 * @returns 소스코드 생성 UI를 포함한 JSX 요소
 */
export function CreateSourcecode() {
  // 폼 요소에 대한 참조 - 폼 초기화 및 데이터 수집에 사용
  const formRef = useRef<HTMLFormElement>(null);
  // 크레덴셜 생성 모달 표시 설정
  const setOpenCreateCredentialModal = useSetAtom(
    openCreateCredentialModalAtom,
  );

  // 소스코드 생성 뮤테이션 훅
  const createSourcecode = useCreateSourcecode();

  /**
   * 폼 초기화 핸들러
   *
   * 폼 내의 모든 입력 요소를 초기 상태로 되돌립니다.
   * 체크박스, 라디오 버튼, 셀렉트 박스, 텍스트 입력 등 다양한 타입의 입력 요소를 처리합니다.
   * ManageParameter 컴포넌트의 상태도 초기화하기 위해 key를 변경하여 리렌더링을 유도합니다.
   */
  const handleReset = () => {
    if (!formRef.current) return;

    // 폼 내의 모든 입력 요소 선택
    const formElements = formRef.current.elements;

    // 각 입력 요소의 값을 초기화
    for (let i = 0; i < formElements.length; i++) {
      const element = formElements[i] as
        | HTMLInputElement
        | HTMLSelectElement
        | HTMLTextAreaElement;

      // name 속성이 있는 요소만 처리
      if (element.name) {
        if (
          element instanceof HTMLInputElement &&
          (element.type === "checkbox" || element.type === "radio")
        ) {
          // 체크박스와 라디오 버튼은 체크 해제
          element.checked = false;
        } else if (element instanceof HTMLSelectElement) {
          // 셀렉트 박스는 첫 번째 옵션 선택
          element.selectedIndex = 0;
        } else {
          // 텍스트 입력 요소는 빈 문자열로 초기화
          element.value = "";
        }
      }
    }

    // ManageParameter 컴포넌트의 상태도 초기화하기 위해 key를 변경하여 리렌더링
    // 이는 ManageParameter 컴포넌트가 내부 상태를 가지고 있을 경우를 대비한 방법
    if (formRef.current) {
      formRef.current.setAttribute("data-reset-key", Date.now().toString());
    }
  };

  /**
   * 크레덴셜 생성 모달 열기 핸들러
   *
   * 사용자가 크레덴셜 생성 버튼을 클릭했을 때 호출됩니다.
   * 크레덴셜 생성 모달을 열어 새로운 크레덴셜을 추가할 수 있게 합니다.
   */
  const handleClickCreateCredential = () => {
    setOpenCreateCredentialModal(true);
  };

  /**
   * 폼 제출 핸들러
   *
   * 폼이 제출될 때 호출되며, 폼 데이터를 수집하여 소스코드 생성 API를 호출합니다.
   * 현재는 validation이 TODO로 남아있어 추가 검증 로직이 필요합니다.
   *
   * @param e - 폼 제출 이벤트 객체
   */
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const payload = createPayload();

    if (payload) {
      // TODO: validation 추가 필요
      createSourcecode.mutate(payload);
    }
  };

  /**
   * 폼 데이터를 수집하여 API 요청용 페이로드 생성
   *
   * 폼의 모든 입력 필드에서 데이터를 수집하고, CreateSourcecodePayload 형태로 변환합니다.
   * 파라미터는 동적으로 추가되는 구조이므로 인덱스 기반으로 순차적으로 수집합니다.
   *
   * @returns CreateSourcecodePayload 객체 또는 null (폼 참조가 없는 경우)
   */
  const createPayload = (): CreateSourcecodePayload | null => {
    if (!formRef.current) return null;

    // 폼 데이터 수집
    const formData = new FormData(formRef.current);

    // 기본 필드들 수집
    const gitUrl = formData.get("gitUrl") as string;
    const mountPath = formData.get("defaultPath") as string;
    const executeCommand = formData.get("cmd") as string;
    const gitType = (formData.get("gitType") as string) || "Github";

    // 파라미터 데이터 수집
    // 파라미터는 동적으로 추가되므로 인덱스 기반으로 순차적으로 수집
    const parameters: Array<{ key: string; value: string }> = [];
    let index = 0;

    while (true) {
      const key = formData.get(`parameter-key-${index}`) as string;
      const value = formData.get(`parameter-value-${index}`) as string;

      if (!key && !value) break; // 더 이상 파라미터가 없으면 중단

      if (key || value) {
        // 키나 값 중 하나라도 있으면 추가 (빈 값도 허용)
        parameters.push({ key: key || "", value: value || "" });
      }

      index++;
    }

    return {
      gitUrl,
      gitType,
      mountPath,
      executeCommand,
      // 키나 값이 모두 비어있는 파라미터는 필터링하여 제거
      parameters: parameters.filter((p) => p.key || p.value),
    };
  };

  return (
    <>
      {/* 전체 컨테이너 */}
      <AsideDetailForm ref={formRef} onSubmit={handleSubmit}>
        {/* 소스코드 제작 가이드 섹션 */}
        <GuideArticle>
          <AsideListArticleHeader>
            <AsideListArticleTitle>소스코드 제작 가이드</AsideListArticleTitle>
            <AsideListArticleDescription>
              가이드를 확인하여 더 편하게 소스코드를 제작할 수 있습니다.
            </AsideListArticleDescription>
          </AsideListArticleHeader>
          {/* 가이드 이미지 */}
          <Image
            src="/images/create-sourcecode-guide.png"
            width={572}
            height={282}
            alt="소스코드 제작 가이드"
          />
        </GuideArticle>

        {/* 소스코드 생성 폼 섹션 */}
        <CreateArticle>
          <AsideListArticleHeader>
            <AsideListArticleTitle>소스코드 생성</AsideListArticleTitle>
            <AsideListArticleDescription>
              사용자가 등록한 소스코드를 워크로드에 연결할 수 있습니다.
            </AsideListArticleDescription>
          </AsideListArticleHeader>

          {/* 소스코드 생성 폼 */}
          <CreateArticleBody>
            {/* Git URL 입력 필드 */}
            <SourcecodeFormSingleField>
              <SourcecodeFormField>
                <SourcecodeFormFieldHeader>
                  <SourcecodeFormFieldLabel
                    className="required"
                    htmlFor="gitUrl"
                  >
                    Git URL
                  </SourcecodeFormFieldLabel>
                </SourcecodeFormFieldHeader>
                <SourcecodeFormFieldControl>
                  {/* Git 프로토콜 선택 (현재 미구현) */}
                  <MySelect
                    options={[]}
                    setValue={() => {}}
                    value={null}
                    width={100}
                    placeholder="선택"
                  />
                  {/* Git URL 입력 필드 */}
                  {/* TODO: 추후 width 100%로 변경 필요 */}
                  <Input
                    placeholder="Git URL을 입력해주세요."
                    width="100%"
                    name="gitUrl"
                  />
                </SourcecodeFormFieldControl>
              </SourcecodeFormField>
            </SourcecodeFormSingleField>

            {/* 크레덴셜 선택 필드 */}
            <SourcecodeFormSingleField>
              <SourcecodeFormField>
                <SourcecodeFormFieldHeader>
                  <SourcecodeFormFieldLabel>크레덴셜</SourcecodeFormFieldLabel>
                  <div>
                    {/* 크레덴셜 생성 버튼 */}
                    <CreateModelButton
                      onClick={handleClickCreateCredential}
                      title="크레덴셜 생성"
                    />
                  </div>
                </SourcecodeFormFieldHeader>
                {/* 크레덴셜 관리 컴포넌트 */}
                <ManageCredential />
              </SourcecodeFormField>
            </SourcecodeFormSingleField>

            {/* 기본 마운트 경로와 실행 명령어 필드 (다중 필드) */}
            <SourcecodeFormMultiField>
              {/* 기본 마운트 경로 입력 필드 */}
              <SourcecodeFormField>
                <SourcecodeFormFieldHeader>
                  <SourcecodeFormFieldLabel
                    className="required"
                    htmlFor="defaultPath"
                  >
                    기본 마운트 경로
                    {/* 가이드 툴팁 */}
                    {/* TODO: 추후 가이드 텍스트 정의 후 변경 필요 */}
                    <GuidePopover
                      popupContent={
                        <SourcecodeFormTooltip>
                          <SourcecodeFormTooltipTitle>
                            기본 마운트 경로:
                          </SourcecodeFormTooltipTitle>
                          <SourcecodeFormTooltipDescription>
                            키 값 다중 입력 가능
                          </SourcecodeFormTooltipDescription>
                        </SourcecodeFormTooltip>
                      }
                    />
                  </SourcecodeFormFieldLabel>
                </SourcecodeFormFieldHeader>
                <SourcecodeFormFieldControl>
                  <Input
                    placeholder="기본 마운트 경로를 입력해주세요."
                    width="100%"
                    name="defaultPath"
                    autoComplete="off"
                  />
                </SourcecodeFormFieldControl>
              </SourcecodeFormField>

              {/* 실행 명령어 입력 필드 */}
              <SourcecodeFormField>
                <SourcecodeFormFieldHeader>
                  <SourcecodeFormFieldLabel className="required" htmlFor="cmd">
                    실행 명령어
                    {/* 가이드 툴팁 */}
                    <GuidePopover
                      popupContent={
                        <SourcecodeFormTooltip>
                          <SourcecodeFormTooltipTitle>
                            실행 명령어:
                          </SourcecodeFormTooltipTitle>
                          <SourcecodeFormTooltipDescription>
                            키 값 다중 입력 가능
                          </SourcecodeFormTooltipDescription>
                        </SourcecodeFormTooltip>
                      }
                    />
                  </SourcecodeFormFieldLabel>
                </SourcecodeFormFieldHeader>
                <SourcecodeFormFieldControl>
                  <Input
                    placeholder="실행 명령어를 입력해주세요."
                    width="100%"
                    name="cmd"
                    autoComplete="off"
                  />
                </SourcecodeFormFieldControl>
              </SourcecodeFormField>
            </SourcecodeFormMultiField>

            {/* 파라미터 입력 섹션 */}
            <SourcecodeFormSingleField>
              <SourcecodeFormField>
                {/* 파라미터 섹션 헤더 */}
                <SourcecodeFormFieldHeader>
                  <SourcecodeFormFieldLabel
                    className="required"
                    htmlFor="defaultPath"
                  >
                    파라미터
                    {/* 파라미터 설명 툴팁 */}
                    <GuidePopover
                      popupContent={
                        <SourcecodeFormTooltip>
                          <SourcecodeFormTooltipTitle>
                            파라미터:
                          </SourcecodeFormTooltipTitle>
                          <SourcecodeFormTooltipDescription>
                            키 값 다중 입력 가능
                          </SourcecodeFormTooltipDescription>
                        </SourcecodeFormTooltip>
                      }
                    />
                  </SourcecodeFormFieldLabel>
                </SourcecodeFormFieldHeader>

                {/* 파라미터 입력 컨테이너 */}
                <ManageParameter />
              </SourcecodeFormField>
            </SourcecodeFormSingleField>
          </CreateArticleBody>
        </CreateArticle>

        {/* 폼 하단 버튼 영역 */}
        <Footer>
          {/* 초기화 버튼 */}
          <div style={{ width: 112 }}>
            <Button width="100%" onClick={handleReset}>
              초기화
            </Button>
          </div>

          {/* 소스코드 생성 버튼 */}
          <Button
            color="primary"
            icon="Plus"
            iconPosition="left"
            iconSize={20}
            size="medium"
            variant="gradient"
            width="100%"
            onClick={handleSubmit}
          >
            소스코드 생성
          </Button>
        </Footer>
      </AsideDetailForm>

      {/* 크레덴셜 생성 모달 */}
      <CreateCredentialModal />
    </>
  );
}

/**
 * 가이드 아티클 스타일
 *
 * 소스코드 제작 가이드와 소스코드 생성 폼의 공통 스타일을 정의합니다.
 * 세로 방향으로 요소들을 배치하고 오버플로우를 처리합니다.
 */
const GuideArticle = styled.article`
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

/**
 * 소스코드 생성 아티클 스타일
 *
 * 가이드 아티클을 상속받아 상단 경계선과 여백을 추가합니다.
 * flex: 1을 사용하여 남은 공간을 모두 차지하도록 합니다.
 */
const CreateArticle = styled(GuideArticle)`
  flex: 1;
  border-top: 1px solid #e4e4e4;
  padding-top: var(--column-gutter-size);
  margin-top: var(--column-gutter-size);
`;

/**
 * 소스코드 생성 폼 스타일
 *
 * 폼 요소들을 세로 방향으로 배치하고, 스크롤이 가능하도록 설정합니다.
 * gap을 사용하여 폼 필드 간의 간격을 일정하게 유지합니다.
 */
const CreateArticleBody = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  gap: 16px;
`;

/**
 * 폼 하단 버튼 영역 스타일
 *
 * 초기화 버튼과 소스코드 생성 버튼을 좌우로 배치합니다.
 * 고정된 높이를 가지며 상단 여백을 가집니다.
 */
const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  height: 34px;
  margin-top: 20px;
`;
