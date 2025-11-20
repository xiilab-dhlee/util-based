import styled from "styled-components";

interface NodeListIpProps {
  ip: string;
  // NONE, MPS, MIG
  type: string;
}

export function NodeListIp({ ip, type }: NodeListIpProps) {
  if (type === "NONE") {
    return <span>{ip}</span>;
  }

  return (
    <Container className={type}>
      <Item>{ip}</Item>
      <Item>
        <GpuVirtualizationType>{type}</GpuVirtualizationType>
      </Item>
    </Container>
  );
}

const Container = styled.div`
  border: 1px solid var(--border-color);
  background-color: var(--bg-color);
  padding: 5px;
  display: flex;
  jusitfy-content: space-between;
  align-items: center;
  border-radius: 2px;

  &.MPS {
    --border-color: #8eb5ff;
    --bg-color: #f5f9ff;
  }

  &.MIG {
    --border-color: #bb9cff;
    --bg-color: #f7f5ff;
  }
`;

const GpuVirtualizationType = styled.div`
  font-weight: 500;
`;

const Item = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;

  & + & {
    margin-left: 4px;
    padding-left: 4px;
    border-left: 1px solid #c1c7ce;
  }
`;
