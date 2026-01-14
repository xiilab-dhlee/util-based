import styled from "styled-components";

export const TwoColumnLayout = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  width: 100%;
  height: 100%;
`;

export const LeftColumn = styled.div`
  width: 275px;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
`;

export const RightColumn = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow: hidden;
`;

export const SectionHeader = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #000;
  margin-bottom: 4px;
`;
