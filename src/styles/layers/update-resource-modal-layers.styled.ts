import styled from "styled-components";

export const UpdateResourceModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const UpdateResourceModalWorkspace = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border: 1px solid #1f5bff;
  background-color: #f2f5ff;
  border-radius: 4px;
`;

export const UpdateResourceModalWorkspaceRight = styled.div``;

export const UpdateResourceModalWorkspaceLeft = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
`;

export const UpdateResourceModalIconWrapper = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 2px;
  border: 1px solid #c1ceff;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;

  --icon-fill: #005eff;
`;

export const UpdateResourceModalIconDescription = styled.div`
  font-weight: 600;
  font-size: 12px;
  line-height: 12px;
  color: #000;
`;

export const UpdateResourceModalWorkspaceName = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: #000;
`;

export const UpdateResourceModalResource = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const UpdateResourceModalResourceHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const UpdateResourceModalResourceTitle = styled.div`
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  color: #000;
`;
