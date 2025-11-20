import type { DropdownOption } from "xiilab-ui";

import { PAGE_META } from "@/shared/constants/page-meta";

/** 노드 메뉴 아이콘 */
export const NODE_MENU_ICON = PAGE_META["admin.node"]?.iconName;
/** 노드 정렬 옵션 */
export const NODE_SORT_OPTIONS: DropdownOption[] = [
  { value: "CREATED_AT_DESC", label: "생성일순" },
  { value: "CPU_USAGE_DESC", label: "CPU 사용량순" },
  { value: "MEMORY_USAGE_DESC", label: "Memory 사용량순" },
  { value: "GPU_USAGE_DESC", label: "GPU 사용량순" },
  { value: "STORAGE_USAGE_DESC", label: "Storage 사용량순" },
  { value: "NODE_NAME_DESC", label: "노드 이름순" },
  { value: "STATUS_DESC", label: "상태순" },
  { value: "NODE_TYPE_DESC", label: "노드 타입순" },
];
