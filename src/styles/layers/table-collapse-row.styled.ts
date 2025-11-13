import styled from "styled-components";

export const TableCollapseRowContainer = styled.div`
  background-color: #f3f5f6;
  padding: 20px;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
  box-sizing: border-box;
`;

export const TableCollapseRowHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

export const TableCollapseRowHeaderTitle = styled.div`
  font-weight: 600;
  font-size: 12px;
  line-height: 14px;
`;

export const TableCollapseRowBody = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 100%;
  overflow: hidden;
`;

export const TableCollapseRowFooter = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-top: 26px;
`;

export const TableCollapseRowRecord = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-items: center;
  padding: 5px 0;
`;

export const TableCollapseRowKeyValueContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 14px;

  & + & {
    padding-left: 20px;
    margin-left: 20px;
    border-left: 0.5px solid #bac0c6;
  }
`;

export const TableCollapseRowRecordKey = styled.div`
  font-weight: 600;
  font-size: 12px;
  line-height: 14px;
  color: #484848;
  white-space: nowrap;
`;

export const TableCollapseRowRecordValue = styled.div`
  width: 100%;
  font-weight: 400;
  font-size: 13px;
  line-height: 16px;
  color: #44464c;
  text-align: right;
`;
