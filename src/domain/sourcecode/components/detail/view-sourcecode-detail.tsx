"use client";

import styled from "styled-components";
import { Tag, Typography } from "xiilab-ui";

import type { SourceCodeListResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { getSourcecodeTypeInfo } from "@/domain/sourcecode/utils/sourcecode.util";
import { CustomScrollbars } from "@/shared/components/custom-scrollbars";
import { formatDateSafely } from "@/shared/utils/date.util";
import {
  AsideDetailArticle,
  AsideDetailArticleBody,
  AsideDetailArticleColumn,
  AsideDetailArticleHeader,
  AsideDetailArticleItem,
  AsideDetailArticleKey,
  AsideDetailArticleTitle,
  AsideDetailArticleValue,
  AsideDetailScrollWrapper,
} from "@/styles/layers/aside-detail-layers.styled";

interface ViewSourcecodeDetailProps {
  data: SourceCodeListResponse | undefined;
  isLoading: boolean;
}

export function ViewSourcecodeDetail({
  data,
  isLoading,
}: ViewSourcecodeDetailProps) {
  if (isLoading) {
    return (
      <AsideDetailScrollWrapper>
        <CustomScrollbars>
          <AsideDetailArticle>
            <AsideDetailArticleBody>
              <AsideDetailArticleItem>
                <Typography.Text variant="body-2-3" color="#777">
                  로딩 중...
                </Typography.Text>
              </AsideDetailArticleItem>
            </AsideDetailArticleBody>
          </AsideDetailArticle>
        </CustomScrollbars>
      </AsideDetailScrollWrapper>
    );
  }

  const { text: typeText, tag: typeTag } = getSourcecodeTypeInfo(
    data?.sourceCodeType,
  );

  return (
    <AsideDetailScrollWrapper>
      <CustomScrollbars>
        <AsideDetailArticle>
          <AsideDetailArticleBody>
            {/* 소스코드 정보 섹션 */}
            <AsideDetailArticleItem>
              <AsideDetailArticleHeader>
                <AsideDetailArticleTitle>소스코드 정보</AsideDetailArticleTitle>
              </AsideDetailArticleHeader>

              {/* 소스코드 이름 */}
              <AsideDetailArticleColumn>
                <AsideDetailArticleKey>소스코드 이름</AsideDetailArticleKey>
                <AsideDetailArticleValue>
                  {data?.sourceCodeName || "-"}
                </AsideDetailArticleValue>
              </AsideDetailArticleColumn>

              {/* 공개 설정 */}
              <AsideDetailArticleColumn>
                <AsideDetailArticleKey>공개 설정</AsideDetailArticleKey>
                <AsideDetailArticleValue>
                  {data?.isPublic ? "공개" : "비공개"}
                </AsideDetailArticleValue>
              </AsideDetailArticleColumn>

              {/* 소스코드 타입 */}
              <AsideDetailArticleColumn>
                <AsideDetailArticleKey>타입</AsideDetailArticleKey>
                <AsideDetailArticleValue>
                  <Tag variant={typeTag} theme="light">
                    {typeText}
                  </Tag>
                </AsideDetailArticleValue>
              </AsideDetailArticleColumn>

              {/* 소스코드 URL */}
              <AsideDetailArticleColumn>
                <AsideDetailArticleKey>Git URL</AsideDetailArticleKey>
                <AsideDetailArticleValue className="truncate">
                  {data?.gitUrl || "-"}
                </AsideDetailArticleValue>
              </AsideDetailArticleColumn>

              {/* 마운트 경로 */}
              <AsideDetailArticleColumn>
                <AsideDetailArticleKey>마운트 경로</AsideDetailArticleKey>
                <AsideDetailArticleValue className="truncate">
                  {data?.mountPath || "-"}
                </AsideDetailArticleValue>
              </AsideDetailArticleColumn>
            </AsideDetailArticleItem>

            {/* 설정 내용 섹션 */}
            <SecondaryArticleItem>
              <AsideDetailArticleHeader>
                <AsideDetailArticleTitle>설정 내용</AsideDetailArticleTitle>
              </AsideDetailArticleHeader>

              {/* 실행 명령어 */}
              <AsideDetailArticleColumn>
                <AsideDetailArticleKey>실행 명령어</AsideDetailArticleKey>
                <AsideDetailArticleValue>
                  {data?.executionCmd || "-"}
                </AsideDetailArticleValue>
              </AsideDetailArticleColumn>

              {/* 생성일 */}
              <AsideDetailArticleColumn>
                <AsideDetailArticleKey>생성일</AsideDetailArticleKey>
                <AsideDetailArticleValue>
                  {formatDateSafely(data?.createdAt)}
                </AsideDetailArticleValue>
              </AsideDetailArticleColumn>
            </SecondaryArticleItem>
          </AsideDetailArticleBody>
        </AsideDetailArticle>
      </CustomScrollbars>
    </AsideDetailScrollWrapper>
  );
}

const SecondaryArticleItem = styled(AsideDetailArticleItem)`
  margin-top: 10px;
`;
