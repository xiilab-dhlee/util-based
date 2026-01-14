import styled from "styled-components";

export const TreeContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;

  --tree-indent-size: 24px;
  --tree-leaf-size: 12px;
  --tree-leaf-border-color: #d6deee;
`;

export const Indent = styled.div`
  min-width: var(--tree-indent-size);
  height: var(--tree-indent-size);
  position: relative;
`;

export const IndentStart = styled.div`
  position: absolute;
  top: 50%;
  left: var(--tree-leaf-size);
  border-top: 1px solid var(--tree-leaf-border-color);
  border-left: 1px solid var(--tree-leaf-border-color);
  width: var(--tree-leaf-size);
  height: var(--tree-leaf-size);
`;

export const IndentBridge = styled.div`
  position: absolute;
  left: var(--tree-leaf-size);
  border-left: 1px solid var(--tree-leaf-border-color);
  width: var(--tree-leaf-size);
  height: 100%;
`;

export const IndentEnd = styled.div`
  position: absolute;
  left: 50%;
  top: 0;
  border-bottom: 1px solid var(--tree-leaf-border-color);
  border-left: 1px solid var(--tree-leaf-border-color);
  width: var(--tree-leaf-size);
  height: var(--tree-leaf-size);
`;
