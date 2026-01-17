"use client";

import { format } from "date-fns";
import styled from "styled-components";

import type { VolumeDetailResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  getVolumeStatusInfo,
  getVolumeStorageTypeInfo,
} from "@/domain/volume/utils/volume.util";
import { formatFileSize } from "@/shared/utils/file.util";
import {
  AsideDetailArticleBody,
  AsideDetailArticleColumn,
  AsideDetailArticleHeader,
  AsideDetailArticleItem,
  AsideDetailArticleKey,
  AsideDetailArticleRow,
  AsideDetailArticleRowItem,
  AsideDetailArticleTitle,
  AsideDetailArticleValue,
} from "@/styles/layers/aside-detail-layers.styled";

interface ViewVolumeDetailProps {
  data: VolumeDetailResponse | undefined;
}

/**
 * 볼륨 상세 정보 읽기 전용 컴포넌트
 *
 * 볼륨의 기본 정보, 설정 내용, 생성 정보를 표시합니다.
 */
export function ViewVolumeDetail({ data }: ViewVolumeDetailProps) {
  const { text: storageTypeText } = getVolumeStorageTypeInfo(data?.volumeType);
  const { text: statusText } = getVolumeStatusInfo(data?.isPublic ?? false);

  return (
    <StyledArticleBody>
      {/* 기본 정보 섹션 */}
      <AsideDetailArticleItem>
        <AsideDetailArticleHeader>
          <AsideDetailArticleTitle>기본 정보</AsideDetailArticleTitle>
        </AsideDetailArticleHeader>

        <AsideDetailArticleColumn>
          <AsideDetailArticleKey>볼륨 이름</AsideDetailArticleKey>
          <AsideDetailArticleValue className="truncate">
            {data?.volumeName || "-"}
          </AsideDetailArticleValue>
        </AsideDetailArticleColumn>

        <AsideDetailArticleColumn>
          <AsideDetailArticleKey>스토리지 타입</AsideDetailArticleKey>
          <AsideDetailArticleValue className="truncate">
            {storageTypeText}
          </AsideDetailArticleValue>
        </AsideDetailArticleColumn>

        <AsideDetailArticleColumn>
          <AsideDetailArticleKey>공개 설정</AsideDetailArticleKey>
          <AsideDetailArticleValue>{statusText}</AsideDetailArticleValue>
        </AsideDetailArticleColumn>

        <AsideDetailArticleColumn>
          <AsideDetailArticleKey>Mount Path</AsideDetailArticleKey>
          <AsideDetailArticleValue className="truncate">
            {data?.mountPath || "-"}
          </AsideDetailArticleValue>
        </AsideDetailArticleColumn>
      </AsideDetailArticleItem>

      {/* 설정 내용 및 생성 정보 섹션 */}
      <AsideDetailArticleItem>
        <AsideDetailArticleRow>
          {/* 설정 내용 */}
          <AsideDetailArticleRowItem>
            <AsideDetailArticleHeader>
              <AsideDetailArticleTitle>설정 내용</AsideDetailArticleTitle>
            </AsideDetailArticleHeader>

            {data?.volumeType === "ASTRAGO" && (
              <>
                <AsideDetailArticleColumn>
                  <AsideDetailArticleKey>스토리지</AsideDetailArticleKey>
                  <AsideDetailArticleValue>
                    {data?.storageName || "-"}
                  </AsideDetailArticleValue>
                </AsideDetailArticleColumn>
                <AsideDetailArticleColumn>
                  <AsideDetailArticleKey>파일 용량</AsideDetailArticleKey>
                  <AsideDetailArticleValue>
                    {formatFileSize(data?.fileSizeByte ?? 0).formatted}
                  </AsideDetailArticleValue>
                </AsideDetailArticleColumn>
              </>
            )}

            {data?.volumeType === "ON_PREMISE" && (
              <>
                <AsideDetailArticleColumn>
                  <AsideDetailArticleKey>Server IP</AsideDetailArticleKey>
                  <AsideDetailArticleValue>
                    {data?.serverIp || "-"}
                  </AsideDetailArticleValue>
                </AsideDetailArticleColumn>
                <AsideDetailArticleColumn>
                  <AsideDetailArticleKey>Server Path</AsideDetailArticleKey>
                  <AsideDetailArticleValue>
                    {data?.volumePath || "-"}
                  </AsideDetailArticleValue>
                </AsideDetailArticleColumn>
              </>
            )}
          </AsideDetailArticleRowItem>

          {/* 생성 정보 */}
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
                {data?.createdAt ? format(data.createdAt, "yyyy.MM.dd") : "-"}
              </AsideDetailArticleValue>
            </AsideDetailArticleColumn>
          </AsideDetailArticleRowItem>
        </AsideDetailArticleRow>
      </AsideDetailArticleItem>
    </StyledArticleBody>
  );
}

const StyledArticleBody = styled(AsideDetailArticleBody)`
  flex: 1;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background-color: #fcfcfc;
`;
