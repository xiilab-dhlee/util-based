import type {
  RegistryImageFilterRequestOrder,
  RegistryImageFilterRequestSort,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";

/** 프라이빗 레지스트리 정렬 상태 타입 */
export type PrivateRegistrySortState = {
  field: RegistryImageFilterRequestSort;
  order: RegistryImageFilterRequestOrder;
};
