"use client";

import styled from "styled-components";

import type { SourceCodeDetailResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { ReadOnlyParameter } from "@/domain/sourcecode/components/detail/read-only-parameter";
import { getSourcecodeTypeInfo } from "@/domain/sourcecode/utils/sourcecode.util";
import { CustomScrollbars } from "@/shared/components/custom-scrollbars";
import { formatDateSafely } from "@/shared/utils/date.util";
import {
  AsideDetailArticleBody,
  AsideDetailArticleColumn,
  AsideDetailArticleHeader,
  AsideDetailArticleItem,
  AsideDetailArticleKey,
  AsideDetailArticleRowItem,
  AsideDetailArticleTitle,
  AsideDetailArticleValue,
} from "@/styles/layers/aside-detail-layers.styled";

interface ViewSourcecodeDetailProps {
  data?: SourceCodeDetailResponse;
}

export function ViewSourcecodeDetail({ data }: ViewSourcecodeDetailProps) {
  const { text: typeText } = getSourcecodeTypeInfo(data?.sourceCodeType);

  return (
    <ScrollWrapper>
      <CustomScrollbars autoHide={true}>
        <StyledArticleBody>
          <AsideDetailArticleItem>
            <AsideDetailArticleHeader>
              <AsideDetailArticleTitle>기본 정보</AsideDetailArticleTitle>
            </AsideDetailArticleHeader>

            <AsideDetailArticleColumn>
              <AsideDetailArticleKey>소스코드 이름</AsideDetailArticleKey>
              <AsideDetailArticleValue>
                {data?.sourceCodeName || "-"}
              </AsideDetailArticleValue>
            </AsideDetailArticleColumn>

            <AsideDetailArticleColumn>
              <AsideDetailArticleKey>공개 설정</AsideDetailArticleKey>
              <AsideDetailArticleValue>
                {data?.isPublic === undefined
                  ? "-"
                  : data.isPublic
                    ? "공개"
                    : "비공개"}
              </AsideDetailArticleValue>
            </AsideDetailArticleColumn>

            <AsideDetailArticleColumn>
              <AsideDetailArticleKey>타입</AsideDetailArticleKey>
              <AsideDetailArticleValue>{typeText}</AsideDetailArticleValue>
            </AsideDetailArticleColumn>

            <AsideDetailArticleColumn>
              <AsideDetailArticleKey>Git URL</AsideDetailArticleKey>
              <AsideDetailArticleValue>
                {data?.gitUrl || "-"}
              </AsideDetailArticleValue>
            </AsideDetailArticleColumn>

            <AsideDetailArticleColumn>
              <AsideDetailArticleKey>Mount Path</AsideDetailArticleKey>
              <AsideDetailArticleValue>
                {data?.mountPath || "-"}
              </AsideDetailArticleValue>
            </AsideDetailArticleColumn>
          </AsideDetailArticleItem>

          {/* 설정 내용 및 생성 정보 섹션 */}
          <AsideDetailArticleItem>
            <AsideDetailArticleColumn>
              <AsideDetailArticleRowItem>
                <AsideDetailArticleHeader>
                  <AsideDetailArticleTitle>생성 정보</AsideDetailArticleTitle>
                </AsideDetailArticleHeader>

                <AsideDetailArticleColumn>
                  <AsideDetailArticleKey>생성자</AsideDetailArticleKey>
                  <AsideDetailArticleValue>
                    {data?.creatorName || "-"}
                  </AsideDetailArticleValue>
                </AsideDetailArticleColumn>

                <AsideDetailArticleColumn>
                  <AsideDetailArticleKey>생성일</AsideDetailArticleKey>
                  <AsideDetailArticleValue>
                    {formatDateSafely(data?.createdAt)}
                  </AsideDetailArticleValue>
                </AsideDetailArticleColumn>
              </AsideDetailArticleRowItem>
            </AsideDetailArticleColumn>
          </AsideDetailArticleItem>
        </StyledArticleBody>
        <StyledArticleBody>
          <AsideDetailArticleItem>
            <AsideDetailArticleHeader>
              <AsideDetailArticleTitle>설정 내용</AsideDetailArticleTitle>
            </AsideDetailArticleHeader>

            <AsideDetailArticleColumn>
              <AsideDetailArticleKey>크리덴셜</AsideDetailArticleKey>
              <AsideDetailArticleValue>
                {data?.credentialName || "-"}
              </AsideDetailArticleValue>
            </AsideDetailArticleColumn>

            <AsideDetailArticleColumn>
              <AsideDetailArticleKey>실행 명령어</AsideDetailArticleKey>
              <AsideDetailArticleValue>
                {data?.executionCmd || "-"}
              </AsideDetailArticleValue>
            </AsideDetailArticleColumn>

            <AsideDetailArticleColumn>
              <AsideDetailArticleKey>파라미터</AsideDetailArticleKey>
            </AsideDetailArticleColumn>
            <AsideDetailArticleColumn>
              <ReadOnlyParameter
                parameters={Object.entries(data?.parameter || {}).map(
                  ([key, value]) => ({ key, value }),
                )}
              />
            </AsideDetailArticleColumn>
          </AsideDetailArticleItem>
        </StyledArticleBody>
      </CustomScrollbars>
    </ScrollWrapper>
  );
}

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

  &:last-child {
    margin-bottom: 15px;
  }
`;
