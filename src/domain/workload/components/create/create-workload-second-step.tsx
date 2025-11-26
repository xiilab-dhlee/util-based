"use client";

import styled from "styled-components";

// import { CreateWorkloadGpu } from "./create-workload-gpu";
import { CreateWorkloadImage } from "./create-workload-image";
import { CreateWorkloadNode } from "./create-workload-node";
import { CreateWorkloadResource } from "./create-workload-resource";

export function CreateWorkloadSecondStep() {
  return (
    <Container>
      {/* 1. 노드, 라벨 컨테이너 */}
      <CreateWorkloadNode />
      {/* 2. GPU 컨테이너 */}
      {/* <CreateWorkloadGpu /> */}
      {/* 3. 자원 컨테이너 */}
      <CreateWorkloadResource />
      {/* 4. 이미지 컨테이너 */}
      <CreateWorkloadImage />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
