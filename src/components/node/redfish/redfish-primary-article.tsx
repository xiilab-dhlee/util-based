"use client";

import { useParams } from "next/navigation";
import styled from "styled-components";

import {
  DetailContentArticle,
  DetailContentHeader,
  DetailContentTitle,
} from "@/styles/layers/detail-page-layers.styled";

/**
 * Redfish 관련 페이지의 기본 헤더 아티클 컴포넌트
 *
 * 페이지 제목과 노드 이름, 설명을 표시하는 공통 헤더 컴포넌트입니다.
 * URL 파라미터에서 노드 이름을 자동으로 추출하여 표시합니다.
 *
 * @param title - 페이지 제목
 * @param description - 페이지 설명
 */
interface RedfishPrimaryArticleProps {
  title: string;
  description: string;
}

export function RedfishPrimaryArticle({
  title,
  description,
}: RedfishPrimaryArticleProps) {
  // URL 파라미터에서 노드 이름 추출
  const { name } = useParams();

  return (
    <>
      {/* 페이지 제목 헤더 */}
      <DetailContentHeader>
        <DetailContentTitle>{title}</DetailContentTitle>
      </DetailContentHeader>

      {/* 노드 이름과 설명 */}
      <PrimaryArticle>
        <NodeName>{name}</NodeName>
        <Description>{description}</Description>
      </PrimaryArticle>
    </>
  );
}


// ===== Styled Components =====

/** 헤더 컨테이너 - 노드 이름과 설명을 표시 */
const PrimaryArticle = styled(DetailContentArticle)`
  height: 84px;
  flex: none;
  flex-direction: column;
  padding: 22px 20px;
`;

/** 노드 이름 텍스트 */
const NodeName = styled.div`
  font-weight: 700;
  font-size: 16px;
  line-height: 16px;
  color: #000;
`;

/** 헤더 설명 텍스트 */
const Description = styled.div`
  font-weight: 400;
  font-size: 13px;
  line-height: 100%;
  color: #000;
`;
