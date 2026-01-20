import type { HttpHandler } from "msw";

import { getAdminStorageMock } from "@/api/generated/admin-storage/admin-storage.msw";
import { storageListOverrideHandlers } from "@/domain/storage/mocks/storage-list.override";

export const storageHandlers: HttpHandler[] = [
  ...storageListOverrideHandlers,
  ...getAdminStorageMock(),
];
