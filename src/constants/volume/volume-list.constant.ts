import type { MySelectOption } from "@/components/common/select";

const STORAGE_TYPE: MySelectOption[] = [
  {
    label: "AstraGo Storage",
    value: "ASTRAGO",
  },
  {
    label: "On-premise Storage",
    value: "LOCAL",
  },
];

const volumeListConstants = {
  // 페이지 크기
  pageSize: 12,
  // 스토리지 타입
  storageType: STORAGE_TYPE,
};

export default volumeListConstants;
