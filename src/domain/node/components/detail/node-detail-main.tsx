"use client";

import { useParams } from "next/navigation";
import styled from "styled-components";

import { useGetNodeDetail } from "@/api/generated/admin-cluster/admin-cluster";
import { NodeDetailPageAside } from "@/domain/node/components/detail/node-detail-page-aside";
import { NodePrimaryPane } from "@/domain/node/components/detail/node-primary-pane";
import { NodeSecondaryPane } from "@/domain/node/components/detail/node-secondary-pane";
import { EmptyState } from "@/shared/components/empty-state/empty-state";
import { PageHeader } from "@/shared/components/layouts/page-header";
import { MySpinner } from "@/shared/components/spinner";
import {
  DetailContentSection,
  DetailPageBody,
  DetailPageContent,
} from "@/styles/layers/detail-page-layers.styled";

/**
 * NodeDetailMain 컴포넌트
 *
 * 노드 상세 페이지의 메인 레이아웃을 구성하는 컴포넌트입니다.
 * 페이지 헤더, 사이드바, 노드 기본 정보(PrimaryPane), 상세 정보(SecondaryPane)를
 * 통합하여 노드의 전체 정보를 한눈에 볼 수 있도록 합니다.
 *
 * @returns 노드 상세 페이지의 메인 레이아웃 컴포넌트
 */
export function NodeDetailMain() {
  // URL 파라미터에서 노드 이름 추출
  const { name } = useParams();
  const nodeName = String(name);

  // 노드 상세 정보 조회
  const { data, isLoading, isError } = useGetNodeDetail(nodeName);

  /**
   * 콘텐츠 영역 렌더링
   */
  const renderContent = () => {
    // 로딩 상태
    if (isLoading) {
      return (
        <LoadingContainer>
          <MySpinner />
        </LoadingContainer>
      );
    }

    // 에러 상태
    if (isError) {
      return (
        <ErrorContainer>
          <EmptyState
            title="노드 정보를 불러올 수 없습니다"
            content="잠시 후 다시 시도해 주세요."
          />
        </ErrorContainer>
      );
    }

    // 데이터가 없는 경우
    if (!data) {
      return (
        <ErrorContainer>
          <EmptyState title="노드 정보가 없습니다" />
        </ErrorContainer>
      );
    }

    return (
      <ContentContainer>
        {/* 노드의 기본 정보를 표시하는 영역 */}
        <NodePrimaryPane data={data} />
        {/* 노드의 상세 정보를 표시하는 영역 */}
        <NodeSecondaryPane data={data} />
      </ContentContainer>
    );
  };

  return (
    <>
      {/* 페이지 요약 정보 및 브레드크럼 네비게이션 */}
      <PageHeader
        pageKey="admin.node.detail"
        pageParams={{ name: nodeName }}
        description="Node resource details · Resource information"
      />

      {/* 상세 페이지 메인 콘텐츠 영역 */}
      <DetailPageBody>
        {/* 왼쪽 사이드바 영역 - 노드 요약 정보 */}
        <NodeDetailPageAside
          data={data}
          isLoading={isLoading}
          isError={isError}
        />
        {/* 오른쪽 메인 콘텐츠 영역 */}
        <DetailPageContent>
          {/* 콘텐츠 영역 */}
          <DetailContentSection>{renderContent()}</DetailContentSection>
        </DetailPageContent>
      </DetailPageBody>
    </>
  );
}

const ContentContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  height: 100%;
`;

const LoadingContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const ErrorContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;
