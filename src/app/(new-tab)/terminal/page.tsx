"use client";

import dynamicImport from "next/dynamic";
import { useSearchParams } from "next/navigation";
import styled from "styled-components";

// WorkloadTerminal을 동적 import (SSR 비활성화)
const WorkloadTerminal = dynamicImport(
  () =>
    import("@/components/common/terminal/workload-terminal").then(
      (mod) => mod.WorkloadTerminal,
    ),
  { ssr: false },
);

export default function TerminalPage() {
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

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #1c1c1c;
`;
