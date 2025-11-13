import { Spin } from "antd";
import styled from "styled-components";

export function MySpinner() {
  return (
    <Container>
      <Spin size="large" />
    </Container>
  );
}


const Container = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
`;
