import styled from "styled-components";

/** 드롭다운 옵션 공통 컨테이너 */
export const DropdownOptionContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0;
`;

/** 드롭다운 정보 박스 (우측 정보 영역) */
export const DropdownInfoBox = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  background-color: #fafafa;
  border: 1px solid #c1c7ce;
  border-radius: 2px;
`;

/** 드롭다운 정보 아이템 (label + value 묶음) */
export const DropdownInfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
`;

/** 드롭다운 정보 라벨 (진한 텍스트) */
export const DropdownInfoLabel = styled.span`
  font-weight: 600;
  font-size: 10px;
  color: #22212a;
`;

/** 드롭다운 정보 값 (일반 텍스트) */
export const DropdownInfoValue = styled.span`
  font-weight: 400;
  font-size: 10px;
  color: #22212a;
`;

/** 드롭다운 정보 구분선 */
export const DropdownInfoDivider = styled.div`
  width: 1px;
  height: 12px;
  background-color: #e0e0e0;
`;
