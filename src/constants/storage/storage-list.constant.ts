import type { Storage } from "@/types/storage/storage.model";

const LIST_DEMO: Storage[] = Array.from({ length: 12 }, (_, index) => ({
  storageId: index + 1,
  storageName: `storage-${index + 1}`,
  storageType: `storage-type-${index + 1}`,
}));

const storageListConstants = {
  // 목록 데모 데이터
  listDemo: LIST_DEMO,
};

export default storageListConstants;
