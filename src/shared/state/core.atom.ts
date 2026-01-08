import { atom } from "jotai";

import type { WorkspaceResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";

/** 선택된 워크스페이스 */
export const selectedWorkspaceAtom = atom<WorkspaceResponse | null>(null);
