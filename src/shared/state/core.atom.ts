import { atom } from "jotai";

import type { WorkspaceListType } from "@/domain/workspace/schemas/workspace.schema";

/** 선택된 워크스페이스 */
export const selectedWorkspaceAtom = atom<WorkspaceListType | null>({
  id: "test",
  name: "test-workspace",
  creatorName: "test-user",
  creatorDate: "2025-01-01",
  gpu: 0,
  gpuUsage: 0,
  gpuQuota: 0,
  cpu: 0,
  cpuUsage: 0,
  cpuQuota: 0,
  mem: 0,
  memUsage: 0,
  memQuota: 0,
});
