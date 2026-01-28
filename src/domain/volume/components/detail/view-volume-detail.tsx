"use client";

import { useState } from "react";
import styled from "styled-components";
import { Card } from "xiilab-ui";

import type { VolumeDetailResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { useGetVolumeWorkloads } from "@/api/generated/volume/volume";
import { getVolumeStorageTypeInfo } from "@/domain/volume/utils/volume.util";
import { CustomScrollbars } from "@/shared/components/custom-scrollbars";
import { EmptyState } from "@/shared/components/empty-state/empty-state";
import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";
import { TABLE_MESSAGE } from "@/shared/constants/core.constant";
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
import { VolumeWorkloadCard } from "./volme-workload-card";

interface ViewVolumeDetailProps {
  data?: VolumeDetailResponse;
  isLoading: boolean;
}

const PAGE_SIZE = 10;

export function ViewVolumeDetail({ data, isLoading }: ViewVolumeDetailProps) {
  const [page, setPage] = useState(0);
  const { text: storageTypeText } = getVolumeStorageTypeInfo(data?.volumeType);
  const statusText = getVisibilityLabel(data?.isPublic);

  const {
    data: workloadData,
    isLoading: isWorkloadLoading,
    isError: isWorkloadError,
  } = useGetVolumeWorkloads(
    data?.volumeId ?? 0,
    { pageNo: page, pageSize: PAGE_SIZE },
    { query: { enabled: !!data?.volumeId } },
  );

  const workloads = workloadData?.content ?? [];
  const totalSize = workloadData?.totalSize ?? 0;

  const renderWorkloadList = () => {
    if (isWorkloadLoading) {
      return Array.from({ length: PAGE_SIZE }).map((_, index) => (
        <Card key={`skeleton-${index}`} loading style={{ height: 66 }} />
      ));
    }

    if (isWorkloadError) {
      return (
        <EmptyStateWrapper>
          <EmptyState title={TABLE_MESSAGE.ERROR} />
        </EmptyStateWrapper>
      );
    }

    if (workloads.length === 0) {
      return (
        <EmptyStateWrapper>
          <EmptyState title="사용 중인 워크로드가 없습니다." />
        </EmptyStateWrapper>
      );
    }

    return workloads.map((workload) => (
      <VolumeWorkloadCard key={workload.workloadId} data={workload} />
    ));
  };

  return (
    <ScrollWrapper>
      <CustomScrollbars autoHide={true}>
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
        <StyledArticleBody>
          <AsideDetailArticleItem>
            <AsideDetailArticleHeader>
              <AsideDetailArticleTitle>
                사용중인 워크로드
              </AsideDetailArticleTitle>
            </AsideDetailArticleHeader>
          </AsideDetailArticleItem>
          <WorkloadList>{renderWorkloadList()}</WorkloadList>
          <ListPageFooter
            total={totalSize}
            page={page}
            pageSize={PAGE_SIZE}
            onChange={setPage}
          />
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
  flex: 1;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background-color: #fcfcfc;

  & + & {
    margin-top: 10px;
  }
`;

const WorkloadList = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  width: 100%;
  gap: 12px;
`;

const EmptyStateWrapper = styled.div`
  grid-column: 1 / -1;
`;
