import type { Registry, RegistryImage } from "@/types/registry/registry.model";

const LIST_DEMO: Registry[] = Array.from({ length: 20 }, (_, index) => ({
  id: `private-registry-${index + 1}`,
  name: `Registry Name ${index + 1}`,
  ownerName: "김철수",
  imageCount: 12,
  storageUsage: "45.2 GB",
  creatorDate: "2024-01-15",
}));

const LIST_ITEM_DEMO: RegistryImage[] = Array.from(
  { length: 5 },
  (_, index) => ({
    id: index + 1,
    projectId: 101,
    name: `container-image-${index + 1}`,
    description: "버전 1.2에 대한 개발 환경 스냅샷, 업데이트된 종속성 포함",
    tagCnt: 5,
    pullCnt: 234,
    createTime: "2024-01-15T09:30:00Z",
    updateTime: "2024-01-20T14:45:00Z",
    status: "SUCCESSED",
  }),
);

const privateRegistryListConstants = {
  // 페이지 크기
  pageSize: 10,
  imagePageSize: 5,
  // 목록 데모 데이터
  listDemo: LIST_DEMO,
  listItemDemo: LIST_ITEM_DEMO,
};

export default privateRegistryListConstants;
