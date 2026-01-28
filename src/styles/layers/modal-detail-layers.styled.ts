"use client";

import styled from "styled-components";
import { Typography } from "xiilab-ui";

/**
 * 모달 상세 정보 표시를 위한 공통 스타일 컴포넌트
 *
 * 사용처:
 * - view-credential-detail-modal.tsx
 * - update-workload-preset-modal.tsx
 * - view-storage-detail-modal.tsx
 * - view-account-detail-modal.tsx
 * - update-account-modal.tsx
 * - view-registry-tag-detail-modal.tsx
 * - view-image-usage-request-modal.tsx
 * - notification-detail-modal.tsx
 */

/**
 * 모달 컨텐츠를 감싸는 최상위 컨테이너
 */
export const ModalDetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

/**
 * 좌우 2열 레이아웃을 위한 컨테이너
 */
export const ModalDetailTwoColumnContainer = styled.div`
  display: flex;
  gap: 16px;
  width: 100%;
`;

/**
 * 2열 레이아웃의 각 섹션
 */
export const ModalDetailColumn = styled.div`
  flex: 1;
  min-width: 0;
`;

/**
 * 상세 정보를 담는 카드 컴포넌트
 */
export const ModalDetailCard = styled.div`
  border-radius: 2px;
  border: 1px solid #e9e9e9;
  background: #fff;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  width: 100%;
`;

/**
 * 높이를 채우는 상세 카드 (2열 레이아웃에서 사용)
 */
export const ModalDetailCardFull = styled(ModalDetailCard)`
  height: 100%;
`;

/**
 * 섹션 제목
 */
export const ModalDetailSectionTitle = styled.div`
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;
  color: #000;
`;

/**
 * 상세 정보 행 (라벨 + 값)
 */
export const ModalDetailRow = styled.div`
  display: flex;
  align-items: center;
`;

/**
 * 상세 정보 라벨
 */
interface ModalDetailLabelProps {
  $minWidth?: string;
}

export const ModalDetailLabel = styled(Typography.Text).attrs({
  variant: "body-2-2",
})<ModalDetailLabelProps>`
  color: #484848;
  min-width: ${({ $minWidth }) => $minWidth ?? "82px"};
  margin-right: 24px;
`;

/**
 * 상세 정보 값
 */
export const ModalDetailValue = styled(Typography.Text).attrs({
  variant: "subtitle-2-3",
})`
  color: #000;
  word-break: break-all;
  flex: 1;
`;

/**
 * 섹션 구분선
 */
export const ModalDetailDivider = styled.div`
  width: 100%;
  height: 1px;
  background-color: #e0e0e0;
  margin: 4px 0;
`;

/**
 * 안내 텍스트
 */
export const ModalDetailInfoText = styled(Typography.Text).attrs({
  variant: "body-3-3",
})`
  color: #666;
`;

/**
 * 줄바꿈이 가능한 긴 텍스트 값
 */
export const ModalDetailContentText = styled(Typography.Text).attrs({
  variant: "subtitle-2-3",
})`
  white-space: pre-wrap;
  word-break: break-word;
`;
