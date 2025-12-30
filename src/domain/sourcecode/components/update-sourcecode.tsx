"use client";

import { format } from "date-fns";
import { useRef, useState } from "react";
import styled from "styled-components";
import { Button, Dropdown, Input } from "xiilab-ui";

import { ManageCredential } from "@/domain/sourcecode/components/manage-credential";
import { ManageParameter } from "@/domain/sourcecode/components/manage-parameter";
import { useGetSourcecode } from "@/domain/sourcecode/hooks/use-get-sourcecode";
import { useUpdateSourcecode } from "@/domain/sourcecode/hooks/use-update-sourcecode";
import type { UpdateSourcecodePayload } from "@/domain/sourcecode/types/sourcecode.type";
import {
  getSourcecodeStatusInfo,
  getSourcecodeTypeInfo,
} from "@/domain/sourcecode/utils/sourcecode.util";
import { CustomScrollbars } from "@/shared/components/custom-scrollbars";
import { VISIBILITY_STATUS_OPTIONS } from "@/shared/constants/core.constant";
import { SOURCECODE_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
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
  AsideDetailForm,
  AsideDetailHeader,
  AsideDetailHeaderTitle,
  AsideDetailScrollWrapper,
} from "@/styles/layers/aside-detail-layers.styled";
import { SourcecodeFormFieldControl } from "@/styles/layers/sourcecode-form-layers.styled";
import { ReadOnlyParameter } from "./read-only-parameter";

interface UpdateSourcecodeProps {
  id: number;
}

/**
 * 소스코드 수정 컴포넌트
 *
 * 기존 소스코드의 상세 정보를 조회하고 수정할 수 있는 컴포넌트입니다.
 * 읽기 전용 모드와 수정 모드를 전환할 수 있으며, 소스코드 정보, 설정 내용 등을 관리합니다.
 *
 * 주요 기능:
 * - 소스코드 상세 정보 조회 (읽기 전용)
 * - 소스코드 정보 수정 (수정 모드)
 * - 크레덴셜 관리 및 파라미터 설정
 * - 소스코드 삭제 (PubSub을 통한 모달 열기)
 * - 읽기 전용/수정 모드 전환
 *
 * @param id - 소스코드 ID
 * @returns 소스코드 수정 UI를 포함한 JSX 요소
 */
export function UpdateSourcecode({ id }: UpdateSourcecodeProps) {
  const formRef = useRef<HTMLFormElement>(null);

  // PubSub 퍼블리셔 - 이벤트 발행을 위한 훅
  const publish = usePublish();

  const { data } = useGetSourcecode(id);

  // 소스코드 수정 뮤테이션 훅
  const updateSourcecode = useUpdateSourcecode();

  // 읽기 전용 여부 - true: 읽기 전용 모드, false: 수정 모드
  const [isReadOnly, setIsReadOnly] = useState(true);
  const status = useSelect(data?.status || "PUBLIC", VISIBILITY_STATUS_OPTIONS);

  const { text } = getSourcecodeTypeInfo(data?.type || "GIT_HUB");
  const { text: statusText } = getSourcecodeStatusInfo(
    data?.status || "PUBLIC",
  );
  /**
   * 수정 모드 전환 핸들러
   *
   * 읽기 전용 모드에서 수정 모드로 전환합니다.
   * 수정 모드에서는 입력 필드가 활성화되고 수정이 가능해집니다.
   */
  const handleModify = () => {
    if (isReadOnly) {
      setIsReadOnly(false);
    } else {
      // TODO: 수정 로직 추가
      const payload = createPayload();

      if (payload) {
        // TODO: validation 추가 필요
        updateSourcecode.mutate(payload);
      }
    }
  };

  /**
   * 소스코드 삭제 핸들러
   *
   * PubSub을 통해 삭제 모달을 열도록 이벤트를 발행합니다.
   * 현재 라우터의 쿼리에서 소스코드 ID를 가져와 삭제 대상으로 전달합니다.
   */
  const handleDelete = () => {
    // 소스코드 삭제 모달에 데이터 전달
    publish(SOURCECODE_EVENTS.sendDeleteSourcecode, [id]);
  };

  /**
   * 수정 취소 핸들러
   *
   * 수정 모드에서 읽기 전용 모드로 되돌립니다.
   * 사용자가 수정을 취소하고 원래 상태로 복원할 때 사용됩니다.
   */
  const handleCancel = () => {
    setIsReadOnly(true);
  };

  /**
   * 폼 데이터를 수집하여 API 요청용 페이로드 생성
   *
   * 폼의 모든 입력 필드에서 데이터를 수집하고, UpdateSourcecodePayload 형태로 변환합니다.
   * 파라미터는 동적으로 추가되는 구조이므로 인덱스 기반으로 순차적으로 수집합니다.
   *
   * @returns UpdateSourcecodePayload 객체 또는 null (폼 참조가 없는 경우)
   */
  const createPayload = (): UpdateSourcecodePayload | null => {
    if (!formRef.current) return null;

    // 폼 데이터 수집
    const formData = new FormData(formRef.current);

    // 기본 필드들 수집
    const path = formData.get("path") as string;

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
      path,
      // 키나 값이 모두 비어있는 파라미터는 필터링하여 제거
      parameters: parameters.filter((p) => p.key || p.value),
    };
  };

  return (
    <AsideDetailForm ref={formRef}>
      {/* 드로어 헤더 - 제목과 닫기 버튼 */}
      <AsideDetailHeader>
        <AsideDetailHeaderTitle>상세 정보</AsideDetailHeaderTitle>
        {isReadOnly && (
          <Icons>
            <Button
              type="button"
              onClick={handleModify}
              icon="Edit02"
              iconSize={20}
              aria-label="소스코드 수정"
            />
            <Button
              type="button"
              onClick={handleDelete}
              icon="Delete"
              iconSize={20}
              aria-label="소스코드 삭제"
            />
          </Icons>
        )}
      </AsideDetailHeader>

      {/* 스크롤 영역 */}
      <AsideDetailScrollWrapper>
        <CustomScrollbars>
          {/* 첫 번째 아티클 - 소스코드 기본 정보 */}
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
                  {isReadOnly && (
                    <AsideDetailArticleValue>
                      {data?.name}
                    </AsideDetailArticleValue>
                  )}
                </AsideDetailArticleColumn>
                {/* 수정 모드일 때만 마운트 경로 입력 필드 표시 */}
                {!isReadOnly && (
                  <div style={{ marginTop: 8, marginBottom: 16 }}>
                    <Input
                      placeholder="소스코드 이름을 입력해주세요."
                      width="100%"
                      name="name"
                      autoComplete="off"
                      defaultValue={data?.name || ""}
                    />
                  </div>
                )}

                {/* 공개 설정 */}
                <AsideDetailArticleColumn>
                  <AsideDetailArticleKey>공개 설정</AsideDetailArticleKey>
                  {isReadOnly && (
                    <AsideDetailArticleValue>
                      {statusText}
                    </AsideDetailArticleValue>
                  )}
                </AsideDetailArticleColumn>
                {!isReadOnly && (
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
                )}

                {/* 소스코드 타입 */}
                <AsideDetailArticleColumn>
                  <AsideDetailArticleKey>타입</AsideDetailArticleKey>
                  <AsideDetailArticleValue>{text}</AsideDetailArticleValue>
                </AsideDetailArticleColumn>

                {/* 소스코드 URL */}
                <AsideDetailArticleColumn>
                  <AsideDetailArticleKey>Git URL</AsideDetailArticleKey>
                  <AsideDetailArticleValue>{data?.url}</AsideDetailArticleValue>
                </AsideDetailArticleColumn>

                {/* 마운트 경로 */}
                <AsideDetailArticleColumn>
                  <AsideDetailArticleKey>마운트 경로</AsideDetailArticleKey>
                  {/* 읽기 전용 모드일 때만 표시 */}
                  {isReadOnly && (
                    <AsideDetailArticleValue className="truncate">
                      {data?.path || "-"}
                    </AsideDetailArticleValue>
                  )}
                </AsideDetailArticleColumn>

                {/* 수정 모드일 때만 마운트 경로 입력 필드 표시 */}
                {!isReadOnly && (
                  <div style={{ marginTop: 8 }}>
                    <Input
                      placeholder="기본 마운트 경로를 입력해주세요."
                      width="100%"
                      name="path"
                      autoComplete="off"
                      defaultValue={data?.path || ""}
                    />
                  </div>
                )}
              </AsideDetailArticleItem>

              {/* 생성자 정보 섹션 */}
              <AsideDetailArticleItem>
                <AsideDetailArticleHeader>
                  <AsideDetailArticleTitle>생성 정보</AsideDetailArticleTitle>
                </AsideDetailArticleHeader>

                {/* 생성자 */}
                <AsideDetailArticleColumn>
                  <AsideDetailArticleKey>생성자</AsideDetailArticleKey>
                  <AsideDetailArticleValue>
                    {data?.creatorName}
                  </AsideDetailArticleValue>
                </AsideDetailArticleColumn>

                {/* 생성일 */}
                <AsideDetailArticleColumn>
                  <AsideDetailArticleKey>생성일</AsideDetailArticleKey>
                  <AsideDetailArticleValue>
                    {data?.creatorDate &&
                      format(data?.creatorDate, "yyyy.MM.dd")}
                  </AsideDetailArticleValue>
                </AsideDetailArticleColumn>
              </AsideDetailArticleItem>
            </AsideDetailArticleBody>
          </AsideDetailArticle>

          {/* 두 번째 아티클 - 설정 내용 */}
          <SecondaryArticle>
            <AsideDetailArticleBody>
              <AsideDetailArticleItem>
                <AsideDetailArticleHeader>
                  <AsideDetailArticleTitle>설정 내용</AsideDetailArticleTitle>
                </AsideDetailArticleHeader>

                {/* 크레덴셜 정보 */}
                <AsideDetailArticleColumn>
                  <AsideDetailArticleKey>크레덴셜</AsideDetailArticleKey>
                  {/* 읽기 전용 모드일 때만 표시 */}
                  {isReadOnly && (
                    <AsideDetailArticleValue>
                      {data?.credential?.name || "-"}
                    </AsideDetailArticleValue>
                  )}
                </AsideDetailArticleColumn>

                {/* 수정 모드일 때만 크레덴셜 관리 컴포넌트 표시 */}
                {!isReadOnly && (
                  <ManageCredentialWrapper>
                    <ManageCredential defaultCredential={data?.credential} />
                  </ManageCredentialWrapper>
                )}

                {/* 실행 명령어 */}
                <AsideDetailArticleColumn>
                  <AsideDetailArticleKey>실행 명령어</AsideDetailArticleKey>
                  {isReadOnly && (
                    <AsideDetailArticleValue>
                      {data?.cmd}
                    </AsideDetailArticleValue>
                  )}
                </AsideDetailArticleColumn>
                {!isReadOnly && (
                  <div style={{ marginTop: 8, marginBottom: 16 }}>
                    <Input
                      placeholder="실행 명령어를 입력해주세요."
                      width="100%"
                      name="cmd"
                      autoComplete="off"
                      defaultValue={data?.cmd || ""}
                    />
                  </div>
                )}

                {/* 파라미터 섹션 */}
                <AsideDetailArticleColumn>
                  <AsideDetailArticleKey>파라미터</AsideDetailArticleKey>
                </AsideDetailArticleColumn>

                {/* 파라미터 표시/관리 컴포넌트 */}
                <div style={{ marginTop: 8 }}>
                  {isReadOnly ? (
                    // 읽기 전용 모드: 파라미터를 읽기 전용으로 표시
                    <ReadOnlyParameter parameters={data?.parameters || []} />
                  ) : (
                    // 수정 모드: 파라미터를 수정 가능한 형태로 표시
                    <ManageParameter
                      defaultParameters={data?.parameters || []}
                    />
                  )}
                </div>
              </AsideDetailArticleItem>
            </AsideDetailArticleBody>
          </SecondaryArticle>
        </CustomScrollbars>
      </AsideDetailScrollWrapper>

      {/* 하단 버튼 영역 */}
      {!isReadOnly && (
        <AsideDetailFooter>
          {/* 좌측 버튼 - 읽기 전용/수정 모드에 따라 다르게 표시 */}
          <Button width={112} variant="outlined" onClick={handleCancel}>
            취소
          </Button>

          {/* 우측 버튼 - 읽기 전용/수정 모드에 따라 다르게 표시 */}
          <Button
            color="primary"
            icon="Check"
            iconPosition="left"
            iconSize={20}
            size="medium"
            variant="gradient"
            width="100%"
            onClick={handleModify}
          >
            상세 정보 저장
          </Button>
        </AsideDetailFooter>
      )}
    </AsideDetailForm>
  );
}

/**
 * 두 번째 아티클 스타일
 *
 * 첫 번째 아티클을 상속받아 설정 내용을 표시하는 섹션의 스타일을 정의합니다.
 * 상단 여백을 통해 첫 번째 아티클과 구분합니다.
 */
const SecondaryArticle = styled(AsideDetailArticle)`
  margin-top: 10px;
`;

/**
 * 크레덴셜 관리 래퍼 스타일
 *
 * 수정 모드에서 크레덴셜 관리 컴포넌트를 감싸는 컨테이너의 스타일을 정의합니다.
 * 상하 여백과 간격을 설정하여 적절한 레이아웃을 제공합니다.
 */
const ManageCredentialWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 8px;
  margin-bottom: 14px;
`;

const Icons = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
`;
