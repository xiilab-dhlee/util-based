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
`;
