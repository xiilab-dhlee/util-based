import styled from "styled-components";

export const CompactCardKeyValueRow = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  overflow: hidden;
`;

export const CollapseMessage = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

export const CompactCardKey = styled.div`
  font-weight: 500;
  font-size: 12px;
  color: #191b26;
  line-height: 16px;
`;

export const CompactCardValue = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: #191b26;
  flex: 1;
  text-indent: 5px;
  overflow: hidden;
`;
