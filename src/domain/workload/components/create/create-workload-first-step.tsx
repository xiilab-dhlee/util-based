"use client";

import styled from "styled-components";

import { CreateWorkloadImport } from "@/domain/workload/components/create/create-workload-import";
import { CreateWorkloadJobType } from "@/domain/workload/components/create/create-workload-job-type";
import { CreateWorkloadTitle } from "@/domain/workload/components/create/create-workload-title";

export function CreateWorkloadFirstStep() {
  return (
    <Container>
      {/* 워크스페이스 및 기존 워크로드 정보 가져오기 */}
      <CreateWorkloadImport />
      {/* 잡 타입 선택 */}
      <CreateWorkloadJobType />
      {/* 워크로드 제목 및 설명 설정 */}
      <CreateWorkloadTitle />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
