"use client";

import styled from "styled-components";

import { myDropdownButtonStyle } from "@/styles/mixins/button";

export function PrivateRegistryLogButton() {
  /**
   * 파일 압축 이벤트 핸들러
   * 선택된 파일들의 경로를 추출하여 압축 이벤트를 발행합니다.
   */
  const handleClick = () => {
    alert("준비 중입니다.");
  };

  return (
    <StyledButton type="button" onClick={handleClick}>
      로그 보기
    </StyledButton>
  );
}

// 드롭다운 메뉴 아이템용 스타일된 버튼 컴포넌트
const StyledButton = styled.button`
  ${myDropdownButtonStyle}
`;
