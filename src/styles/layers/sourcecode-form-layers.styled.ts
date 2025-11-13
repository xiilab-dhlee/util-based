import styled from "styled-components";

import { requiredTextStyle } from "@/styles/mixins/text";

/**
 * 소스코드 폼 필드
 * 개별 폼 필드를 감싸는 컨테이너
 */
export const SourcecodeFormField = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow: hidden;
`;

/**
 * 소스코드 폼 단일 필드
 * 하나의 필드만 포함하는 컨테이너
 */
export const SourcecodeFormSingleField = styled.div`
  display: flex;
  flex-direction: column;
`;

/**
 * 소스코드 폼 다중 필드
 * 여러 필드를 가로로 배치하는 컨테이너
 */
export const SourcecodeFormMultiField = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
`;

/**
 * 소스코드 폼 필드 헤더
 * 필드의 라벨과 추가 컨트롤을 포함하는 헤더
 */
export const SourcecodeFormFieldHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

/**
 * 소스코드 폼 필드 라벨
 * 필드의 라벨을 표시하는 스타일
 */
export const SourcecodeFormFieldLabel = styled.label`
  font-weight: 600;
  font-size: 14px;
  line-height: 1;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 4px;

  ${requiredTextStyle}
`;

/**
 * 소스코드 폼 필드 컨트롤
 * 필드의 입력 요소들을 포함하는 컨테이너
 */
export const SourcecodeFormFieldControl = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
`;

/**
 * 툴팁 컨테이너
 * 가이드 팝오버의 내용을 담는 컨테이너
 */
export const SourcecodeFormTooltip = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 2px;
`;

/**
 * 툴팁 제목 스타일
 * 파라미터 라벨의 강조된 스타일링
 */
export const SourcecodeFormTooltipTitle = styled.span`
  font-weight: 600;
  font-size: 11px;
  line-height: 16px;
  color: #0022e0;
`;

/**
 * 툴팁 설명 스타일
 * 툴팁 제목을 상속받되 폰트 굵기와 색상을 조정
 */
export const SourcecodeFormTooltipDescription = styled(
  SourcecodeFormTooltipTitle,
)`
  font-weight: 400;
  color: #000;
`;
