"use client";

import styled from "styled-components";

import { myDropdownButtonStyle } from "@/styles/mixins/button";

export function RegistryLogButton() {
  const handleClick = () => {
    alert("준비 중입니다.");
  };

  return (
    <StyledButton type="button" onClick={handleClick}>
      로그 보기
    </StyledButton>
  );
}

const StyledButton = styled.button`
  ${myDropdownButtonStyle}
`;
