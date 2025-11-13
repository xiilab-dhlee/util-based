"use client";
import { Input } from "antd";
import styled from "styled-components";

export const MyInput = () => (
  <StyledInput placeholder="워크로드 이름을 검색해 주세요." />
);


const StyledInput = styled(Input.Search)`
  border-radius: 4px;
`;
