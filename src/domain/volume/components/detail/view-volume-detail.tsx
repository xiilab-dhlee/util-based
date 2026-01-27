"use client";

import styled from "styled-components";

import type { VolumeDetailResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { getVolumeStorageTypeInfo } from "@/domain/volume/utils/volume.util";
import { formatDateSafely } from "@/shared/utils/date.util";
import { formatFileSize } from "@/shared/utils/file.util";
import { getVisibilityLabel } from "@/shared/utils/visibility.util";
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
  data?: VolumeDetailResponse;
  isLoading: boolean;
}

export function ViewVolumeDetail({ data, isLoading }: ViewVolumeDetailProps) {
  const { text: storageTypeText } = getVolumeStorageTypeInfo(data?.volumeType);
  const statusText = getVisibilityLabel(data?.isPublic);

  return (
    <StyledArticleBody>
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
            {storageTypeText || "-"}
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

      <AsideDetailArticleItem>
        <AsideDetailArticleRow>
          <AsideDetailArticleRowItem>
            <AsideDetailArticleHeader>
              <AsideDetailArticleTitle>설정 내용</AsideDetailArticleTitle>
            </AsideDetailArticleHeader>

            {isLoading && (
              <>
                <AsideDetailArticleColumn>
                  <AsideDetailArticleKey>Loading...</AsideDetailArticleKey>
                  <AsideDetailArticleValue>-</AsideDetailArticleValue>
                </AsideDetailArticleColumn>
                <AsideDetailArticleColumn>
                  <AsideDetailArticleKey>Loading...</AsideDetailArticleKey>
                  <AsideDetailArticleValue>-</AsideDetailArticleValue>
                </AsideDetailArticleColumn>
              </>
            )}

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
                    {data?.fileSizeByte
                      ? formatFileSize(data?.fileSizeByte).formatted
                      : "-"}
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
