"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import styled from "styled-components";

import { WorkloadTerminal } from "@/components/common/terminal/workload-terminal";

/**
 * 터미널 페이지
 *
 * App Router에서 클라이언트 컴포넌트로 구현된 터미널 페이지입니다.
 * 기존 Pages Router와 동일한 WorkloadTerminal 컴포넌트를 사용합니다.
 */
function TerminalPageContent() {
  const searchParams = useSearchParams();

  const workspaceId = searchParams?.get("workspaceId") || "";
  const workloadId = searchParams?.get("id") || "";
  const workloadType = searchParams?.get("type") || "";

  return (
    <Container>
      <WorkloadTerminal
        workspaceId={workspaceId}
        workloadId={workloadId}
        workloadType={workloadType}
      />
    </Container>
  );
}

export default function TerminalPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TerminalPageContent />
    </Suspense>
  );
}

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #1c1c1c;
`;
