import type { DropdownOption } from "xiilab-ui";

export const WORKSPACE_SORT_OPTIONS: DropdownOption[] = [
  { value: "CREATED_AT_DESC", label: "생성일순" },
  { value: "MEM_ASSIGN_DESC", label: "Memory 할당순" },
  { value: "MEM_USE_DESC", label: "Memory 사용량순" },
  { value: "GPU_ASSIGN_DESC", label: "GPU 할당순" },
  { value: "GPU_USE_DESC", label: "GPU 사용량순" },
  { value: "CPU_ASSIGN_DESC", label: "CPU 할당순" },
  { value: "CPU_USE_DESC", label: "CPU 사용량순" },
  { value: "CREATOR_DESC", label: "사용자 이름순" },
  { value: "WORKSPACE_NAME_DESC", label: "워크스페이스 이름순" },
];
