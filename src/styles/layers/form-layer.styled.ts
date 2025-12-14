import styled from "styled-components";

/**
 * 폼 아이템 컨테이너 스타일
 *
 * 폼 아이템을 세로 방향으로 배치하며, 각 아이템 간 간격과 패딩을 제공합니다.
 *
 * 스타일 특징:
 * - 세로 방향 레이아웃으로 라벨과 입력 필드 구성
 * - 아이템 간 적절한 간격 제공
 * - 마지막 아이템의 경우 하단 패딩 제거
 */
export const FormItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-bottom: 12px;
  flex: 1;

  &.last {
    padding-bottom: 0;
  }
`;

/**
 * 폼 로우 컨테이너 스타일
 *
 * 여러 폼 아이템을 가로로 배치할 때 사용합니다.
 *
 * 스타일 특징:
 * - 가로 방향 레이아웃으로 여러 입력 필드를 나란히 배치
 * - 아이템 간 적절한 간격 제공
 * - 넘치는 내용은 숨김 처리
 */
export const FormRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  overflow: hidden;
  width: 100%;
`;

/**
 * 폼 섹션 컨테이너 스타일
 *
 * 폼의 각 섹션을 감싸는 카드 형태의 컨테이너입니다.
 * 생성/수정 폼에서 섹션을 구분하는 용도로 사용됩니다.
 *
 * 스타일 특징:
 * - 밝은 회색 배경과 테두리로 구분
 * - 둥근 모서리와 내부 패딩 제공
 * - 세로 방향 레이아웃
 */
export const FormSectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #fcfcfc;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 20px;
`;

/**
 * 폼 섹션 헤더 스타일
 *
 * 섹션의 제목 영역을 감싸는 컨테이너입니다.
 *
 * 스타일 특징:
 * - 하단 마진으로 본문과 구분
 */
export const FormSectionHeader = styled.div`
  margin-bottom: 14px;
`;
